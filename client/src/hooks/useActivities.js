// src/hooks/useActivities.js

import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../api/activityApi";

export const useActivities = (tripId, page = 1) => {
  return useQuery({
    queryKey: ["activities", tripId, page],
    queryFn: () => getActivities(tripId, page),
    enabled: !!tripId,
  });
};
