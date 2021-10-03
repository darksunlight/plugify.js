import type { APIUser } from '../api-typings';

import { Base } from './Base';
import type { Client } from './Client';

interface PJSUser extends APIUser {
    id: string;
}

export class User extends Base<PJSUser> {
    public email: string | null;
    public name!: string;
    public avatarURL: string | null;

    public constructor(client: Client, data: PJSUser) {
        super(client, data);

        this.email = null;
        this.avatarURL = null;

        this.patch(data);
    }

    public patch(data: PJSUser | Partial<PJSUser>): this {
        data.id = data.name;
        if ('email' in data && data.email !== undefined) this.email = data.email ?? null;
        if ('name' in data && data.name !== undefined) this.name = data.name;
        if ('avatarURL' in data && data.avatarURL !== undefined) this.avatarURL = data.avatarURL;
        return this;
    }
}