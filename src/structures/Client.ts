import { EventEmitter } from 'events';
import { RestManager } from '../rest';
import { ClientGatewayHandler } from '../ws/ClientGatewayHandler';
import { ChannelManager } from './managers/ChannelManager';
import { GroupManager } from './managers/GroupManager';
import { User } from './User';
import { TextChannel } from './Channel';
import { ClientOptions, LoginOptions } from '../typings';
import { UserManager } from './managers';

export class Client extends EventEmitter implements clientEvents {

    public readonly rest: RestManager = new RestManager({
        apiURL: this.options?.rest?.apiURL ?? 'api.plugify.cf/v2',
    });

    public user: any | null = null;
    public gateway: ClientGatewayHandler | null = null;
    private _token: string;
    public joinedChannel: TextChannel;
    public loginOptions: LoginOptions | null = null;
    
    public readonly channels = new ChannelManager(this);
    public readonly groups = new GroupManager(this);
    public readonly users = new UserManager(this);

    public constructor(public readonly options?: Partial<ClientOptions>) {
        super();
    }

    public async login(options: string | LoginOptions): Promise<this> {
        if (typeof options === 'string') {
            this._token = options;
        } else {
            this.loginOptions = options;
            this._token = options.token;
        }
        
        this.gateway = new ClientGatewayHandler(this).init();
        this.rest.setToken(this._token);
        return this;
    }

    public destroy(intentionToReconnect = false): void {
        if (intentionToReconnect) {
            return this.gateway?.destroy(true);
        } else {
            this.rest.destroy();
            this.gateway?.destroy(false);
        }
        this.emit('disconnected');
    }

    public get token(): string {
        return this._token;
    }
}

export class ClientUser extends User {} // user can't change any settings as of 2021-10-02, making the user of the client identical in the extent of functionalities as other users

export interface clientEvents {
    on(event: 'disconnected', listener: () => unknown): this;
    on(event: 'groupNew', listener: (group: any) => unknown): this;
    on(event: 'messageNew', listener: (message: any) => unknown): this;
    on(event: 'raw', listener: (event_name: string, event_data: Record<string, unknown>) => unknown): this;
    on(event: 'ready', listener: () => unknown): this;
    on(event: 'reconnecting', listener: () => unknown): this;
}