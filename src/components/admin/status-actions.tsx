export function SubmissionStatusActions({
  id,
  status,
  action,
}: {
  id: string;
  status: string;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {status !== "reviewed" ? (
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="reviewed" />
          <button
            type="submit"
            className="rounded-md bg-emblem px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-forest-800"
          >
            Mark reviewed
          </button>
        </form>
      ) : null}
      {status !== "new" ? (
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="new" />
          <button
            type="submit"
            className="rounded-md border border-line px-2.5 py-1 text-[10px] font-medium text-muted hover:bg-paper"
          >
            Reopen
          </button>
        </form>
      ) : null}
      {status !== "archived" ? (
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="archived" />
          <button
            type="submit"
            className="rounded-md px-2.5 py-1 text-[10px] font-medium text-coral hover:bg-coral/10"
          >
            Archive
          </button>
        </form>
      ) : null}
    </div>
  );
}
