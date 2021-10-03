import type { APIMessageAuthor } from '../api-typings';

import { Base } from './Base';
import type { Client } from './Client';

interface PJSMessageAuthor extends APIMessageAuthor {
    id: string;
}

export class MessageAuthor extends Base<PJSMessageAuthor> {
    public name!: string;
    public nickname: string | null;
    public avatarURL: string | null;

    public constructor(client: Client, data: PJSMessageAuthor) {
        super(client, data);
        this.nickname = null;
        this.avatarURL = null;

        this.patch(data);
    }

    public patch(data: PJSMessageAuthor | Partial<PJSMessageAuthor>): this {
        data.id = data.username;
        if ('username' in data && data.username !== undefined) this.name = data.username;
        if ('name' in data && data.name !== undefined) this.nickname = data.name;
        if ('avatarURL' in data && data.avatarURL !== undefined) this.avatarURL = data.avatarURL;

        return this;
    }
}