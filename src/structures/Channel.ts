import {
    APITextChannel,
    APIUser,
    CHANNEL_TYPES,
    GatewayEvent,
} from '../api-typings';

import type { BaseData } from '../typings';
import { Base } from './Base';
import { Client } from './Client';
import type { Group } from './Group';
import { MessageManager } from './managers/MessageManager';
import type { Message } from './Message';
import type { User } from './User';
import { retrieveGroupFromStructureCache } from '../util';

/**
 * A partial channel, not enough data received however to construct a full channel type object.
 */
export class PartialChannel extends Base<BaseData> {
    public readonly messages: MessageManager | null;

    public groupID: string | null;

    public readonly type: CHANNEL_TYPES;

    /**
     * The date in which this channel was created.
     * @readonly
     */
    public readonly createdAt: Date;

    /**
     * The user ID belonging to the creator of this Team.
     * @readonly
     */
    public readonly createdBy: string;

    public constructor(
        client: Client,
        data: Partial<APITextChannel>,
        private _group: Group | null,
        patch = true,
    ) {
        super(client, data as { id: string });
        this.groupID = _group?.id ?? ('groupId' in data && data.groupId ? data.groupId : null) ?? null;
        this.messages = new MessageManager(this.client, this);
        this.type = data.type!;

        if (patch) this.patch(data);
    }

    /**
     * Getter for retrieving the team this channel belongs to if it is cached.
     */
    public get group(): Group | null {
        return retrieveGroupFromStructureCache({
            _group: this._group,
            client: this.client,
            groupID: this.groupID,
        });
    }

    public patch(data: Partial<APITextChannel>): this {
        return this;
    }

    public send(content: string): void {
        if (this.type !== 'text') {
            throw new TypeError('Cannot send messages to non-text channels.');
        }
        return this.client.channels.sendMessage(this, content);
    }

    public join(): void {
        this.client.gateway.ws.send(JSON.stringify({ event: GatewayEvent.CHANNEL_JOIN, id: this.id }));
    }
}

/**
 * A channel residing in a Team
 */
export class TextChannel extends PartialChannel {
    /**
     * The type of this channel.
     * @defaultValue "Team"
     * @readonly
     */
    public readonly type = 'text';

    public name!: string;
    public description: string | null;
    public groupID: string;

    public updatedAt: Date | null;
    public createdAt: Date | null;

    /**
     * The manager in charge of messages sent in this channel ONLY IF THIS CHANNEL SUPPORTS MESSAGES
     */
    public readonly messages: MessageManager | null;

    public constructor(client: Client, data: APITextChannel, _group: Group | null) {
        super(client, data, _group);
        this.messages = new MessageManager(this.client, this);
        this.description = null;

        this.patch(data);
    }

    public patch(data: APITextChannel | Partial<APITextChannel>): this {
        if ('name' in data && data.name !== undefined) this.name = data.name ?? null;
        if ('description' in data && data.description !== undefined) this.description = data.description;
        if ('updatedAt' in data && data.updatedAt !== undefined) {
            this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        }
        if ('groupId' in data && data.groupId !== undefined) this.groupID = data.groupId.toString();
        if ('createdAt' in data && data.createdAt !== undefined) {
            this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
        };
        return this;
    }
}