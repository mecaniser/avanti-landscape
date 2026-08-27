import {
  getGooglePlaceReviews,
  GOOGLE_MAPS_URL,
  GOOGLE_REVIEW_URL,
  type GoogleReview,
} from "@/lib/google-reviews";

const REVIEW_POLICY_URL =
  "https://support.google.com/contributionpolicy/answer/7400114";

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <span className="google-review-stars" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden="true">{"★".repeat(rounded)}{"☆".repeat(5 - rounded)}</span>
    </span>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const author = review.authorAttribution?.displayName || "Google reviewer";
  const sourceUrl = review.googleMapsUri || GOOGLE_MAPS_URL;
  const authorUrl = review.authorAttribution?.uri || sourceUrl;
  const translated = Boolean(
    review.text?.languageCode &&
      review.originalText?.languageCode &&
      review.text.languageCode !== review.originalText.languageCode
  );

  return (
    <article className="google-review-card">
      <div className="google-review-author">
        {review.authorAttribution?.photoUri ? (
          // A plain image avoids proxying or persistently caching Google content.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.authorAttribution.photoUri}
            alt=""
            width="44"
            height="44"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="google-review-avatar" aria-hidden="true">
            {author.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div>
          <a href={authorUrl} target="_blank" rel="noopener noreferrer">
            {author}
          </a>
          {review.relativePublishTimeDescription && (
            <span>{review.relativePublishTimeDescription}</span>
          )}
        </div>
      </div>
      <Stars rating={review.rating} />
      <blockquote>
        <p>{review.text?.text}</p>
      </blockquote>
      {translated && <p className="google-review-translation">Translated by Google Maps</p>}
      <a
        className="google-review-source"
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        View review on Google Maps <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export default async function GoogleReviews() {
  const place = await getGooglePlaceReviews();
  const writtenReviews = (place?.reviews || [])
    .filter((review) => review.text?.text?.trim())
    .slice(0, 3);
  const mapsUrl = place?.googleMapsUri || GOOGLE_MAPS_URL;

  return (
    <section className="section google-reviews-section" aria-labelledby="google-reviews-heading">
      <div className="container">
        <div className="google-reviews-head">
          <div>
            <span className="eyebrow">Customer perspective</span>
            <h2 id="google-reviews-heading">Work that earns trust.</h2>
            <p>Read what local customers say after working with the Avanti crew.</p>
          </div>
          {place?.rating && place.userRatingCount ? (
            <a
              className="google-rating-summary"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${place.rating} out of 5 from ${place.userRatingCount} Google reviews`}
            >
              <strong>{place.rating.toFixed(1)}</strong>
              <span><Stars rating={place.rating} />{place.userRatingCount} reviews</span>
            </a>
          ) : null}
        </div>

        {writtenReviews.length > 0 ? (
          <div className="google-review-grid">
            {writtenReviews.map((review, index) => (
              <ReviewCard
                key={review.googleMapsUri || `${review.authorAttribution?.displayName}-${index}`}
                review={review}
              />
            ))}
          </div>
        ) : (
          <div className="google-review-fallback">
            <p>See Avanti Landscaping&apos;s latest customer feedback directly on Google Maps.</p>
          </div>
        )}

        <div className="google-reviews-foot">
          <div className="google-review-actions">
            <a className="btn btn--dark" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Read All Reviews
            </a>
            <a className="btn btn--outline" href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
              Leave a Google Review
            </a>
          </div>
          <div className="google-review-disclosure">
            <span className="google-maps-attribution" translate="no">Google Maps</span>
            <span>Reviews shown are written reviews selected and ordered by Google Maps for relevance.</span>
            <a href={REVIEW_POLICY_URL} target="_blank" rel="noopener noreferrer">Review policy</a>
          </div>
        </div>
      </div>
    </section>
  );
}
