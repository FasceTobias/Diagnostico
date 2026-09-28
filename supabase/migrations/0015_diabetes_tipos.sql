-- El tipo de diabetes es independiente del uso y esquema de insulina.
-- Las respuestas de tratamiento se guardan en preferences.extra, para no
-- reinterpretar insulin_enabled (configuración antigua de un módulo distinto).
alter type diabetes_type add value if not exists 'lada';
alter type diabetes_type add value if not exists 'mody-otro';
alter type diabetes_type add value if not exists 'otro';
alter type diabetes_type add value if not exists 'no-seguro';
