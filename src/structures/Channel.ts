import type {
    APITextChannel,
    APIUser,
    CHANNEL_TYPES,
} from '../api-typings';

import type { BaseData } from '../typings';
import { Base } from './Base';
import { Client } from './Client';
import type { Group } from './Group';
import { MessageManager } from './managers/MessageManager';
import type { Message } from './Message';
import { Role, RolePermissionOverwrite } from './Role';
import type { Team } from './Team';
import type { User } from './User';

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
        this.groupID = _team?.id ?? ('teamId' in data && data.teamId ? data.teamId : null) ?? null;
        this.messages = new MessageManager(this.client, this);
        this.type = data.type!;

        if (patch) this.patch(data);
    }

    /**
     * Getter for retrieving the team this channel belongs to if it is cached.
     */
    public get team(): Team | null {
        return retrieveTeamFromStructureCache({
            _team: this._team,
            client: this.client,
            teamID: this.teamID,
        });
    }

    public patch(data: Partial<APITextChannel>): this {
        return this;
    }

    /**
     * Send a message to this channel.
     * @param content Either a string content or RichEmbed to send to this channel.
     * @param embed A RichEmbed to send to this channel.
     */
    public send(content: string): Promise<Message | string> {
        if (this.type !== 'text') {
            throw new TypeError('Cannot send messages to non-text channels.');
        }
        return this.client.channels.sendMessage(this, content);
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

    public constructor(client: Client, data: APITextChannel, private _group: Group | null) {
        super(client, data, false);
        this.messages = new MessageManager(this.client, this);
        this.description = null;

        this.patch(data);
    }

    /**
     * The group object this channel belongs to, if cached.
     */
    public get group(): Group | null {
        return this._group ?? this.client.groups.cache.get(this.groupID.toString()) ?? null;
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