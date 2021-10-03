import type { GatewayEvent } from '.';
export interface WSEvent {
    event: GatewayEvent;
    data: any;
}