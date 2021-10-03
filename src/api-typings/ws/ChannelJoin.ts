import { APIChannel, APIMessage } from '../common';
import { WSEvent } from './Event';
export interface WSChannelJoin extends WSEvent {
    data: {
        channel: APIChannel;
        history: APIMessage[];
    };
}