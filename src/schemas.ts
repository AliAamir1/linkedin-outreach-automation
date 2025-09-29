import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CurrentPositionSchema = z.object({
  posId: z.number(),
  current: z.boolean(),
  companyName: z.string(),
  title: z.string(),
  description: z.string().optional(),
  companyUrn: z.string().optional(),
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
    companyName: 'TIMCO',
    title: 'Marketing Director',
    companyUrn: 'urn:li:fs_salesCompany:5108958',
    startedOn: { month: 3, year: 2024 },
    tenureAtPosition: { numYears: 1, numMonths: 7 },
    tenureAtCompany: { numYears: 1, numMonths: 7 }
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

export const ProfilePictureArtifactSchema = z.object({
  width: z.number(),
  height: z.number(),
  fileIdentifyingUrlPathSegment: z.string(),
}).openapi({
  description: 'Profile picture artifact with different sizes',
  example: {
    width: 200,
    height: 200,
    fileIdentifyingUrlPathSegment: '200_200/B4EZb3W5VSHAAY-/0/1747906697488?e=1761782400&v=beta&t=v-CSWcfAVeoqBq1Rhi37duR8LqP_fHtuuN0Uag0eYJ0'
  }
});

export const ProfilePictureDisplayImageSchema = z.object({
  rootUrl: z.string(),
  artifacts: z.array(ProfilePictureArtifactSchema),
}).openapi({
  description: 'Profile picture display image with multiple sizes',
  example: {
    rootUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQHl-4juiOhzuQ/profile-displayphoto-shrink_',
    artifacts: [
      {
        width: 200,
        height: 200,
        fileIdentifyingUrlPathSegment: '200_200/B4EZb3W5VSHAAY-/0/1747906697488?e=1761782400&v=beta&t=v-CSWcfAVeoqBq1Rhi37duR8LqP_fHtuuN0Uag0eYJ0'
      }
    ]
  }
});

export const SpotlightBadgeSchema = z.object({
  id: z.string(),
  displayValue: z.string(),
  associatedEntityUrnsUnions: z.array(z.any()),
  popup: z.object({
    header: z.object({
      text: z.string(),
    }),
    config: z.object({
      supportsDataFetch: z.boolean(),
      popupTypes: z.array(z.string()),
    }),
  }).optional(),
}).openapi({
  description: 'Spotlight badge information',
  example: {
    id: 'POSTED_ON_LINKEDIN',
    displayValue: '2 recent posts on Linkedin',
    associatedEntityUrnsUnions: [],
    popup: {
      header: {
        text: 'Posts on LinkedIn in the last 30 days'
      },
      config: {
        supportsDataFetch: true,
        popupTypes: ['POSTED_CONTENT']
      }
    }
  }
});

export const OrderedSpotlightSchema = z.object({
  type: z.string(),
  count: z.number(),
  displayCount: z.string(),
}).openapi({
  description: 'Ordered spotlight information',
  example: {
    type: 'ALL',
    count: 140,
    displayCount: '140'
  }
});

export const DecoratedSpotlightsSchema = z.object({
  all: z.number(),
  selectedType: z.string(),
  orderedSpotlights: z.array(OrderedSpotlightSchema),
}).openapi({
  description: 'Decorated spotlights information',
  example: {
    all: 140,
    selectedType: 'ALL',
    orderedSpotlights: [
      {
        type: 'ALL',
        count: 140,
        displayCount: '140'
      }
    ]
  }
});

export const PersonElementSchema = z.object({
  objectUrn: z.string(),
  entityUrn: z.string(),
  personId: z.string().optional(),
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
  spotlightBadges: z.array(SpotlightBadgeSchema),
  seniorityV2s: z.array(z.any()),
  profilePictureDisplayImage: ProfilePictureDisplayImageSchema.optional(),
  trackingId: z.string().optional(),
  blockThirdPartyDataSharing: z.boolean().optional(),
  outreachActivity: OutreachActivitySchema.optional(),
}).openapi({
  description: 'A person element from LinkedIn search results',
  example: {
    objectUrn: 'urn:li:member:22103589',
    entityUrn: 'urn:li:fs_salesProfile:(ACwAAAFRRiUBX5x6Iei0PYCB9NHYmKYSwSdRWOo,NAME_SEARCH,pzxc)',
    fullName: 'Tony Ward',
    firstName: 'Tony',
    lastName: 'Ward',
    headline: 'Marketing Director | Strategic Marketing Leader | Driving Brand & Trade Marketing Performance | Brand Development, Communications, Digital Marketing | Proven Track Record of Delivering Growth for Global Brands 🚀',
    summary: 'Successful senior B2B & B2C marketing professional, experienced in developing strategy & delivering integrated marketing plans.',
    geoRegion: 'Kenilworth, England, United Kingdom',
    saved: true,
    pendingInvitation: true,
    degree: 3,
    uniquePositionCompanyCount: 2,
    listCount: 1,
    currentPositions: [{
      posId: 1,
      current: true,
      companyName: 'TIMCO',
      title: 'Marketing Director',
      companyUrn: 'urn:li:fs_salesCompany:5108958',
      startedOn: { month: 3, year: 2024 },
      tenureAtPosition: { numYears: 1, numMonths: 7 },
      tenureAtCompany: { numYears: 1, numMonths: 7 }
    }],
    dateAddedToListAt: 1758562679195,
    lastUpdatedTimeInListAt: 1758562679195,
    newListEntitySinceLastViewed: false,
    entityNotesCount: 0,
    spotlightBadges: [{
      id: 'POSTED_ON_LINKEDIN',
      displayValue: '2 recent posts on Linkedin',
      associatedEntityUrnsUnions: [],
      popup: {
        header: {
          text: 'Posts on LinkedIn in the last 30 days'
        },
        config: {
          supportsDataFetch: true,
          popupTypes: ['POSTED_CONTENT']
        }
      }
    }],
    seniorityV2s: [],
    trackingId: '[=¢÷×ÊL«¹Oç7ïLÅ',
    blockThirdPartyDataSharing: false
  }
});

export const ListOwnerInfoSchema = z.object({
  fullName: z.string(),
  profileUrn: z.string(),
  profile: z.string(),
  profilePictureDisplayImage: ProfilePictureDisplayImageSchema.optional(),
}).openapi({
  description: 'Information about the list owner',
  example: {
    fullName: 'Moiz Shahid',
    profileUrn: 'urn:li:fs_salesProfile:(ACwAADVAPBIBlGDoctDYHaMfSpPF2CZ6JgApbFY,NAME_SEARCH,MqeE)',
    profile: 'urn:li:fs_salesProfile:(ACwAADVAPBIBlGDoctDYHaMfSpPF2CZ6JgApbFY,NAME_SEARCH,MqeE)',
    profilePictureDisplayImage: {
      rootUrl: '',
      artifacts: [
        {
          width: 400,
          height: 400,
          fileIdentifyingUrlPathSegment: 'https://media.licdn.com/dms/image/v2/D4D03AQHVU7-DqI_Epw/profile-displayphoto-shrink_400_400/B4DZPLfLxEHUAg-/0/1734285774733?e=1761782400&v=beta&t=Q1nbKojv8cAQVdOLyLh61Ep7ncF9KHcOLMtXoSabXPM'
        }
      ]
    }
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
  decoratedSmartFilters: z.record(z.string(), z.any()).optional(),
  decoratedSpotlights: DecoratedSpotlightsSchema.optional(),
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
    totalDisplayCount: '140',
    decoratedSmartFilters: {},
    decoratedSpotlights: {
      all: 140,
      selectedType: 'ALL',
      orderedSpotlights: [
        {
          type: 'ALL',
          count: 140,
          displayCount: '140'
        },
        {
          type: 'RECENT_POSITION_CHANGE',
          count: 13,
          displayCount: '13'
        },
        {
          type: 'RECENTLY_POSTED_ON_LINKEDIN',
          count: 140,
          displayCount: '140'
        }
      ]
    },
    pivot: {
      'com.linkedin.sales.search.ListPivotResponse': {
        name: 'Clinics',
        totalCount: 140,
        listOwnerInfo: {
          fullName: 'Moiz Shahid',
          profileUrn: 'urn:li:fs_salesProfile:(ACwAADVAPBIBlGDoctDYHaMfSpPF2CZ6JgApbFY,NAME_SEARCH,MqeE)',
          profile: 'urn:li:fs_salesProfile:(ACwAADVAPBIBlGDoctDYHaMfSpPF2CZ6JgApbFY,NAME_SEARCH,MqeE)'
        },
        role: 'OWNER',
        listSource: 'MANUAL',
        createdAt: 1758562641378,
        lastUpdatedAt: 1758562679218,
        lastViewedAt: 1758610087894,
        lastModifiedBy: 'urn:li:fs_salesProfile:(ACwAADVAPBIBlGDoctDYHaMfSpPF2CZ6JgApbFY,NAME_SEARCH,MqeE)',
        lastModifiedByUrn: 'urn:li:fs_salesProfile:(ACwAADVAPBIBlGDoctDYHaMfSpPF2CZ6JgApbFY,NAME_SEARCH,MqeE)',
        shared: false,
        unsavedEntityCounts: 0
      }
    },
    tracking: {
      requestId: '0absCyeOSiO9G3b8FMgsSw==',
      sessionId: 'OC96LYXlS/CqZspvdZ+a/g=='
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
  targetIndustries: z.string().optional().describe('Comma-separated list of industries to target (e.g., "Dental clinics, physiotherapy, healthcare")'),
  excludeIndustries: z.string().optional().describe('Comma-separated list of industries to exclude (e.g., "consultation, legal business")'),
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
    maxDelay: 15,
    targetIndustries: 'Dental clinics, physiotherapy, healthcare',
    excludeIndustries: 'consultation, legal business'
  }
});

export const AutomationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  processedLeads: z.number(),
  sentInvitations: z.number(),
  skippedLeads: z.number(),
  unqualifiedLeads: z.number(),
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
    skippedLeads: 10,
    unqualifiedLeads: 5,
    errors: []
  }
});

export const RemoveFromListRequestSchema = z.object({
  leadListId: z.string().min(1, 'Lead list ID is required'),
  entityUrn: z.string().min(1, 'Entity URN is required'),
}).openapi({
  description: 'Request body for removing a person from a lead list',
  example: {
    leadListId: '7366498152729710592',
    entityUrn: 'urn:li:fs_salesProfile:(ACwAACxVDF4Bnj9fuZ2vHtIJSD50j4c5G5PzuE0,NAME_SEARCH,IUrg)'
  }
});

export const RemoveFromListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  removedEntity: z.string().optional(),
}).openapi({
  description: 'Response from remove from list API',
  example: {
    success: true,
    message: 'Person successfully removed from lead list',
    removedEntity: 'urn:li:fs_salesProfile:(ACwAACxVDF4Bnj9fuZ2vHtIJSD50j4c5G5PzuE0,NAME_SEARCH,IUrg)'
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
export type RemoveFromListRequest = z.infer<typeof RemoveFromListRequestSchema>;
export type RemoveFromListResponse = z.infer<typeof RemoveFromListResponseSchema>;