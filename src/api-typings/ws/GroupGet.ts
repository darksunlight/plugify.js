import { APIGroup } from '../common';
import { WSEvent } from './Event';
export interface WSGroupGet extends WSEvent {
    data: APIGroup[];
}