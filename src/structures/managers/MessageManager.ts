import type { APIMessage } from '../../api-typings';

import type { PartialChannel, TextChannel } from '../Channel';
import type { Client } from '../Client';
import { Message } from '../Message';
import { BaseManager } from './BaseManager';

export class MessageManager extends BaseManager<APIMessage, Message> {
    public constructor(client: Client, public readonly channel: TextChannel | PartialChannel) {
        super(client, Message, { maxSize: client.options?.cache?.cacheMaxSize?.messagesCache });
    }

    public static resolve(message: string | Message): string {
        return message instanceof Message ? message.id : message;
    }
}