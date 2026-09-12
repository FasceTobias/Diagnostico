/* Genera los iconos PNG de la PWA a partir de la misma forma que el SVG.
   Se ejecuta en el prebuild: los binarios no viven en el repo, se derivan
   del código, y siempre quedan iguales al icono de la app. */

import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')

const CLAY = [184, 92, 51]
const CREAM = [255, 251, 245]

const inRoundedRect = (x, y, x0, y0, x1, y1, r) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false
  const cx = Math.min(Math.max(x, x0 + r), x1 - r)
  const cy = Math.min(Math.max(y, y0 + r), y1 - r)
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r
}

/** La vianda, en un lienzo de referencia de 512. */
const isMark = (u, v) => {
  if (v >= 214 && v <= 404) {
    const inset = 20 * ((v - 214) / 190)
    if (inRoundedRect(u, v, 122 + inset, 214, 390 - inset, 404, 34)) return true
  }
  return inRoundedRect(u, v, 100, 148, 412, 200, 26)
}

const png = (w, h, raw) => {
  const chunk = (tag, data) => {
    const body = Buffer.concat([Buffer.from(tag), data])
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(body) >>> 0)
    return Buffer.concat([len, body, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8      // bits por canal
  ihdr[9] = 6      // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

const crc32 = (buf) => {
  let c = -1
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return c ^ -1
}

const render = (size, maskable) => {
  const ss = 3                          // supermuestreo para bordes suaves
  const pad = maskable ? 0.12 : 0       // zona segura de las máscaras de Android
  const rows = []

  for (let py = 0; py < size; py++) {
    const row = Buffer.alloc(size * 4)
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, hits = 0
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const fx = px + (sx + 0.5) / ss
          const fy = py + (sy + 0.5) / ss
          if (!maskable && !inRoundedRect(fx, fy, 0, 0, size - 1, size - 1, size * 0.22)) continue
          const cx = (fx - size / 2) / (1 - 2 * pad) + size / 2
          const cy = (fy - size / 2) / (1 - 2 * pad) + size / 2
          const c = isMark((cx * 512) / size, (cy * 512) / size) ? CREAM : CLAY
          r += c[0]; g += c[1]; b += c[2]; hits++
        }
      }
      const i = px * 4
      if (hits) {
        row[i] = Math.round(r / hits)
        row[i + 1] = Math.round(g / hits)
        row[i + 2] = Math.round(b / hits)
      }
      row[i + 3] = Math.round((hits / (ss * ss)) * 255)
    }
    rows.push(Buffer.concat([Buffer.from([0]), row]))
  }

  return png(size, size, Buffer.concat(rows))
}

mkdirSync(OUT, { recursive: true })
for (const [size, maskable, name] of [
  [192, false, 'icon-192.png'],
  [512, false, 'icon-512.png'],
  [512, true, 'icon-maskable.png'],
  [180, false, 'apple-touch-icon.png'],
]) {
  writeFileSync(resolve(OUT, name), render(size, maskable))
  console.log('icons/' + name)
}
