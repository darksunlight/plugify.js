export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error: APIError | null;
}

export enum APIError {
    UNKNOWN,
    MISSING_TOKEN,
    INCORRECT_TOKEN,
    INVALID_DATA,
    INVALID_CAPTCHA_RESPONSE,
    INVALID_EMAIL,
    EMAIL_USED,
    USERNAME_CLAIMED,
    NO_SUCH_USER,
    NO_SUCH_GROUP,
    INCORRECT_PASSWORD,
    NOT_VERIFIED,
    INVALID_VERIFICATION_TOKEN,
    NO_SUCH_INVITE,
    NOT_ENOUGH_PERMS,
    NO_INVITE_CODE,
    INVALID_USERNAME,
    ALREADY_IN_GROUP,
}

export type APIErrorCode = keyof typeof APIError;

// https://stackoverflow.com/a/59461369/15517071, CC BY-SA 4.0 Troy Weber via StackOverflow
export const API_ERROR_CODES = new Map<APIError, APIErrorCode>(
    Object.entries(APIError).map(([key, value]:[APIErrorCode, APIError]) => [value, key])
);

export class PlugifyAPIError extends Error {
    public constructor(msg: string, method: string, path: string, code: number | string) {
        super(`[PlugifyAPIError:${code}:${method.toUpperCase()}] ${path} - ${msg}`);
    }
}