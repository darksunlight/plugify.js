import { GatewayEvent, WSGroupGet } from '../../api-typings';

import type { Client } from '../../structures/Client';
import { events } from '../../typings';

import Event from './Event';

export default class GroupGetEvent extends Event {
    public constructor(client: Client) {
        super(client);
    }

    public ingest(data: WSGroupGet): (boolean | (string | undefined))[] {
        if (data) {
            data.data.forEach(group => {
                this.client.groups!.cache.set(group.id, group);
            });
            this.client.emit(events.READY);
            if (this.client.loginOptions?.joinChannel) {
                this.client.gateway.ws.send(JSON.stringify({ event: GatewayEvent.CHANNEL_JOIN, data: { id: this.client.loginOptions.joinChannel } }));
            }
            return [true];
        }
        return [false, 'passthrough'];
    }
}