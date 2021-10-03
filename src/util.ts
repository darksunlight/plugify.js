import type { Client, PartialChannel, Group } from './structures';

export function retrieveGroupFromStructureCache({
    client,
    _group,
    groupID,
}: {
    client: Client;
    _group: Group | null;
    groupID: string | null;
}): Group | null {
    if (_group) return _group;
    if (!groupID) return null;
    const cachedGroup = client.groups.cache.get(groupID);
    return cachedGroup ?? null;
}

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
    const cachedChannel = client.channels.cache.get(channelID) as PartialChannel;
    return cachedChannel ?? null;
}