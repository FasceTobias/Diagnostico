import { backendConfigured } from '../lib/repo'
import { Sheet } from './Sheet'

export function PrivacySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Sheet open={open} onClose={onClose} title="Tus datos en Vianda">
    <div className="space-y-5 text-[14px] leading-relaxed text-ink-soft">
      <p>Vianda organiza comidas, compras y lo que registrás. Podés usarla sin completar el tipo de diabetes ni el tratamiento; son preguntas opcionales para adaptar cómo se muestra la información.</p>
      <div><h3 className="font-semibold text-ink">Qué se guarda</h3><p>Tu nombre si lo indicás, perfil de diabetes y tratamiento si los completás, horarios, preferencias, plan semanal, registros de comidas y marcas de compras. La información de salud es sensible: completala sólo si querés.</p></div>
      <div><h3 className="font-semibold text-ink">Dónde y por cuánto tiempo</h3><p>{backendConfigured ? 'Tus respuestas se guardan en este navegador; si iniciás sesión, también pueden sincronizarse con tu cuenta.' : 'En esta versión, tus respuestas quedan en el almacenamiento de este navegador, en este dispositivo, hasta que las borres o borres los datos del navegador. No se sincronizan entre teléfonos.'} Cualquier persona con acceso al mismo perfil del navegador podría verlas. El sitio se sirve desde Netlify, que procesa datos técnicos de conexión necesarios para entregar la página.</p></div>
      <div><h3 className="font-semibold text-ink">Para qué se usan</h3><p>Para mostrar tu planificación, recordar lo que comiste y preparar la lista de compras. Vianda muestra carbohidratos aproximados por porción, pero no calcula ni sugiere dosis de insulina y no reemplaza al equipo de salud.</p></div>
      <div><h3 className="font-semibold text-ink">Tu control</h3><p>Podés corregir el perfil desde Perfil, descargar los datos del dispositivo y borrarlos desde el mismo lugar. El archivo descargado puede contener información de salud: guardalo en un lugar privado. Borrar los datos de este dispositivo no elimina copias que hayas descargado.</p></div>
      {backendConfigured && <p className="font-semibold text-ink">Si usás una cuenta conectada, la exportación y el borrado locales no incluyen los datos de la cuenta. No uses el borrado local como baja de una cuenta.</p>}
      <p className="text-[12px]">Información sobre el funcionamiento de esta versión, actualizada en septiembre de 2026. Antes de habilitar sincronización con cuentas se deberán publicar el responsable y contacto para ejercer derechos, los proveedores, las transferencias y los plazos aplicables.</p>
    </div>
  </Sheet>
}
