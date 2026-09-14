# Base de datos

Las migraciones de `migrations/` son la única fuente de verdad del
esquema. Se aplican en orden y no se editan una vez aplicadas: si algo hay
que cambiar, se agrega una migración nueva.

| Archivo | Qué hace |
| --- | --- |
| `0001_base.sql` | El esquema completo de la Fase 1: perfiles, biblioteca, planes, compras, historial, insulina, preferencias. RLS activada en todas las tablas. |
| `0002_catalogo.sql` | Catálogo compartido, productos envasados como tabla propia, exclusiones, campos de onboarding y alta automática de perfil. |
| `0003_etiquetas.sql` | Bucket privado para las fotos de etiqueta. |

## Aplicarlas

Con el CLI de Supabase, desde la raíz del repo:

```bash
supabase link --project-ref <ref>
supabase db push
```

O pegando cada archivo en el editor SQL del proyecto, en orden.

## Dos reglas que no se rompen

**La clave de servicio no entra al frontend.** Ni siquiera como variable de
Netlify: todo lo que empieza con `VITE_` termina dentro del bundle que se
descarga el navegador. La app usa sólo `VITE_SUPABASE_URL` y
`VITE_SUPABASE_ANON_KEY`, que son públicas por diseño y no sirven de nada
sin RLS. Cargar el catálogo se hace desde un script local o una función de
Netlify, nunca desde la app.

**La seguridad vive en la base, no en el frontend.** Filtrar por
`profile_id` en una consulta es una comodidad, no una protección: si la
fila se puede leer sin el filtro, la protección no existe. Cada tabla tiene
RLS y cada política se prueba con dos cuentas antes de la beta.

## Quién es administración

`public.is_admin()` lee `app_metadata.vianda_admin` del JWT. `app_metadata`
sólo se puede escribir con la clave de servicio, así que nadie puede
ascenderse solo:

```bash
curl -X PUT "$SUPABASE_URL/auth/v1/admin/users/<uuid>" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"app_metadata": {"vianda_admin": true}}'
```

Es lo único que habilita escribir el catálogo compartido.
