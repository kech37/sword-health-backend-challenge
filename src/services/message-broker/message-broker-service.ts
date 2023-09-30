import client, { Connection, ConsumeMessage } from 'amqplib';
import { Config } from '../../configs/config';
import { UserFacade } from '../../db/facades/user-facade';
import { AppMessageBrokerErrors } from '../../errors/generic/app-errors';
import { SwordHealthBackendChallengeService } from '../../sword-health-backend-challenge-service';
import { ErrorUtils } from '../../utils/error-utils';
import { TypeUtils } from '../../utils/type-utils';
import { UuidUtils } from '../../utils/uuid-utils';
import { LifeCycleManager } from '../life-cicle-manager';
import { MessageBrokerChannel } from './message-broker-channel';

export class MessageBrokerService extends LifeCycleManager {
  service: SwordHealthBackendChallengeService;

  connection?: Connection;

  channels: { [key: string]: MessageBrokerChannel } = {};

  retryDealyMs: number;

  constructor(service: SwordHealthBackendChallengeService, retryDealyMs = 3000) {
    super(service.getLogger);
    this.service = service;

    this.retryDealyMs = retryDealyMs;
  }

  private getChannelName(): string {
    return Config.MESSAGE_BROKER.CHANNEL_NAME;
  }

  private getExchangeName(): string {
    return Config.MESSAGE_BROKER.EXCHANGE_NAME;
  }

  private getQueueName(): string {
    return `${Config.MESSAGE_BROKER.EXCHANGE_NAME}.${Config.MESSAGE_BROKER.QUEUE_NAME}`;
  }

  private getRoutingKey(id: UUID): string {
    return `${Config.MESSAGE_BROKER.EXCHANGE_NAME}.${Config.MESSAGE_BROKER.QUEUE_NAME}.${id}`;
  }

  private cleanConnection(connection?: Connection): void {
    if (this.connection === connection) {
      this.connection = undefined;
    }
  }

  private retryConnection(): void {
    this.logger.warn('MessageBrokerService: retryConnection');
    setTimeout(() => {
      this.start().catch((error) => {
        this.logger.error({ error }, 'retryConnection: error');
        this.retryConnection();
      });
    }, this.retryDealyMs);
  }

  async reconnectChannels(): Promise<void> {
    this.logger.info('MessageBrokerService: reconnectChannels');
    await Promise.all(Object.keys(this.channels).map((e) => this.connectChannel(this.channels[e])));
  }

  async connectChannel(msgBrokerChannel: MessageBrokerChannel): Promise<void> {
    this.logger.info({ msgBrokerChannel }, 'MessageBrokerService: connectChannel');
    if (!this.connection) {
      throw ErrorUtils.createApplicationError(AppMessageBrokerErrors.NotConfigured);
    }

    const channel = await this.connection.createChannel();
    channel.prefetch(1);

    channel.on('close', () => {
      this.logger.info('MessageBrokerService: channelClose');
      msgBrokerChannel.channel = undefined;
      this.reconnectChannels();
    });

    channel.on('error', (error) => {
      this.logger.info({ error, tag: msgBrokerChannel.tag }, 'MessageBrokerService: channelError');
    });

    msgBrokerChannel.channel = channel;

    msgBrokerChannel.performAssertions();
    msgBrokerChannel.reconnectListeners();
  }

  async getChannel(tag: string): Promise<MessageBrokerChannel> {
    if (!this.connection) {
      throw ErrorUtils.createApplicationError(AppMessageBrokerErrors.NotConfigured);
    }

    this.channels[tag] = new MessageBrokerChannel(tag, this.logger);
    await this.connectChannel(this.channels[tag]);

    return this.channels[tag];
  }

  publish(requestId: UUID, userId: UUID, metadata: object): boolean {
    this.logger.info({ requestId, userId, metadata }, 'MessageBrokerService: publish');

    const channel = this.channels[this.getChannelName()];
    if (!channel) {
      throw ErrorUtils.createApplicationError(AppMessageBrokerErrors.ChannelNotFound);
    }
    this.logger.debug({ requestId, channel }, 'publish: channel');

    const isPublished = channel.publishMessage(this.getExchangeName(), this.getRoutingKey(userId), JSON.stringify(metadata));
    this.logger.debug({ requestId, isPublished }, 'publish: isPublished');
    return isPublished;
  }

  private async init(): Promise<void> {
    const connection = await client.connect({
      hostname: Config.MESSAGE_BROKER.HOST,
      port: Config.MESSAGE_BROKER.PORT,
      username: Config.MESSAGE_BROKER.USERNAME,
      password: Config.MESSAGE_BROKER.PASSWORD,
      heartbeat: 60,
    });
    this.logger.debug('start: connected');

    connection.on('close', () => {
      this.cleanConnection(connection);
      this.retryConnection();
    });

    connection.on('error', (error) => {
      this.logger.error({ error }, 'MessageBrokerService: error');
    });

    this.connection = connection;

    const channel = await this.getChannel(this.getChannelName());
    channel.assertExchange(this.getExchangeName());
    channel.assertQueue(this.getQueueName());
    channel.addListener(this.getQueueName(), (msg) => {
      const isAck = this.consumer(msg);
      if (isAck) {
        channel.ack(msg);
      } else {
        channel.nack(msg);
      }
    });
  }

  private consumer(msg: ConsumeMessage): boolean {
    const requestId = UuidUtils.getUuid();
    this.logger.debug({ requestId, msg }, 'MessageBrokerService: consumer');
    try {
      const notification = JSON.parse(msg.content.toString());
      TypeUtils.assertsNotificationModel(notification);

      if (msg.fields.routingKey !== this.getRoutingKey(notification.toUserId)) {
        throw ErrorUtils.createApplicationError(AppMessageBrokerErrors.UnknownRoutingKey);
      }

      this.logger.info({ requestId, notification }, `consumer: Manager [${notification.toUserId}] has a new notification [${notification.id}]!`);
      return true;
    } catch (error) {
      this.logger.error({ requestId, error }, 'consumer: error');
      return false;
    }
  }

  async start(): Promise<void> {
    const requestId = UuidUtils.getUuid();
    this.logger.info({ requestId }, 'MessageBrokerService: start');
    try {
      await this.init();

      const channel = this.channels[this.getChannelName()];
      if (!channel) {
        throw ErrorUtils.createApplicationError(AppMessageBrokerErrors.ChannelNotFound);
      }

      const managers = await UserFacade.getInstance(this.service).getManagers(requestId);
      this.logger.debug({ requestId, managers }, 'start: managers');
      managers.forEach((e) => channel.bindQueue(this.getExchangeName(), this.getQueueName(), this.getRoutingKey(e.id)));
    } catch (error) {
      this.logger.error({ requestId, error }, 'start: error');
    }
  }

  async stop(): Promise<void> {
    await this.connection?.close(); // TODO Check this
  }
}
