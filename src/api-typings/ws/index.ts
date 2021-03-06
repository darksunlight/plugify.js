export * from './Event';
export * from './ChannelJoin';
export * from './GroupGet';
export * from './GroupNew';
export * from './MessageNew';

export enum GatewayEvent {
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