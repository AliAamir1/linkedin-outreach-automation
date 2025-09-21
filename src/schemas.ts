import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CurrentPositionSchema = z.object({
  posId: z.number(),
  current: z.boolean(),
  companyName: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startedOn: z.object({
    month: z.number(),
    year: z.number(),
  }).optional(),
  tenureAtPosition: z.object({
    numYears: z.number(),
    numMonths: z.number(),
  }).optional().nullable(),
  tenureAtCompany: z.object({
    numYears: z.number(),
    numMonths: z.number(),
  }).optional().nullable(),
}).openapi({
  description: 'Current position information for a person',
  example: {
    posId: 1,
    current: true,
    companyName: 'Symmetry Physiotherapy + Rehabilitation',
    title: 'Physiotherapist, Clinic Owner',
    description: 'Providing injury specific hands-on therapy...',
    startedOn: { month: 12, year: 2015 },
    tenureAtPosition: { numYears: 9, numMonths: 10 },
    tenureAtCompany: { numYears: 9, numMonths: 10 }
  }
});

export const OutreachActivitySchema = z.object({
  domainSource: z.string(),
  targetName: z.string(),
  performedAt: z.number(),
  actorName: z.string(),
  salesLead: z.number(),
  activityType: z.string(),
}).openapi({
  description: 'Outreach activity information',
  example: {
    domainSource: 'SALES_NAVIGATOR',
    targetName: 'Joanna Chim',
    performedAt: 1758444655742,
    actorName: 'Ali Aamir',
    salesLead: 129240593,
    activityType: 'SEND_INVITATION'
  }
});

export const PersonElementSchema = z.object({
  objectUrn: z.string(),
  entityUrn: z.string(),
  personId: z.string(),
  fullName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  geoRegion: z.string(),
  saved: z.boolean(),
  pendingInvitation: z.boolean(),
  degree: z.number(),
  uniquePositionCompanyCount: z.number(),
  listCount: z.number(),
  currentPositions: z.array(CurrentPositionSchema.partial()),
  dateAddedToListAt: z.number(),
  lastUpdatedTimeInListAt: z.number(),
  newListEntitySinceLastViewed: z.boolean(),
  entityNotesCount: z.number(),
  spotlightBadges: z.array(z.any()),
  seniorityV2s: z.array(z.any()),
  outreachActivity: OutreachActivitySchema.optional(),
}).openapi({
  description: 'A person element from LinkedIn search results',
  example: {
    objectUrn: 'urn:li:member:129240593',
    entityUrn: 'urn:li:fs_salesProfile:(ACwAAAe0DhEB4Ei9v4Om_MtYqcUHb1WkFa0yT7U,NAME_SEARCH,P8ez)',
    personId: 'ACwAAAe0DhEB4Ei9v4Om_MtYqcUHb1WkFa0yT7U',
    fullName: 'Joanna Chim',
    firstName: 'Joanna',
    lastName: 'Chim',
    headline: 'MScPT, MClScPT, CAFCI, FCAMPT. Physiotherapist, Owner of Symmetry Physiotherapy + Rehabilitation',
    summary: 'Joanna Chim is a graduate of the 2008 McMaster University Physiotherapy program...',
    geoRegion: 'Toronto, Ontario, Canada',
    saved: true,
    pendingInvitation: true,
    degree: 3,
    uniquePositionCompanyCount: 1,
    listCount: 1,
    currentPositions: [{
      posId: 1,
      current: true,
      companyName: 'Symmetry Physiotherapy + Rehabilitation',
      title: 'Physiotherapist, Clinic Owner'
    }],
    dateAddedToListAt: 1757625366520,
    lastUpdatedTimeInListAt: 1757625366520,
    newListEntitySinceLastViewed: false,
    entityNotesCount: 0,
    spotlightBadges: [],
    seniorityV2s: []
  }
});

export const ListOwnerInfoSchema = z.object({
  fullName: z.string(),
  profileUrn: z.string(),
  profile: z.string(),
}).openapi({
  description: 'Information about the list owner',
  example: {
    fullName: 'Ali Aamir',
    profileUrn: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
    profile: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)'
  }
});

