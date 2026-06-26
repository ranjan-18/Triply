import axios from "axios";
import env from "../config/env.js";

/**
 * Fetch city-specific image from Pexels
 */
export const getCityImage = async (
  city
) => {
  try {
    const searchQueries = [
      `${city} tourism`,
      `${city} travel destination`,
      `${city} landscape`,
      city,
    ];

    for (const query of searchQueries) {
      const response =
        await axios.get(
          "https://api.pexels.com/v1/search",
          {
            params: {
              query,
              per_page: 10,
              orientation:
                "landscape",
            },

            headers: {
              Authorization:
                env.PEXELS_API_KEY,
            },
          }
        );

      if (
        response.data.photos &&
        response.data.photos.length >
          0
      ) {
        const randomIndex =
          Math.floor(
            Math.random() *
              response.data.photos
                .length
          );

        return response.data.photos[
          randomIndex
        ].src.large2x;
      }
    }

    return `https://source.unsplash.com/1600x900/?${encodeURIComponent(
      city
    )}`;
  } catch (error) {
    console.error(
      "Pexels Error:",
      error.message
    );

    return `https://source.unsplash.com/1600x900/?${encodeURIComponent(
      city
    )}`;
  }
};