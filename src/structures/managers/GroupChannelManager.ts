import {
    APITextChannel,
} from '../../api-typings';

import { PartialChannel, TextChannel } from '../Channel';
import type { Group } from '../Group';
import type { Client } from '../Client';
import { BaseManager } from './BaseManager';

export class GroupChannelManager extends BaseManager<APITextChannel, TextChannel | PartialChannel> {
    public constructor(client: Client, public readonly group: Group) {
        super(client, PartialChannel, { maxSize: client.options?.cache?.cacheMaxSize?.channelsCache });
    }

    public static resolve(channel: string | PartialChannel): string {
        return channel instanceof PartialChannel ? channel.id : channel;
    }

    public create(
        name: string,
    ): Promise<TextChannel> {
        return this.client.groups.createChannel(
            this.group.id,
            name,
        );
    }
}