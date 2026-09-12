import { useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import type { ResolveStart } from './ResolveSheet'
import { CONTEXT_LABEL } from '../lib/types'
import { SUGGESTIONS, askAssistant, type AssistantAnswer } from '../lib/assistant'
import { Sheet } from './Sheet'
import { CarbValue, MetaLine } from './ui'

/* El asistente no ocupa una barra fija: es un punto.

   Estaba compitiendo con el contenido en las cuatro pantallas. Ahora es un
   botón chico que se expande cuando lo tocás y desaparece cuando no. */

export function AssistantBar({
  app,
  bottom,
  onResolve,
}: {
  app: Vianda
  bottom: number
  onResolve: (start: ResolveStart) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <LazyMotion features={domAnimation}>
      <m.button
        onClick={() => setOpen(true)}
        aria-label="Preguntarle a la app"
        style={{ bottom }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.25 }}
        whileTap={{ scale: 0.9 }}
        className="fixed right-5 z-30 grid size-12 place-items-center rounded-full border border-line bg-surface shadow-md"
      >
        <svg viewBox="0 0 20 20" className="size-[18px] text-clay" aria-hidden>
          <path
            d="M10 2.8 11.7 7.2 16 8.9 11.7 10.6 10 15 8.3 10.6 4 8.9 8.3 7.2Z"
            fill="currentColor"
          />
          <circle cx="15.6" cy="15.2" r="1.6" fill="currentColor" opacity=".5" />
        </svg>
      </m.button>

      <AssistantSheet
        app={app}
        open={open}
        onClose={() => setOpen(false)}
        onResolve={onResolve}
      />
    </LazyMotion>
  )
}

function AssistantSheet({
  app,
  open,
  onClose,
  onResolve,
}: {
  app: Vianda
  open: boolean
  onClose: () => void
  onResolve: (start: ResolveStart) => void
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
    }, 280)
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
          className="w-full border-b border-line-strong bg-transparent pb-3 text-[19px] text-ink outline-none placeholder:text-ink-faint focus:border-clay"
        />
      </form>

      <div className="v-no-scrollbar -mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-1">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="shrink-0 rounded-pill border border-line px-4 py-2 text-[14px] text-ink-soft active:bg-surface-2"
          >
            {s}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {answer && (
          <m.div
            key={answer.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="mt-8"
          >
            <h3 className="v-serif text-[21px] text-ink">{answer.title}</h3>
            {answer.note && (
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{answer.note}</p>
            )}

            {answer.action && (
              <button
                onClick={() => {
                  const a = answer.action!
                  close()
                  onResolve({ reason: a.reason, slot: a.slot })
                }}
                className="mt-5 min-h-[52px] w-full rounded-pill bg-clay text-[16px] font-semibold text-white active:scale-[0.98]"
              >
                {answer.action.label}
              </button>
            )}

            {answer.suggestContext && app.today && (
              <button
                onClick={() => {
                  app.setContext(app.today!.date, answer.suggestContext!)
                  close()
                }}
                className={`mt-2 min-h-[48px] w-full rounded-pill text-[15px] font-semibold active:scale-[0.98] ${
                  answer.action ? 'border border-line text-ink' : 'bg-clay text-white'
                }`}
              >
                Pasar el día a «{CONTEXT_LABEL[answer.suggestContext]}»
              </button>
            )}

            {answer.meals && answer.meals.length > 0 && (
              <ul className="mt-5">
                {answer.meals.map(({ meal, why }, idx) => (
                  <m.li
                    key={meal.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * idx }}
                    className="flex items-baseline gap-4 border-b border-line py-3.5"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="v-serif block truncate text-[17px] text-ink">
                        {meal.name}
                      </span>
                      <MetaLine className="mt-1" parts={[meal.satiety, why, meal.isDemo && 'demo']} />
                    </span>
                    <CarbValue meal={meal} />
                  </m.li>
                ))}
              </ul>
            )}

            {answer.tasks && (
              <ul className="mt-5">
                {answer.tasks.map((task) => (
                  <li key={task} className="border-b border-line py-3 text-[16px] text-ink">
                    {task}
                  </li>
                ))}
              </ul>
            )}

            {answer.unsupported && (
              <p className="mt-5 text-[13px] leading-relaxed text-ink-faint">
                Por ahora el asistente responde con reglas locales sobre tu biblioteca.
                La arquitectura ya está lista para conectarle un modelo.
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </Sheet>
  )
}
