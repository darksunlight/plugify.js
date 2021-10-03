import type { APIMessage } from '../api-typings';
import { Base } from './Base';
import { PartialChannel, TextChannel } from './Channel';
import type { Client } from './Client';
import { MessageAuthor } from './MessageAuthor';
import { User } from './User';
import { retrieveChannelFromStructureCache } from '../util';

export class Message extends Base<APIMessage> {
    public readonly channelID!: string;
    public readonly authorName: string;
    public content!: string;

    public constructor(
        client: Client,
        data: APIMessage,
        private _channel: TextChannel | null,
    ) {
        super(client, data);
        this.authorName = data.author.name;
        this.channelID = client.joinedChannel?.id;
        this.patch(data);
    }

    /**
     * @internal
     */
    public patch(data: APIMessage | Partial<APIMessage>): this {
        return this;
    }

    /**
     * Retrieve the channel object that this message belongs to.
     */
    public get channel(): PartialChannel | null {
        return retrieveChannelFromStructureCache({
            _channel: this._channel,
            channelID: this.channelID,
            client: this.client,
        });
    }

    public get author(): User | null {
        return this.client.users.cache.get(this.authorName) ?? null;
    }
}