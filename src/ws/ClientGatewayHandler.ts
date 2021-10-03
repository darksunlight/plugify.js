import WebSocket from 'ws';

import type { Client } from '../structures/Client';
import { events } from '../typings';
import MessageNewEvent from './events/MessageNew';
import GroupNewEvent from './events/GroupNew';
import GatewayHandler from './GatewayHandler';
import { GatewayEvent, WSEvent, WSGroupNew, WSMessageNew } from '../api-typings';

export class ClientGatewayHandler extends GatewayHandler {
    public lastPing: number | null = null;
    private reconnectionAmnt = 0;

    public events = {
        messageNew: new MessageNewEvent(this.client),
        groupNew: new GroupNewEvent(this.client),
    };
    public constructor(client: Client) {
        super(client);
    }

    public init(): this | null {
        if (this.ws) return this;
        const socketURL = 'wss://api.plugify.cf/';
        this.ws = new WebSocket(socketURL);
        this.ws
            .on('open', () => {
                this.connectedAt = new Date();

                this.heartbeater.start(10000);
            })
            .on('message', (incomingData: string) => {
                const data = JSON.parse(incomingData);
                this.dataReceived(data);
            })
            .on('close', (...closeData: unknown[]) => {
                const shouldntReconnect =
                    this.client.options?.ws?.disallowReconnect ||
                    this.reconnectionAmnt >= (this.client.options?.ws?.reconnectLimit ?? Infinity);
                this.client.destroy(!shouldntReconnect);

                if (shouldntReconnect) return this.client.emit('disconnected', closeData);
                this.reconnectionAmnt++;
                this.client.emit('reconnecting', closeData);
            });
        return this;
    }

    public dataReceived(incomingData: WSEvent): void {
        try {
            const { event, data } = incomingData;
            this.client.emit('raw', event, data);
            switch (Number(event)) {
                case GatewayEvent.WELCOME: {
                    this.ws.send(JSON.stringify({ event: 1, data: { token: this.client._token } }));
                    break;
                }

                case GatewayEvent.PING: {
                    this.lastPing = Date.now();
                    this.ping = this.lastPing - this.heartbeater.lastPingSentAt;
                    break;
                }
                
                case GatewayEvent.AUTHENTICATE_ERROR: {
                    throw new Error(`Failed to authenticate. Details: ${data}`);
                }

                case GatewayEvent.AUTHENTICATE_SUCCESS: {
                    this.client.emit(events.READY);
                    break;
                }

                case GatewayEvent.MESSAGE_NEW: {
                    this.events.messageNew.ingest(data as WSMessageNew);
                }

                case GatewayEvent.JOINED_NEW_GROUP: {
                    this.events.groupNew.ingest(data as WSGroupNew);
                }
            }
        } catch (e) {
            this.client.emit('error', e);
        }
    }
}