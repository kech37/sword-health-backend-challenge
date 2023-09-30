import { Channel, ConsumeMessage, Message, Replies } from 'amqplib';
import { LoggerInstance } from '../logger-service';

type ChannelListenerCallback = (message: ConsumeMessage) => void;

interface ChannelListener {
  queue: string;
  callback: ChannelListenerCallback;
}

export class MessageBrokerChannel {
  tag: string;

  listeners: ChannelListener[] = [];

  logger: LoggerInstance;

  channel?: Channel;

  assertQueues: string[] = [];

  constructor(tag: string, logger: LoggerInstance) {
    this.tag = tag;
    this.logger = logger.child({
      tag,
    });
  }

  assertExchange(name: string): void {
    this.logger.info({ name }, 'MessageBrokerChannel: assertExchange');
    this.channel?.assertExchange(name, 'topic', {
      durable: true,
    });
  }

  bindQueue(exchange: string, queue: string, pattern: string): void {
    this.logger.info({ queue, exchange, pattern }, 'MessageBrokerChannel: bindQueue');
    this.channel?.bindQueue(queue, exchange, pattern);
  }

  assertQueue(name: string): void {
    this.logger.info({ name }, 'MessageBrokerChannel: assertQueue');
    this.assertQueues.push(name);
    this.channel?.assertQueue(name, { durable: true });
  }

  addListener(queue: string, callback: ChannelListenerCallback): void {
    this.logger.info({ queue }, 'MessageBrokerChannel: addListener');
    this.listeners.push({ queue, callback });
    this.channel?.consume(queue, (msg) => {
      this.logger.info({ queue, deliveryTag: msg?.fields.deliveryTag, redelivered: msg?.fields.redelivered }, 'MessageBrokerChannel: receivedMessage');
      if (msg) {
        callback(msg);
      }
    });
  }

  publishMessage(exchange: string, routingKey: string, msg: string): boolean {
    this.logger.info({ exchange, routingKey, msg }, 'MessageBrokerChannel: publishMessage');
    return this.channel?.publish(exchange, routingKey, Buffer.from(msg)) ?? false;
  }

  async performAssertions(): Promise<void> {
    this.logger.info('MessageBrokerChannel: performAssertions');
    await Promise.all(this.assertQueues.map((e) => this.channel?.assertQueue(e, { durable: true })));
  }

  async reconnectListeners(): Promise<(Replies.Consume | undefined)[]> {
    this.logger.info('MessageBrokerChannel: reconnectListeners');
    return Promise.all(
      this.listeners.map(
        ({ queue, callback }) =>
          this.channel?.consume(queue, (msg) => {
            if (msg) {
              callback(msg);
            }
          }),
      ),
    );
  }

  ack(msg: Message): boolean {
    this.logger.info({ deliveryTag: msg.fields.deliveryTag }, 'MessageBrokerChannel: ack');
    return !!this.channel?.ack(msg);
  }

  nack(msg: Message, requeue?: boolean): boolean {
    this.logger.info({ deliveryTag: msg.fields.deliveryTag, requeue }, 'MessageBrokerChannel: nack');
    return !!this.channel?.nack(msg, requeue);
  }
}
