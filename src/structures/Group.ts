import Collection from '@discordjs/collection';
import type { APIGroup, APIInvite } from '../api-typings';

import { Base } from './Base';
import { TextChannel } from './Channel';
import type { Client } from './Client';
import { TeamMemberManager } from './managers/TeamMemberManager';

/**
 * A team is the basis of Guilded, it is where TeamChannels, TeamMembers, and TeamRoles reside.
 */
export class Group extends Base<APIGroup> {

    /**
     * The date in which this team was created
     * @readonly
     */
    public readonly createdAt: Date;

    public members: TeamMemberManager;

    public name!: string;

    /**
     * Icon of this team
     */
    public profilePicture!: string;

    public constructor(client: Client, data: APIGroup) {
        super(client, data);
        this.createdAt = new Date(data.createdAt);
        this.members = new TeamMemberManager(this.client, this);

        this.patch(data);
    }

    public patch(data: Partial<APIGroup> | APIGroup): this {
        if ('name' in data && data.name !== undefined) this.name = data.name;

        if (!this.client.options?.cache?.disableMessageAuthors && 'members' in data && data.members?.length) {
            for (const member of data.members) {
                this.members.add(member);
            }
        }

        return this;
    }

    public get memberCount(): number {
        return this.members.length;
    }

    /**
     * Create an invite to this group
     */
    public createInvite(): Promise<Partial<APIInvite>> {
        return this.client.groups.createInvite(this.id);
    }

    /**
     * Creates a Teamchannel and fires a CreateChannelEvent on success.
     * @hidden
     * @param name The name of the channel.
     * @param contentType The type of the channel.
     * @param channelCategoryID the category's ID to create this channel under.
     * @param isPublic whether or not this channel should be visible to users who aren't in the team.
     * @returns
     */

    public createChannel(
        name: string,
    ): Promise<TextChannel> {
        return this.client.groups.createChannel(
            this.id,
            name,
        );
    }

    public fetch(): Promise<Group> {
        return this.client.groups.fetch(this.id);
    }

    public fetchChannels(cache = true): Promise<Collection<string, TextChannel>> {
        const fetchedChannels = new Collection<string, TextChannel>();

        return this.client.rest.get<APIGroup>(`/groups/info/${this.id}`).then(x => {
            for (const channel of x.data.channels) {
                const newChannel = new TextChannel(this.client, channel, this);
                fetchedChannels.set(newChannel.id, newChannel);

                if (cache) {
                    switch (channel.type) {
                        case 'text': {
                            this.channels.add(newChannel);
                            this.client.channels.add(newChannel);
                            break;
                        }
                    }
                }
            }
            return fetchedChannels;
        });
    }
}