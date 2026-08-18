/** "Aug 17, 2026, 4:23 PM" — date plus time, since an owner checking "when was
 * this last touched" often edits the same section more than once a day, and a
 * date alone can't distinguish those edits. */
export function formatUpdatedAt(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** The most recent timestamp across a set of records, or null for an empty
 * set — an admin section with nothing in it yet has no "last updated" to show. */
export function latestUpdatedAt(records: { updatedAt: Date }[]): Date | null {
  return records.reduce<Date | null>(
    (latest, record) => (!latest || record.updatedAt > latest ? record.updatedAt : latest),
    null
  );
}
