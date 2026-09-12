/* Descarga los woff2 de Google Fonts y los deja en public/fonts.

   Se autoalojan a propósito: la app tiene que abrir sin red y sin pedirle
   nada a un tercero. Se corre a mano cuando cambia la tipografía, no en
   cada build — los archivos quedan versionados. */

import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

const FAMILIES = [
  { q: 'Fraunces:opsz,wght@9..144,400..700', name: 'Fraunces', file: 'fraunces', out: 'app' },
  { q: 'Inter:opsz,wght@14..32,400..700', name: 'Inter', file: 'inter', out: 'app' },
  { q: 'Space+Grotesk:wght@400..700', name: 'Space Grotesk', file: 'space-grotesk', out: 'alt' },
  {
    q: 'Bricolage+Grotesque:opsz,wght@12..96,400..800',
    name: 'Bricolage Grotesque',
    file: 'bricolage',
    out: 'alt',
  },
]

// Sólo latin: alcanza para español (ñ, tildes, ¿, ¡ están ahí dentro) y
// evita bajar 230 kB de alfabetos que esta app nunca va a usar.
const KEEP = ['latin']

const css = { app: [], alt: [] }
mkdirSync(resolve(ROOT, 'public/fonts'), { recursive: true })

for (const fam of FAMILIES) {
  const sheet = await fetch(`https://fonts.googleapis.com/css2?family=${fam.q}&display=swap`, {
    headers: { 'User-Agent': UA },
  }).then((r) => r.text())

  const blocks = sheet.split('/*').slice(1)
  for (const block of blocks) {
    const subset = block.slice(0, block.indexOf('*/')).trim()
    if (!KEEP.includes(subset)) continue

    const url = block.match(/src: url\((https:[^)]+)\)/)?.[1]
    const weight = block.match(/font-weight: ([^;]+);/)?.[1] ?? '400'
    const range = block.match(/unicode-range: ([^;]+);/)?.[1]
    if (!url) continue

    const name = `${fam.file}-${subset}.woff2`
    const bytes = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()))
    writeFileSync(resolve(ROOT, 'public/fonts', name), bytes)

    css[fam.out].push(
      `@font-face {\n` +
        `  font-family: '${fam.name}';\n` +
        `  font-style: normal;\n` +
        `  font-weight: ${weight};\n` +
        `  font-display: swap;\n` +
        `  src: url('/fonts/${name}') format('woff2');\n` +
        (range ? `  unicode-range: ${range};\n` : '') +
        `}`,
    )
    console.log(name, (bytes.length / 1024).toFixed(0) + ' kB')
  }
}

writeFileSync(
  resolve(ROOT, 'src/fonts.css'),
  `/* Generado por scripts/fetch-fonts.mjs. No editar a mano. */\n\n${css.app.join('\n\n')}\n`,
)
writeFileSync(
  resolve(ROOT, 'src/fonts-alt.css'),
  `/* Tipografías usadas sólo en la pantalla de direcciones visuales.\n` +
    `   Generado por scripts/fetch-fonts.mjs. No editar a mano. */\n\n${css.alt.join('\n\n')}\n`,
)
