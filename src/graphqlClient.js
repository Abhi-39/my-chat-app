import { GraphQLClient } from 'graphql-request';
import { createClient } from 'graphql-ws';

const HASURA_GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT;

// HTTP client for queries and mutations
export const gqlClient = new GraphQLClient(HASURA_GRAPHQL_ENDPOINT, {
  headers: {
    'x-hasura-admin-secret': '6,yWjR%t7Q6amM=G6#1ps=*TTdvox#f:', // if needed
  },
});

// WebSocket client for subscriptions
export const wsClient = createClient({
  url: HASURA_GRAPHQL_ENDPOINT.replace(/^http/, 'ws'),
  connectionParams: {
    headers: {
      'x-hasura-admin-secret': '6,yWjR%t7Q6amM=G6#1ps=*TTdvox#f:',
    },
  },
});

const subdomain = process.env.REACT_APP_NHOST_SUBDOMAIN;
const region = process.env.REACT_APP_NHOST_REGION;
const graphqlEndpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT;

export { subdomain, region, graphqlEndpoint };