import { useState } from 'react'
import type { Vianda } from '../lib/store'
import { SUGGESTIONS, askAssistant, type AssistantAnswer } from '../lib/assistant'
import { CONTEXT_LABEL } from '../lib/types'
import { Sheet } from './Sheet'
import { CarbChip, DemoBadge, MealTile, SatietyMark } from './ui'

/* El asistente no es una pestaña ni un chat: es una entrada que vive
   encima de la navegación y devuelve tarjetas de la app, no burbujas. */

export function AssistantBar({ app, bottom }: { app: Vianda; bottom: number }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ bottom }}
        className="fixed right-4 left-4 z-30 mx-auto flex max-w-md items-center gap-3 rounded-pill border border-line bg-veil px-5 py-3.5 text-left shadow-md backdrop-blur-xl transition-transform duration-150 active:scale-[0.985]"
      >
        <svg viewBox="0 0 20 20" className="size-[18px] shrink-0 text-clay" aria-hidden>
          <path
            d="M10 2.5 11.7 7 16 8.6 11.7 10.2 10 14.7 8.3 10.2 4 8.6 8.3 7Z"
            fill="currentColor"
          />
          <circle cx="15.4" cy="15" r="1.7" fill="currentColor" opacity=".55" />
        </svg>
        <span className="flex-1 text-[15px] text-ink-soft">¿Qué necesitás?</span>
      </button>

      <AssistantSheet app={app} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function AssistantSheet({
  app,
  open,
  onClose,
}: {
  app: Vianda
  open: boolean
  onClose: () => void
}) {
  const [text, setText] = useState('')
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null)

  const ask = (q: string) => {
    setText(q)
    setAnswer(askAssistant({ text: q, app }))
  }

  const close = () => {
    onClose()
    setTimeout(() => {
      setText('')
      setAnswer(null)
    }, 250)
  }

  return (
    <Sheet open={open} onClose={close} title="¿Qué necesitás?">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (text.trim()) ask(text)
        }}
      >
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribilo como lo pensás"
          className="w-full rounded-pill border border-line bg-surface px-5 py-3.5 text-[16px] text-ink outline-none placeholder:text-ink-faint focus:border-clay"
        />
      </form>

      <div className="v-no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="shrink-0 rounded-pill border border-line bg-surface px-4 py-2 text-[14px] text-ink-soft active:bg-surface-2"
          >
            {s}
          </button>
        ))}
      </div>

      {answer && (
        <div className="v-rise mt-6">
          <h3 className="text-[17px] v-display text-ink">{answer.title}</h3>
          {answer.note && (
            <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{answer.note}</p>
          )}

          {answer.suggestContext && app.today && (
            <button
              onClick={() => {
                app.setContext(app.today!.date, answer.suggestContext!)
                close()
              }}
              className="mt-4 min-h-[52px] w-full rounded-pill bg-clay text-[16px] font-semibold text-white shadow-sm active:scale-[0.98]"
            >
              Pasar el día a «{CONTEXT_LABEL[answer.suggestContext]}»
            </button>
          )}

          {answer.meals && answer.meals.length > 0 && (
            <ul className="mt-4 space-y-2">
              {answer.meals.map(({ meal, why }) => (
                <li
                  key={meal.id}
                  className="flex items-center gap-3.5 rounded-card bg-surface px-3.5 py-3 shadow-sm"
                >
                  <MealTile meal={meal} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-medium text-ink">{meal.name}</span>
                      {meal.isDemo && <DemoBadge />}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2.5 text-[13px]">
                      <CarbChip meal={meal} />
                      <SatietyMark level={meal.satiety} showLabel={false} />
                      {why && <span className="truncate text-ink-faint">{why}</span>}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {answer.tasks && (
            <ul className="mt-4 space-y-1.5">
              {answer.tasks.map((task) => (
                <li
                  key={task}
                  className="rounded-2xl bg-surface px-4 py-3 text-[15px] text-ink shadow-sm"
                >
                  {task}
                </li>
              ))}
            </ul>
          )}

          {answer.unsupported && (
            <p className="mt-4 rounded-2xl border border-dashed border-line-strong px-4 py-3 text-[13px] leading-relaxed text-ink-faint">
              Por ahora el asistente responde con reglas locales sobre tu biblioteca.
              La arquitectura ya está lista para conectarle un modelo.
            </p>
          )}
        </div>
      )}
    </Sheet>
  )
}
