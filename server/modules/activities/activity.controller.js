// server/modules/activities/activity.controller.js

import catchAsync from "../../utils/catchAsync.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { getActivities } from "./activity.service.js";

export const getActivitiesController = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const activities = await getActivities(req.params.tripId, page);

  return res.status(200).json(
    apiResponse(true, "Activities fetched", activities)
  );
});
