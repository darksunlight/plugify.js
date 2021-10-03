import GatewayHandler from './GatewayHandler';
import { GatewayEvent } from '../api-typings';

export default class Heartbeater {
    public interval!: NodeJS.Timeout;
    public lastPingSentAt = 0;
    public active = false;

    public constructor(public gateway: GatewayHandler) {}
    public start(interval?: number): void {
        this.active = true;
        this.interval = setInterval(
            this.sendHB.bind(this),
            interval ?? this.gateway.client.options?.ws?.heartbeatInterval ?? 10000,
        );
    }

    public destroy(): void {
        clearInterval(this.interval);
        this.active = false;
    }

    public sendHB(): void {
        if (!this.gateway.ws) return;
        if (this.gateway.ws.readyState !== 1) return;
        this.lastPingSentAt = Date.now();
        this.gateway.ws.send(JSON.stringify({ event: GatewayEvent.PING }));
    }
}