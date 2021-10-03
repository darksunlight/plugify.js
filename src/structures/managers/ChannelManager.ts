import {
    APITextChannel,
    GatewayEvent,
} from '../../api-typings';

import { PartialChannel, TextChannel } from '../Channel';
import type { Client } from '../Client';
import { BaseManager } from './BaseManager';

export class ChannelManager extends BaseManager<APITextChannel, TextChannel | PartialChannel> {
    public constructor(client: Client) {
        super(client, PartialChannel, { maxSize: client.options?.cache?.cacheMaxSize?.channelsCache });
    }

    public static resolve(channel: string | PartialChannel): string {
        return channel instanceof PartialChannel ? channel.id : channel;
    }

    /**
     * Send a message to a channel, using either the object or channel ID.
     * @param channel The ID or channel object of the target channel to send this message to
     */
    public sendMessage(
        channel: string | PartialChannel,
        content: string
    ): void {
        const channelID = ChannelManager.resolve(channel);
        if (this.client.options?.allRooms && this.client.joinedChannel.id !== channelID) {
            this.client.gateway.ws.send(JSON.stringify({ event: GatewayEvent.CHANNEL_JOIN, data: { id: channelID } }));
        }
        return this.client.gateway.ws.send(JSON.stringify({ event: GatewayEvent.MESSAGE_SEND, data: { content: content } }));
    }
}