export const ListPivotResponseSchema = z.object({
  name: z.string(),
  totalCount: z.number(),
  listOwnerInfo: ListOwnerInfoSchema,
  role: z.string(),
  listSource: z.string(),
  createdAt: z.number(),
  lastUpdatedAt: z.number(),
  lastViewedAt: z.number(),
  lastModifiedBy: z.string(),
  lastModifiedByUrn: z.string(),
  shared: z.boolean(),
  unsavedEntityCounts: z.number(),
}).openapi({
  description: 'Information about the lead list',
  example: {
    name: 'Chiropractor\'s Canada',
    totalCount: 386,
    listOwnerInfo: {
      fullName: 'Ali Aamir',
      profileUrn: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
      profile: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)'
    },
    role: 'OWNER',
    listSource: 'MANUAL',
    createdAt: 1757540389862,
    lastUpdatedAt: 1758446788072,
    lastViewedAt: 1758452311020,
    lastModifiedBy: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
    lastModifiedByUrn: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
    shared: false,
    unsavedEntityCounts: 0
  }
});

export const MetadataSchema = z.object({
  totalDisplayCount: z.string(),
  pivot: z.object({
    'com.linkedin.sales.search.ListPivotResponse': ListPivotResponseSchema,
  }),
  tracking: z.object({
    requestId: z.string(),
    sessionId: z.string(),
  }),
}).openapi({
  description: 'Metadata from the LinkedIn API response',
  example: {
    totalDisplayCount: '383',
    pivot: {
      'com.linkedin.sales.search.ListPivotResponse': {
        name: 'Chiropractor\'s Canada',
        totalCount: 386,
        listOwnerInfo: {
          fullName: 'Ali Aamir',
          profileUrn: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
          profile: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)'
        },
        role: 'OWNER',
        listSource: 'MANUAL',
        createdAt: 1757540389862,
        lastUpdatedAt: 1758446788072,
        lastViewedAt: 1758452311020,
        lastModifiedBy: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
        lastModifiedByUrn: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
        shared: false,
        unsavedEntityCounts: 0
      }
    },
    tracking: {
      requestId: 'q9PZ/dB9SBy2JOzfsywb4A==',
      sessionId: '/mcpIgqVRmGiGoPH7kkmPw=='
    }
  }
});

export const PagingSchema = z.object({
  total: z.number(),
  count: z.number(),
  start: z.number(),
  links: z.array(z.any()),
}).openapi({
  description: 'Pagination information',
  example: {
    total: 383,
    count: 1,
    start: 125,
    links: []
  }
});

export const SearchResponseSchema = z.object({
  metadata: MetadataSchema,
  elements: z.array(PersonElementSchema),
  paging: PagingSchema,
}).openapi({
  description: 'Response from LinkedIn people search API',
  example: {
    metadata: {
      totalDisplayCount: '383',
      pivot: {
        'com.linkedin.sales.search.ListPivotResponse': {
          name: 'Chiropractor\'s Canada',
          totalCount: 386,
          listOwnerInfo: {
            fullName: 'Ali Aamir',
            profileUrn: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
            profile: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)'
          },
          role: 'OWNER',
          listSource: 'MANUAL',
          createdAt: 1757540389862,
          lastUpdatedAt: 1758446788072,
          lastViewedAt: 1758452311020,
          lastModifiedBy: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
          lastModifiedByUrn: 'urn:li:fs_salesProfile:(ACwAAD_9E8oBu4vWXXRHhAbnJplYQG5MgY682c0,NAME_SEARCH,-KoL)',
          shared: false,
          unsavedEntityCounts: 0
        }
      },
      tracking: {
        requestId: 'q9PZ/dB9SBy2JOzfsywb4A==',
        sessionId: '/mcpIgqVRmGiGoPH7kkmPw=='
      }
    },
    elements: [{
      objectUrn: 'urn:li:member:129240593',
      entityUrn: 'urn:li:fs_salesProfile:(ACwAAAe0DhEB4Ei9v4Om_MtYqcUHb1WkFa0yT7U,NAME_SEARCH,P8ez)',
      fullName: 'Joanna Chim',
      firstName: 'Joanna',
      lastName: 'Chim',
      headline: 'MScPT, MClScPT, CAFCI, FCAMPT. Physiotherapist, Owner of Symmetry Physiotherapy + Rehabilitation',
      summary: 'Joanna Chim is a graduate of the 2008 McMaster University Physiotherapy program...',
      geoRegion: 'Toronto, Ontario, Canada',
      saved: true,
      pendingInvitation: true,
      degree: 3,
      uniquePositionCompanyCount: 1,
      listCount: 1,
      currentPositions: [{
        posId: 1,
        current: true,
        companyName: 'Symmetry Physiotherapy + Rehabilitation',
        title: 'Physiotherapist, Clinic Owner'
      }],
      dateAddedToListAt: 1757625366520,
      lastUpdatedTimeInListAt: 1757625366520,
      newListEntitySinceLastViewed: false,
      entityNotesCount: 0,
      spotlightBadges: [],
      seniorityV2s: []
    }],
    paging: {
      total: 383,
      count: 1,
      start: 125,
      links: []
    }
  }
});

