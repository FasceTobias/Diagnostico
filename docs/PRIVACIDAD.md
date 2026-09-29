# Privacidad y alcance de Vianda — revisión de septiembre de 2026

## Implementado en el despliegue sin backend

- El perfil de diabetes, uso y esquema de insulina son opcionales y editables.
- El plan, registro, perfil y compras se guardan en `localStorage` del navegador. No se transmiten a una base de datos de Vianda en el build sin variables de Supabase.
- Perfil explica dónde quedan los datos y permite descargar el estado local como JSON y borrarlo. El archivo puede contener información sensible; el borrado local no elimina descargas hechas por la persona.
- El catálogo público se incluye en la aplicación y no se exporta como dato personal.
- No hay calculadora de unidades de insulina visible desde comidas o ajustes. Los carbohidratos se presentan como estimaciones por porción.
- El hosting puede procesar datos técnicos de conexión para entregar el sitio. No afirmar que ninguna información técnica llega a terceros.

## Antes de habilitar cuentas o publicar una política legal definitiva

1. Identificar al responsable del tratamiento, domicilio y contacto para solicitudes. No inventar estos datos en el producto.
2. Verificar el proveedor, región de almacenamiento, encargados/subencargados, eventuales transferencias internacionales y medidas técnicas de seguridad del backend.
3. Implementar exportación y baja de la **cuenta completa** con eliminación remota, cola de cambios pendiente y controles de autenticación. El botón local se oculta si hay backend configurado porque no sería una baja real.
4. Definir y publicar plazos de conservación y una vía para acceso, rectificación y supresión; evaluar el registro de base de datos y obligaciones concretas con asesoramiento legal argentino.
5. Revisar si se usarán analítica, cookies o servicios adicionales antes de describirlos en una política.
6. Antes de cualquier función terapéutica, revisar requisitos regulatorios y validación clínica específica. Vianda no debe transformar carbohidratos en una indicación de dosis.

La Ley 25.326 considera sensible la información relativa a salud y exige información clara sobre finalidad, responsable, carácter de las respuestas y derechos de la persona; también establece deberes de seguridad y acceso/rectificación/supresión. Fuentes oficiales: https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion y https://www.argentina.gob.ar/aaip/datospersonales/derechos. La Ley 26.529 trata confidencialidad en la relación médico asistencial; Vianda no se presenta como historia clínica: https://www.argentina.gob.ar/normativa/nacional/ley-26529-160432/actualizacion.
