export const getApiCall =
    (host: string, getAuthorizationBearer: () => string | null) =>
    async (
        {
            url,
            body,
            customMethod,
        }: {url: string; body?: Record<string, any> | FormData; customMethod?: string},
        authenticated = true
    ) => {
        const method = customMethod || (body ? 'POST' : 'GET');
        const authorizationBearer = getAuthorizationBearer();
        if (authenticated && !authorizationBearer) {
            throw new Error('No authorization found');
        }

        const rawResponse = await fetch(`${host}/api${url}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(authenticated ? {Authorization: `Bearer ${authorizationBearer}`} : {}),
            },
            ...(body ? {body: JSON.stringify(body)} : {}),
        });

        if (!rawResponse.ok) {
            throw Error(`ERROR API ${method} RESPONSE ${url}: ${rawResponse.status}`);
        }

        const response = await rawResponse.json();
        return response.data || response;
    };

export type ApiCaller = ReturnType<typeof getApiCall>;
