export interface APIUser {
    name: string;
    displayName: string | null;
    avatarURL: string;
    email?: string;
    flags: UserFlags;
    proSince: string | null;
    proUntil: string | null;
}

export enum UserFlags {
    Pro = 1 << 0,
    Dev = 1 << 1,
    Early = 1 << 2,
    ClosedBeta = 1 << 3,
    System = 1 << 4,
}