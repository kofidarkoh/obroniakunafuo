import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Tiny JSON-file persistence layer used until Supabase is connected.
 *
 * Data lives in `data/db/*.json` (override with OAK_DATA_DIR). Writes are
 * serialized per file and atomic (write to a temp file, then rename), which is
 * enough for a single local/VPS process. Serverless hosts with a read-only or
 * ephemeral filesystem need a real database instead — the public API of this
 * module is intentionally narrow so it can be swapped for Supabase later.
 */
const dataDir = process.env.OAK_DATA_DIR
  ? path.resolve(process.env.OAK_DATA_DIR)
  : path.join(process.cwd(), "data", "db");

const queues = new Map<string, Promise<unknown>>();

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readFile<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(dataDir, file), "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function writeFile(file: string, value: unknown) {
  await ensureDir();
  const target = path.join(dataDir, file);
  const temporary = `${target}.${process.pid}.${randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temporary, target);
}

/** Reads a collection file, creating it from `seed()` on first use. */
export async function readJson<T>(file: string, seed: () => T): Promise<T> {
  const existing = await readFile<T>(file);
  if (existing !== null) return existing;

  // Another caller may have seeded the file between the read and the write,
  // so seed through the serialized path to avoid racing temp renames.
  return updateJson<T>(file, seed, () => undefined);
}

/**
 * Serialized read-modify-write for one file. `update` may mutate the value in
 * place and/or return a replacement; either way the result is persisted.
 */
export async function updateJson<T>(
  file: string,
  seed: () => T,
  update: (value: T) => T | void,
): Promise<T> {
  const run = async () => {
    const existing = await readFile<T>(file);
    const current = existing ?? seed();
    const result = (update(current) ?? current) as T;
    await writeFile(file, result);
    return result;
  };

  const previous = queues.get(file) ?? Promise.resolve();
  const next = previous.then(run, run);
  queues.set(file, next.then(
    () => undefined,
    () => undefined,
  ));
  return next;
}
