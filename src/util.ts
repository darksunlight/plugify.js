import type { Client, PartialChannel } from './structures';

export function retrieveChannelFromStructureCache({
    client,
    _channel,
    channelID,
}: {
    client: Client;
    _channel: PartialChannel | null;
    channelID: string | null;
}): PartialChannel | null {
    if (_channel) return _channel;
    if (!channelID) return null;
    const cachedChannel = client.channels.cache.get(channelID);
    return cachedChannel ?? null;
}