# Trabajar en esto desde dos máquinas

Este repositorio **es** la carpeta de trabajo. No hay nada del proyecto que
viva afuera: el código, el catálogo, las recetas, el esquema de la base, las
pruebas y estos documentos están todos acá adentro y versionados. Clonarlo en
otra computadora te deja exactamente donde estabas.

Lo único que **no** viaja por el repositorio son tres cosas, y es a propósito:

| Qué | Por qué no está |
| --- | --- |
| `node_modules/` | Se reinstala con un comando y pesa cientos de megas. |
| `dist/` | Es el resultado del build. Se regenera. |
| `.env` | **Tiene las claves.** Nunca va al repositorio, ni siquiera privado. |

---

## Primera vez en una máquina nueva

Necesitás **Node 22** (está fijado en `.nvmrc`) y git.

```bash
git clone https://github.com/FasceTobias/Diagnostico.git
cd Diagnostico
npm install
npm run dev
```

Abre en `http://localhost:5173`. **La app funciona entera así**, sin base de
datos y sin cuenta: los datos se guardan en el navegador de esa máquina.

Si vas a conectar Supabase, copiá el ejemplo y completá las dos claves:

```bash
cp .env.example .env
```

Ese archivo se queda en esa computadora. En la otra máquina hacés lo mismo,
con las mismas claves. **La `service_role` no va nunca**: al frontend sólo va
la `anon`, y lo que protege los datos es RLS en la base, no el frontend.

---

## El día a día con dos máquinas

Una sola regla, y evita el 100% de los líos:

> **Empezá con `git pull`. Terminá con `git push`.**

```bash
# al sentarte
git pull

# …trabajar…

# al levantarte
git add -A
git commit -m "qué hiciste"
git push
```

Lo que rompe esto es dejar cambios sin commitear en la máquina A y seguir en
la B: cuando volvés a la A, las dos versiones se pisan. Si te pasó:

```bash
git stash          # guardá lo local a un costado
git pull           # traé lo de la otra máquina
git stash pop      # volvé a poner lo tuyo encima
```

Si `git push` te rechaza porque la otra máquina subió algo primero, no forces
nada: `git pull --rebase` y volvé a pushear.

**La rama.** El repositorio tiene una sola rama y es la que viene por
defecto al clonar: `claude/meal-planning-pwa-e539dl`. No hace falta que
hagas nada para estar en la correcta.

---

## Los comandos

```bash
npm run dev              # servidor de desarrollo
npm run build            # build de producción a dist/
npm run preview          # servir ese build

npm run typecheck        # TypeScript, sin emitir
npm run lint             # oxlint

npm run catalogo:check   # las reglas que el catálogo no puede romper
npm run catalogo:carbs   # carbohidratos declarados contra los que dan los ingredientes
npm run catalogo:sql     # regenera el seed SQL desde data/catalogo/
npm run db:test          # migraciones + RLS contra un Postgres de verdad
```

**Antes de pushear**, lo mínimo: `npm run typecheck && npm run lint`. Si
tocaste el catálogo, además `npm run catalogo:check`.

### `db:test` necesita un Postgres

No usa la base de Supabase: levanta una local, corre todas las migraciones en
orden, aplica el seed y después intenta, desde una cuenta, tocar los datos de
la de al lado. Cada línea que dice OK es un intento que la base rechazó.

Necesita un Postgres escuchando en el puerto 5433. En Linux, con Postgres 16
instalado:

```bash
sudo mkdir -p /tmp/vianda-test && sudo chown postgres /tmp/vianda-test
sudo -u postgres /usr/lib/postgresql/16/bin/initdb -D /tmp/vianda-test -U postgres
sudo -u postgres /usr/lib/postgresql/16/bin/pg_ctl -D /tmp/vianda-test \
  -o '-k /tmp -p 5433' -l /tmp/pg.log start
npm run db:test
```

En macOS con Homebrew alcanza con `brew install postgresql@16` y arrancarlo en
ese puerto. Se puede apuntar a otro con `PGHOST`, `PGPORT` y `PGUSER`.

Si no tenés Postgres a mano, el resto de los comandos funciona igual. Lo que
no se puede es tocar `supabase/migrations/` sin correr esto: una migración que
nunca se ejecutó no es una migración, es un archivo de texto.

---

## Dónde está cada cosa

```
data/catalogo/
  v1.json               las 199 comidas. Fuente única: de acá salen la app y el seed SQL
  duplicados.json       pares parecidos, revisados uno por uno
  revision-carbos.json  comidas donde el carbohidrato declarado y el derivado no coinciden

src/lib/
  types.ts     el modelo de dominio; espeja supabase/migrations/
  catalogo.ts  el JSON convertido a lo que usa la app, y las fusiones de entradas
  recetas.ts   cómo se hace cada comida. Va aparte del JSON porque es prosa
  foods.ts     los ingredientes: sector, cómo se compran, carbohidratos, reemplazos
  carbos.ts    derivar el carbohidrato de un plato desde lo que lleva
  dia.ts       en qué momento del día estás, según el reloj
  domain.ts    rotación, reemplazos, lista de compras, tareas
  asistente.ts entender una frase y buscar en la biblioteca, con reglas
  store.ts     el estado en memoria
  repo/        dónde se guarda. Interfaz + implementación local

src/screens/   Inicio, Hoy (lo construido) y el resto todavía en obra
src/components/

supabase/
  migrations/  el esquema, versionado, con RLS
  seed/        el catálogo para la base, generado por catalogo:sql
  tests/       88 pruebas

scripts/       generadores y chequeos
docs/          esto
```

---

## Si trabajás con Claude Code en las dos máquinas

Vale la misma regla: **pull antes, push después**. Una sesión de Claude Code
que arranca con el repositorio desactualizado va a trabajar sobre una versión
vieja y después vas a tener que resolver el choque a mano.

Cuando termines una sesión larga, conviene que quede todo commiteado y
pusheado antes de cerrar, aunque sea a medio hacer: un commit con "a medias,
sigo mañana" es infinitamente mejor que un directorio con cambios sueltos que
la otra máquina no ve.
