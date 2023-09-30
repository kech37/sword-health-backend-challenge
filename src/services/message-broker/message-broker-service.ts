import client, { Connection } from 'amqplib';
import { Config } from '../../configs/config';
import { UserFacade } from '../../db/facades/user-facade';
import { SwordHealthBackendChallengeService } from '../../sword-health-backend-challenge-service';
import { TypeUtils } from '../../utils/type-utils';
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
      throw new Error('No Connection Available'); // TODO Create custom error
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
      throw new Error('No Connection Available'); // TODO Create custom error
    }

    this.channels[tag] = new MessageBrokerChannel(tag, this.logger);
    await this.connectChannel(this.channels[tag]);

    return this.channels[tag];
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
  }

  async start(): Promise<void> {
    this.logger.info('MessageBrokerService: start');
    try {
      await this.init();

      const channel = await this.getChannel('main-channel');
      channel.assertExchange('notification');
      channel.assertQueue('notification.center');

      channel.addListener('notification.center', (msg) => {
        try {
          const notification = JSON.parse(msg.content.toString());
          if (!TypeUtils.isNotificationModel(notification)) {
            throw new Error(); // TODO
          }

          if (msg.fields.routingKey === `notification.center.${notification.toUserId}`) {
            this.logger.info({ notification }, `Manager [${notification.toUserId}] has a new notification!`);
          } else {
            this.logger.warn({ routingKey: msg.fields.routingKey }, 'Unknow routing key'); // TODO
            channel.nack(msg);
          }
          channel.ack(msg);
        } catch (error) {
          this.logger.error({ error }, 'Consumer: error'); // TODO
          channel.ack(msg);
        }
      });

      const managers = await UserFacade.getInstance(this.service).getManagers();
      this.logger.error({ managers }, 'start: managers');
      managers.forEach((e) => channel.bindQueue('notification', 'notification.center', `notification.center.${e.id}`));
    } catch (error) {
      this.logger.error({ error }, 'start: error');
    }
  }

  async stop(): Promise<void> {
    await this.connection?.close(); // TOD Check this
  }
}
