import { GraphQLFormattedError } from "graphql"
import { GraphQLClient } from "@refinedev/nestjs-query";

type Error = {
    message: string,
    statusCode: string
}

const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem('access-token');

    const headers = options.headers as Record<string,string>;
    
    return await fetch (url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true"
        }
    })
}

const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>):
Error | null => {
    if (!body) {
        return {
            message: 'Unknown error', 
            statusCode: 'INTERNAL_SERVER_ERROR'
        }
    }

    if ("errors" in body) {
        const errors = body?.errors;
        const messages = errors?.map((error) => error?.message)?.join("");
        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || 500
        }
    }
    return null
}

const fetchWrapper = async (url: string, options: RequestInit) => {
    // Build and Deploy a React Admin Dashboard With Real time Data, Charts, Events, Kanban, CRM, and More 21:s19
}