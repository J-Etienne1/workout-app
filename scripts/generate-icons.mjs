// Generates the PWA PNG icons with zero dependencies (Node's built-in zlib).
// Draws a simple dumbbell in the brand accent on the dark theme background.
// Re-run with: node scripts/generate-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const BG = [0x0b, 0x0d, 0x10]; // --bg
const FG = [0x4c, 0xd6, 0xa8]; // --accent

// Dumbbell drawn in a -1..1 coordinate space centred on the canvas.
const RECTS = [
  [-0.62, -0.12, 0.62, 0.12], // handle
  [-0.74, -0.46, -0.62, 0.46], // inner plate (left)
  [0.62, -0.46, 0.74, 0.46], // inner plate (right)
  [-0.86, -0.3, -0.74, 0.3], // outer plate (left)
  [0.74, -0.3, 0.86, 0.3], // outer plate (right)
];

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makeIcon(size, scale) {
  const px = Buffer.alloc(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    px[i * 3] = BG[0];
    px[i * 3 + 1] = BG[1];
    px[i * 3 + 2] = BG[2];
  }
  const toPx = (c) => Math.round((0.5 + 0.5 * scale * c) * size);
  for (const [x0, y0, x1, y1] of RECTS) {
    const px0 = toPx(x0);
    const py0 = toPx(y0);
    const px1 = toPx(x1);
    const py1 = toPx(y1);
    for (let y = py0; y < py1; y++) {
      for (let x = px0; x < px1; x++) {
        const o = (y * size + x) * 3;
        px[o] = FG[0];
        px[o + 1] = FG[1];
        px[o + 2] = FG[2];
      }
    }
  }
  // Add the 1-byte (None) filter prefix to each scanline.
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    px.copy(raw, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour RGB
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(OUT_DIR, { recursive: true });
const files = [
  ["icon-192.png", makeIcon(192, 0.92)],
  ["icon-512.png", makeIcon(512, 0.92)],
  // Maskable: smaller scale so the dumbbell stays inside the launcher's safe zone.
  ["icon-maskable-512.png", makeIcon(512, 0.74)],
];
for (const [name, buf] of files) {
  writeFileSync(join(OUT_DIR, name), buf);
  console.log(`wrote public/${name} (${buf.length} bytes)`);
}
