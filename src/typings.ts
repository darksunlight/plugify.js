export type constructable<T> = new (...args: any[]) => T;

export enum websocket_opcodes {
    WELCOME,
    AUTHENTICATE,
    AUTHENTICATE_SUCCESS,
    AUTHENTICATE_ERROR,
    CHANNEL_JOIN,
    CHANNEL_JOIN_SUCCESS,
    CHANNEL_JOIN_ERROR,
    MESSAGE_SEND,
    MESSAGE_SEND_SUCCESS,
    MESSAGE_SEND_ERROR,
    MESSAGE_NEW,
    GROUP_GET_REQUEST,
    GROUP_GET_SUCCESS,
    CHANNELS_GET_REQUEST,
    CHANNELS_GET_SUCCESS,
    JOINED_NEW_GROUP,
    PING = 9001,
}

export enum events {
    GROUP_NEW = 'groupNew',
    MESSAGE_NEW = 'messageNew',
    CHANNEL_JOIN = 'channelJoin',
    READY = 'ready',
}

export interface BaseData {
    readonly id: string;
}

export interface ClientOptions {  
    allRooms?: boolean;
    cache?: {
        cacheMaxSize?: {
            groupsCache?: number;
            channelsCache?: number;
            usersCache?: number;
            messageAuthorsCache?: number;
            messagesCache?: number;
        };
        disableGroups?: boolean;
        disableChannels?: boolean;
        disableUsers?: boolean;
        disableMessageAuthors?: boolean;
        disableMessages?: boolean;
    };
    ws?: {
        heartbeatInterval?: number;
        disallowReconnect?: boolean;
        reconnectLimit?: number;
    };
    rest?: {
        apiURL?: string;
    };
}

export interface LoginOptions {
    token: string;
    joinChannel?: string;
}
