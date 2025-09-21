import { Request, Response, Router } from 'express';
import { ConnectionRequestSchema } from '../schemas';
import linkedInApiClient from '../axios-config';
import { z } from 'zod';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const connectionData = ConnectionRequestSchema.parse(req.body);

    console.log('Sending connection request:', {
      member: connectionData.member,
      messageLength: connectionData.message.length,
    });

    const data = await linkedInApiClient.sendConnectionRequest(connectionData);

    const response = {
      success: true,
      message: 'Connection request sent successfully',
      data: data
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error in connection request:', error);

    if (error instanceof z.ZodError) {
      const errorResponse = {
        error: 'Validation Error',
        message: 'Invalid request body',
        statusCode: 400,
        details: error.issues,
      };
      return res.status(400).json(errorResponse);
    }

    if (error?.response?.status) {
      const statusCode = error.response.status;
      let message = 'Unknown error occurred';

      switch (statusCode) {
        case 400:
          message = 'Bad request - Invalid member ID or message';
          break;
        case 401:
          message = 'Unauthorized - Invalid or expired LinkedIn session';
          break;
        case 403:
          message = 'Forbidden - Cannot send connection request to this user';
          break;
        case 429:
          message = 'Rate limited - Too many connection requests sent';
          break;
        default:
          message = error.response.data?.message || error.message || 'Unknown error';
      }

      const errorResponse = {
        error: 'LinkedIn API Error',
        message: message,
        statusCode: statusCode,
      };
      return res.status(statusCode).json(errorResponse);
    }

    const errorResponse = {
      error: 'Internal Server Error',
      message: error?.message || 'An unexpected error occurred',
      statusCode: 500,
    };

    res.status(500).json(errorResponse);
  }
});

export default router;