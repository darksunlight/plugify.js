import { APIMessage } from '../common';
import { WSEvent } from './Event';
export interface WSMessageNew extends WSEvent {
    data: APIMessage;
}