import type { Client } from '../Client';
import { MessageAuthor, PJSMessageAuthor } from '../MessageAuthor';
import type { Group } from '../Group';
import { BaseManager } from './BaseManager';

export class MessageAuthorManager extends BaseManager<PJSMessageAuthor, MessageAuthor> {
    public constructor(client: Client, public readonly group: Group) {
        super(client, MessageAuthor, { maxSize: client.options?.cache?.cacheMaxSize?.messageAuthorsCache });
    }

    public static resolve(member: string | MessageAuthor): string {
        return member instanceof MessageAuthor ? member.id : member;
    }
}