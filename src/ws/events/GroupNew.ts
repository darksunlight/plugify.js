import { WSGroupNew } from '../../api-typings';

import type { Client } from '../../structures/Client';
import { Group } from '../../structures/Group';
import { events } from '../../typings';

import Event from './Event';

export default class GroupNewEvent extends Event {
    public constructor(client: Client) {
        super(client);
    }

    public ingest(data: WSGroupNew): (boolean | (string | undefined))[] {
        if (data) {
            const newGroup = new Group(
                this.client,
                data.data,
            )!;
            this.client.groups!.cache.set(newGroup.id, newGroup);
            this.client.emit(events.GROUP_NEW, newGroup);
            return [true];
        }
        return [false, 'passthrough'];
    }
}