import { Request, Response, Router } from "express";
import { SearchQuerySchema, SearchResponseSchema } from "../schemas";
import linkedInApiClient from "../axios-config";
import { z } from "zod";

const router = Router();

export const extractPersonId = (entityUrn: string) => {
  const personIdMatch = entityUrn.match(/urn:li:fs_salesProfile:\(([^,]+),/);
  return personIdMatch ? personIdMatch[1] : "";
};

router.get("/people", async (req: Request, res: Response) => {
  try {
    const query = SearchQuerySchema.parse(req.query);

    console.log("Searching people with params:", query);

    const data = await linkedInApiClient.searchPeople({
      start: query.start,
      count: query.count,
      leadListId: query.leadListId,
    });

    // Transform the response to extract relevant information and handle undefined values
    const transformedData = {
      metadata: {
        totalDisplayCount: data.metadata?.totalDisplayCount,
        pivot: data.metadata?.pivot,
        tracking: data.metadata?.tracking,
      },
      elements:
        data.elements?.map((element: any) => ({
          ...element,
          personId: extractPersonId(element.entityUrn) || "",
        })) || [],
      paging: data.paging,
    };

    res.status(200).json(transformedData);
  } catch (error: any) {
    console.error("Error in people search:", error);

    if (error instanceof z.ZodError) {
      const errorResponse = {
        error: "Validation Error",
        message: "Invalid request parameters",
        statusCode: 400,
        details: error.issues,
      };

      return res.status(400).json(errorResponse);
    }

    if (error?.response?.status) {
      const errorResponse = {
        error: "LinkedIn API Error",
        message:
          error.response.data?.message ||
          error.message ||
          "Unknown error occurred",
        statusCode: error.response.status,
      };
      return res.status(error.response.status).json(errorResponse);
    }

    const errorResponse = {
      error: "Internal Server Error",
      message: error?.message || "An unexpected error occurred",
      statusCode: 500,
    };

    res.status(500).json(errorResponse);
  }
});

export default router;
