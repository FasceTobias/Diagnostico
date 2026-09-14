-- ==================================================================
-- 0004 — El perfil: quién sos, hasta donde quisiste contar
--
-- Todo opcional y todo con default, porque el onboarding se puede
-- saltear entero y la app tiene que funcionar igual.
--
-- Aclaración que vale para toda esta migración: nada de esto filtra
-- comida. No hay lista negra por tipo de diabetes ni modo dieta. Lo que
-- decide es qué información se muestra al lado de la comida y qué
-- herramientas se encienden.
-- ==================================================================

create type diabetes_type as enum (
  'tipo-1', 'tipo-2', 'gestacional', 'prediabetes', 'sin-diabetes', 'prefiero-no-decir'
);

-- Para vos, o para alguien a quien acompañás.
create type perfil_rol as enum ('para-mi', 'acompanio');

alter table profiles
  add column diabetes  diabetes_type,
  add column rol       perfil_rol not null default 'para-mi',
  -- Cuándo se contó: un diagnóstico puede cambiar, y una gestacional
  -- termina. Sirve para volver a preguntar en algún momento, no para
  -- decidir nada.
  add column diabetes_desde date;

comment on column profiles.diabetes is
  'Sólo cambia qué información se muestra. Nunca filtra comida.';

-- El onboarding se contesta de a poco: 0002 ya sumó onboarding_step y
-- onboarding_completed_at. Acá se suma lo que faltaba para retomarlo.
alter table profiles
  add column onboarding_skipped boolean not null default false;

-- Gustos que salen de la presentación.
alter table preferences
  add column sweet_or_salty_asked boolean not null default false;
