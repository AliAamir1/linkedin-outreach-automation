import { Request, Response, Router } from "express";
import { z } from "zod";
import linkedInApiClient from "../axios-config";
import { RemoveFromListRequestSchema } from "../schemas";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const removeData = RemoveFromListRequestSchema.parse(req.body);

    console.log("Removing person from lead list:", {
      leadListId: removeData.leadListId,
      entityUrn: removeData.entityUrn,
    });

    // Remove person from lead list
    const result = await linkedInApiClient.removeFromLeadList({
      leadListId: removeData.leadListId,
      entityUrn: removeData.entityUrn,
    });

    console.log("Successfully removed person from lead list");

    const response = {
      success: true,
      message: "Person successfully removed from lead list",
      removedEntity: removeData.entityUrn,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error removing person from lead list:", error);

    if (error instanceof z.ZodError) {
      const errorResponse = {
        success: false,
        message: "Invalid request parameters",
        errors: error.issues.map((i) => i.message),
      };
      return res.status(400).json(errorResponse);
    }

    const errorResponse = {
      success: false,
      message: error?.message || "An unexpected error occurred while removing person from lead list",
    };

    res.status(500).json(errorResponse);
  }
});

export default router;
