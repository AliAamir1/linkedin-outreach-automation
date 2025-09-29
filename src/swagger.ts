import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import {
  SearchQuerySchema,
  SearchResponseSchema,
  ConnectionRequestSchema,
  ConnectionResponseSchema,
  AutomationRequestSchema,
  AutomationResponseSchema,
  RemoveFromListRequestSchema,
  RemoveFromListResponseSchema,
  ErrorResponseSchema
} from './schemas';

const registry = new OpenAPIRegistry();

registry.registerPath({
  method: 'get',
  path: '/api/search/people',
  description: 'Search for people in LinkedIn Sales Navigator. You can search within a specific lead list by providing the leadListId parameter, or use the default lead list if not specified.',
  summary: 'Search LinkedIn people',
  tags: ['Search'],
  request: {
    query: SearchQuerySchema,
  },
  responses: {
    200: {
      description: 'Successful response with people search results including metadata, elements, and pagination',
      content: {
        'application/json': {
          schema: SearchResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad Request - Invalid query parameters (start, count, or leadListId)',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized - Invalid or missing LinkedIn authentication',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/connect',
  description: 'Send a connection request to a LinkedIn user',
  summary: 'Send connection request',
  tags: ['Connection'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ConnectionRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Connection request sent successfully',
      content: {
        'application/json': {
          schema: ConnectionResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    429: {
      description: 'Rate Limited',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/automation',
  description: 'Start AI-powered LinkedIn outreach automation. This endpoint uses Google Gemini AI to personalize connection messages and automatically sends connection requests to leads. It processes leads in batches of up to 100, filters out users with pending invitations, and includes configurable delays between requests.',
  summary: 'AI-powered LinkedIn outreach automation',
  tags: ['Automation'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AutomationRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Automation completed successfully',
      content: {
        'application/json': {
          schema: AutomationResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad Request - Invalid request parameters',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized - Invalid LinkedIn session or missing Google AI API key',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    429: {
      description: 'Rate Limited - Too many requests to LinkedIn API',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error - Google AI API issues or other server errors',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/remove',
  description: 'Remove a person from a LinkedIn Sales Navigator lead list. This endpoint removes a specific person (identified by their entity URN) from a specified lead list.',
  summary: 'Remove person from lead list',
  tags: ['Remove'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: RemoveFromListRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Person successfully removed from lead list',
      content: {
        'application/json': {
          schema: RemoveFromListResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad Request - Invalid request parameters (leadListId or entityUrn)',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized - Invalid LinkedIn session or authentication',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: 'Not Found - Lead list or person not found',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error - LinkedIn API issues or other server errors',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openAPIDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'LinkedIn Sales Navigator API Server',
    version: '1.0.0',
    description: 'A Node.js TypeScript server for interacting with LinkedIn Sales Navigator APIs',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Search',
      description: 'LinkedIn people search operations',
    },
    {
      name: 'Connection',
      description: 'LinkedIn connection request operations',
    },
    {
      name: 'Automation',
      description: 'AI-powered LinkedIn outreach automation',
    },
    {
      name: 'Remove',
      description: 'Remove people from LinkedIn lead lists',
    },
  ],
});

export default openAPIDocument;