import { APIGroup } from '../common';
import { WSEvent } from './Event';
export interface WSGroupNew extends WSEvent {
    data: APIGroup;
}