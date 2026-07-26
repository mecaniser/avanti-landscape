// Every admin page is force-dynamic and hits the database, so navigation has a
// visible delay. Without this the sidebar link just sits there looking dead.
export default function AdminLoading() {
  return (
    <div className="admin-loading" role="status" aria-live="polite">
      <span className="admin-spinner" aria-hidden="true" />
      Loading…
    </div>
  );
}
