import fetch, { Response } from 'node-fetch';

import { APIResponse, API_ERROR_CODES, PlugifyAPIError } from './APIResponse';

export class RestManager {
    public apiURL: string;
    public token?: string;

    public constructor(public config?: RestManagerOptions) {
        this.apiURL = `https://${config?.apiURL ?? 'api.plugify.cf/v2'}`;
    }

    public async make<T extends JSONB>(
        data: MakeOptions,
        retryCount = 0,
    ): Promise<[Response, Promise<APIResponse<T>>]> {
        const headers: HeadersInit = {};
        const requestOptions = {
            body: data.body ? JSON.stringify(data.body) : undefined,
            headers: {
                'authorization': this.token ?? undefined,
                'content-type': 'application/json',
                ...headers,
            },
            method: data.method,
        };

        let request: Response;
        try {
            request = await fetch(this.apiURL + data.path, requestOptions);
        } catch (e) {
            throw new Error(`Error while making API call, ${e.message}`);
        }

        if (!request.ok) {
            if (request.status === 429) {
                if (retryCount >= (this.config?.maxRatelimitRetryLimit ?? 3)) {
                    throw new Error('MAX REQUEST RATELIMIT RETRY LIMIT REACHED.');
                }
                await sleep(this.config?.restOffset ?? 3500);
                return this.make<T>(data, retryCount++);
            }

            const parsedRequest = await request.json().catch(() => ({ message: 'Cannot parse JSON Error Response.' })) as APIResponse<T>;
            throw new PlugifyAPIError(API_ERROR_CODES.get(parsedRequest.error), data.method, data.path, request.status);
        }

        return [request, request.json().catch(() => ({})) as Promise<APIResponse<T>>];
    }

    public get<T extends JSONB>(path: string): Promise<APIResponse<T>> {
        return this.make<T>(
            {
                method: 'GET',
                path,
            },
        ).then(x => x[1]);
    }

    public post<T extends JSONB, B = RequestBodyObject>(path: string, body?: B): Promise<APIResponse<T>> {
        return this.make<T>(
            {
                body,
                method: 'POST',
                path,
            },
        ).then(x => x[1]);
    }

    public delete<T extends JSONB, B = RequestBodyObject>(path: string, body?: B): Promise<APIResponse<T>> {
        return this.make<T>(
            {
                body,
                method: 'DELETE',
                path,
            },
        ).then(x => x[1]);
    }

    public patch<T extends JSONB, B = RequestBodyObject>(path: string, body: B): Promise<APIResponse<T>> {
        return this.make<T>(
            {
                body,
                method: 'PATCH',
                path,
            },
        ).then(x => x[1]);
    }

    public put<T extends JSONB, B = RequestBodyObject>(path: string, body?: B): Promise<APIResponse<T>> {
        return this.make<T>(
            {
                body,
                method: 'PUT',
                path,
            },
        ).then(x => x[1]);
    }

    public setToken(token: string): void {
        this.token = token;
    }

    public destroy(): void {
        this.token = undefined;
    }
}

export interface RestManagerOptions {
    apiURL?: string;
    restOffset?: number;
    maxRatelimitRetryLimit?: number;
}
export interface MakeOptions {
    method: string;
    path: string;
    body?: Record<string, any>;
}
export type JSONB = Record<string, any>;
export type RequestBodyObject = JSONB | undefined;

const sleep = (ms: number): Promise<unknown> => new Promise(r => setTimeout(r, ms));