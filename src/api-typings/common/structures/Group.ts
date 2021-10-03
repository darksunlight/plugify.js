import { APIChannel, APIMessageAuthor } from "./Channel";
export interface APIGroup {
    name: string;
    avatarURL: string;
    id: string;
    createdAt?: string;
    updatedAt?: string;
    channels?: APIChannel[];
    members?: APIMessageAuthor[];
}