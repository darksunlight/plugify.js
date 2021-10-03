import { WSMessageNew } from '../../api-typings';

import type { Client } from '../../structures/Client';
import { Message } from '../../structures/Message';
import { PartialChannel, TextChannel } from '../../structures';
import { events } from '../../typings';

import Event from './Event';

export default class MessageNewEvent extends Event {
    public constructor(client: Client) {
        super(client);
    }

    public ingest(data: WSMessageNew): (boolean | (string | undefined))[] {
        if (data) {
            let channel = !this.client.options?.allRooms ? this.client.joinedChannel : null;
            this.client.channels.cache.set(channel.id, channel);

            const newMessage = new Message(
                this.client,
                data.data,
                channel,
            )!;
            channel.messages!.cache.set(newMessage.id, newMessage);
            this.client.emit(events.MESSAGE_NEW, newMessage);
            return [true];
        }
        return [false, 'passthrough'];
    }
}