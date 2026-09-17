# Backend de Vianda

## Estado

El backend real vive en Supabase. El proyecto reutilizado tiene ref
`ghmztlazgjtoykfekoaz` y su esquema público es exclusivamente el de Vianda.
Las tablas históricas de barbería se eliminaron antes de aplicar las migraciones.

El frontend se conecta solamente con variables de entorno:

```env
VITE_SUPABASE_URL=https://ghmztlazgjtoykfekoaz.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable key del proyecto>
```

Nunca usar `service_role` en Vite, Netlify client env ni código del navegador.

## Qué guarda la nube

- perfil y onboarding
- preferencias
- horarios
- relación insulina/carbohidratos, sólo si la persona la activa
- plan semanal y días
- checks/extras auxiliares sincronizables
- historial, compras, preparación y mochila: el esquema ya está preparado
- comidas/productos propios y preferencias sobre el catálogo
- fotos de etiquetas en bucket privado

## Catálogo

`data/catalogo/` sigue siendo la fuente canónica del catálogo que viene con la
app. La aplicación lo incluye en el bundle para poder abrir instantáneamente y
sin señal. `npm run catalogo:sql` genera el seed equivalente para Supabase.

El repositorio cloud NO descarga las ~200 comidas en cada arranque: sólo
sincroniza datos personales. Esto evita bloquear la app por red y mantiene el
catálogo disponible offline.

## Local-first

`src/lib/repo/supabase.ts` hace:

1. abre con la copia local;
2. si hay sesión válida, importa una sola vez el estado guest cuando corresponde;
3. lee el estado personal de Supabase;
4. guarda local primero y nube después;
5. si falla la red, encola la operación y la reintenta en el próximo bootstrap.

Cerrar sesión borra la copia personal de ese dispositivo antes de volver al
modo invitado. El estado puramente visual (por ejemplo foco) queda sólo local.

## Seguridad

Todas las tablas personales tienen RLS. El catálogo global es legible por
usuarios autenticados y sólo modificable por una cuenta con
`app_metadata.vianda_admin = true`.

Las funciones de triggers no tienen `EXECUTE` público y las funciones internas
tienen `search_path` fijo. El bucket `etiquetas` es privado.

El linter de seguridad de Supabase queda sin findings después de las migraciones
0011–0013. Los avisos de rendimiento restantes son índices todavía sin uso en
una base recién creada; no son fallas.

## Verificación

GitHub Actions corre en cada push/PR:

- TypeScript
- ESLint
- chequeo del catálogo
- build de producción
- todas las migraciones contra PostgreSQL 17
- suite SQL de RLS

Antes de desplegar una versión conectada, configurar URL + publishable key en
el proveedor de deploy. Sin esas variables la app sigue funcionando contra el
repositorio local.
