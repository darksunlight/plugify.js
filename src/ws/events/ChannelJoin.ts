import { WSChannelJoin } from '../../api-typings';

import type { Client } from '../../structures/Client';
import { TextChannel } from '../../structures';
import { events } from '../../typings';

import Event from './Event';

export default class ChannelJoinEvent extends Event {
    public constructor(client: Client) {
        super(client);
    }

    public ingest(data: WSChannelJoin): (boolean | (string | undefined))[] {
        if (data) {
            const group = this.client.groups!.cache.get(data.data.channel.groupId);
            const newChannel = new TextChannel(
                this.client,
                data.data.channel,
                group,
            )!;
            this.client.joinedChannel = newChannel;
            this.client.channels!.cache.set(newChannel.id, newChannel);
            this.client.emit(events.CHANNEL_JOIN, newChannel);
            return [true];
        }
        return [false, 'passthrough'];
    }
}