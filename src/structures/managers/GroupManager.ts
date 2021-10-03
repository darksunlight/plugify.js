import type { APIGroup, APIInvite } from '../../api-typings';

import { TextChannel } from '../Channel';
import type { Client } from '../Client';
import { Group } from '../Group';
import { MessageAuthor } from '../MessageAuthor';
import { BaseManager } from './BaseManager';

export class GroupManager extends BaseManager<APIGroup, Group> {
    public constructor(client: Client) {
        super(client, Group, { maxSize: client.options?.cache?.cacheMaxSize?.groupsCache });
    }

    public static resolve(group: string | Group): string {
        return group instanceof Group ? group.id : group;
    }

    /**
     * Creates an Invite for the Team
     * @param team The ID or team object of the Team.
     * @returns The ID of the created Invite
     */
    public createInvite(group: string | Group, options?: { uses?: number | null, expires?: Date | null }): Promise<Partial<APIInvite>> {
        const groupID = GroupManager.resolve(group);
        return this.client.rest.post('/invites/create', {
            id: groupID,
            uses: options?.uses ?? null,
            expires: options?.expires ?? null,
        }).then(x => x.data);
    }

    public createChannel(
        group: string | Group,
        name: string,
    ): Promise<TextChannel> {
        const groupID = GroupManager.resolve(group);
        return this.client.rest.post<TextChannel>('/channels/create', {
            name,
            groupID,
            type: 'text',
        }).then(x => x.data);
    }

    /**
     * Fetch a team, will retrieve from cache if exists
     * @param id the ID of the team to fetch.
     * @param cache Whether to cache the fetched Team or not.
     */
    public fetch(id: string, cache = true): Promise<Group> {
        return this.client.rest.get<APIGroup>(`/groups/info/${id}`).then(data => {
            const cachedGroup = this.client.groups.cache.get(id);

            if (cache && cachedGroup) {
                cachedGroup.patch(data.data);
                for (const member of data.data.members) {
                    const existingMember = cachedGroup.members.cache.get(member.name);
                    if (existingMember) existingMember.patch(member);
                    else cachedGroup.members.cache.set(member.name, new MessageAuthor(this.client, Object.assign(member, { id: member.name })));
                }
            }

            return cachedGroup ?? new Group(this.client, data.data);
        });
    }
}