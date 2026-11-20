// news-image-20261119 entry: the one-page news image is drawn at build time and committed
// as entry.png beside this file; the program copies it to the grader's output directory.
// No network, no randomness, no clock: two runs write the same bytes (run_deterministic).
import { copyFileSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const src = new URL('./entry.png', import.meta.url);
const out = join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png');

// The gate wants a whole PNG of at most 1 MiB and 1024x1024 — check it here and fail
// loudly rather than hand a bad file to the scorer.
const bytes = statSync(src).size;
if (bytes > 1048576) throw new Error(`entry.png is ${bytes} bytes; the gate allows 1048576`);
const buf = readFileSync(src);
if (!(buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)) {
  throw new Error('entry.png is not a PNG');
}
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
if (w > 1024 || h > 1024) throw new Error(`entry.png is ${w}x${h}; the gate allows at most 1024x1024`);

copyFileSync(src, out);
