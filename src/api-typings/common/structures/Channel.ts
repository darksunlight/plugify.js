export interface APIChannel {
    name: string;
    id: string;
    groupId: string;
    type: CHANNEL_TYPES;
    createdAt?: string;
    updatedAt?: string;
    description: string;
}

export interface APITextChannel extends APIChannel {
    type: 'text';
}

export type CHANNEL_TYPES = 'text';

export interface APIMessage {
    id: string;
    author: APIMessageAuthor;
    content: string;
    timestamp: string;
}

export interface APIMessageAuthor {
    name: string;
    displayName: string;
    avatarURL: string;
    username: string;
}