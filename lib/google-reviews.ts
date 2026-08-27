const GOOGLE_PLACE_ID = "ChIJK144TSWftYERFqdrJKd5jU8";

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Avanti%20Landscaping%20LLC&query_place_id=ChIJK144TSWftYERFqdrJKd5jU8";
export const GOOGLE_REVIEW_URL = "https://g.page/r/CRanaySneY1PEBM/review";

export type GoogleReview = {
  rating: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
  googleMapsUri?: string;
};

export type GooglePlaceReviews = {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
  googleMapsUri?: string;
};

/**
 * Fetch public review data directly from Google Places.
 *
 * Places content is intentionally not persisted in Prisma or cached by Next.
 * The Place ID is the only Google value stored long-term; it is explicitly
 * exempt from Google's Places caching restrictions.
 */
export async function getGooglePlaceReviews(): Promise<GooglePlaceReviews | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`,
      {
        cache: "no-store",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "displayName,rating,userRatingCount,reviews,googleMapsUri",
        },
      }
    );

    if (!response.ok) {
      console.error("Google Places review request failed", response.status);
      return null;
    }

    return (await response.json()) as GooglePlaceReviews;
  } catch (error) {
    console.error(
      "Google Places review request failed",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}
