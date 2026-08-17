/**
 * Renders a JSON-LD block. Kept deliberately small: callers build plain
 * objects, so schema shapes stay readable at their call site instead of
 * being string-templated into JSON.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is not HTML-escaped, so a `<` inside any
      // admin-authored string (a post title, a service description) would
      // close the script tag early. Escaping it is the standard guard.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