export const SearchQuerySchema = z.object({
  start: z.coerce.number().min(0).default(0),
  count: z.coerce.number().min(1).max(100).default(25),
  leadListId: z.string().optional(),
}).openapi({
  description: 'Query parameters for people search',
  example: {
    start: 0,
    count: 25,
    leadListId: '7371658687360155648'
  }
});

export const ConnectionRequestSchema = z.object({
  member: z.string().min(1, 'Member ID is required'),
  message: z.string().min(1, 'Message is required'),
}).openapi({
  description: 'Request body for sending connection request',
  example: {
    member: 'ACwAACg6hMsB0QZz1LrQ-YmSFfGT2BAonH_RJk4',
    message: 'Hi Jill, I\'d love to connect and learn how you think about customer experience in your business.'
  }
});

export const ConnectionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
}).openapi({
  description: 'Response from connection request API',
  example: {
    success: true,
    message: 'Connection request sent successfully'
  }
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
}).openapi({
  description: 'Error response',
  example: {
    error: 'Bad Request',
    message: 'Invalid request parameters',
    statusCode: 400
  }
});

export const AutomationRequestSchema = z.object({
  totalLeads: z.number().min(1, 'Total leads must be at least 1'),
  messageTemplate: z.string().min(1, 'Message template is required'),
  leadListId: z.string().min(1, 'Lead list ID is required'),
  initialStartCount: z.number().min(0).default(0),
  minDelay: z.number().min(1).default(10),
  maxDelay: z.number().min(1).default(10),
}).refine(data => data.maxDelay >= data.minDelay, {
  message: "Max delay must be greater than or equal to min delay",
  path: ["maxDelay"],
}).openapi({
  description: 'Request body for AI automation',
  example: {
    totalLeads: 50,
    messageTemplate: 'Hi {firstName}, I noticed your work in {industry} and would love to connect!',
    leadListId: '7371658687360155648',
    initialStartCount: 0,
    minDelay: 5,
    maxDelay: 15
  }
});

export const AutomationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  processedLeads: z.number(),
  sentInvitations: z.number(),
  skippedLeads: z.number(),
  errors: z.array(z.object({
    personId: z.string(),
    error: z.string()
  }))
}).openapi({
  description: 'Response from AI automation',
  example: {
    success: true,
    message: 'Automation completed successfully',
    processedLeads: 50,
    sentInvitations: 35,
    skippedLeads: 15,
    errors: []
  }
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type ConnectionRequest = z.infer<typeof ConnectionRequestSchema>;
export type ConnectionResponse = z.infer<typeof ConnectionResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type PersonElement = z.infer<typeof PersonElementSchema>;
export type AutomationRequest = z.infer<typeof AutomationRequestSchema>;
export type AutomationResponse = z.infer<typeof AutomationResponseSchema>;