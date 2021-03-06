import type { Client } from '../../structures/Client';

export default abstract class Event {
    public constructor(public client: Client) {}
    public abstract ingest(data: unknown): (boolean | (string | undefined))[];
}