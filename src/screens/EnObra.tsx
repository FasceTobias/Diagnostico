import { Card, TituloSeccion, Vacio } from '../components/base'
import type { IconName } from '../components/tokens'

/* ------------------------------------------------------------------
   TODAVÍA NO

   La pantalla que falta, dicha con las piezas de la que ya está. No es
   un cartel de error ni un «próximamente» con cohete: dice qué va a
   haber acá y no finge tener datos.

   Existe mientras se construyen Registrar, Tendencias y Perfil. El día
   que estén las tres, este archivo se borra.
   ------------------------------------------------------------------ */

export function EnObra({
  titulo,
  icono,
  detalle,
  piezas,
}: {
  titulo: string
  icono: IconName
  detalle: string
  /** Qué va a poder hacerse acá. En palabras del usuario, no del código. */
  piezas: string[]
}) {
  return (
    <div className="mx-auto max-w-md px-5 pb-28">
      <header className="v-safe-top pt-6 pb-5">
        <h1 className="t-title text-ink">{titulo}</h1>
      </header>

      <Card>
        <Vacio icono={icono} titulo="Esta pantalla se está construyendo" detalle={detalle} />
      </Card>

      <section className="mt-8">
        <TituloSeccion>Lo que va acá</TituloSeccion>
        <ul className="space-y-3">
          {piezas.map((p) => (
            <li key={p}>
              <Card aire="lista">
                <p className="t-body text-ink-soft">{p}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
