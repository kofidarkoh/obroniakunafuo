# Local data store

Until Supabase is connected, all runtime data is persisted as JSON files in
`data/db/`:

| File                 | Contents                                      |
| -------------------- | --------------------------------------------- |
| `contacts.json`      | Contact form messages                         |
| `donations.json`     | Donation submissions and their status         |
| `volunteers.json`    | Volunteer applications                        |
| `partnerships.json`  | Partnership enquiries                         |
| `stories.json`       | Story content edited from the admin           |
| `programmes.json`    | Programme content edited from the admin       |
| `settings.json`      | Contact, payment and notification settings    |

The files are created automatically on first use, seeded from
`src/lib/stories.ts` and `src/lib/site.ts`. Writes are atomic and serialized
per file (`src/lib/data/json-db.ts`), which is sufficient for a single local or
VPS process.

`data/db/` is gitignored — back up the folder if the content matters. To move
it elsewhere set `OAK_DATA_DIR=/absolute/path`.

## Not for serverless

Serverless hosts (Vercel, Netlify) have a read-only or ephemeral filesystem.
Do not deploy this store there; connect Supabase first. The data modules expose
the same functions either way, so the swap should not touch pages or actions.
