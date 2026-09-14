-- ==================================================================
-- 0003 — Fotos de etiqueta
--
-- El bucket es privado. Una foto de etiqueta no es información sensible,
-- pero es de alguien, y un bucket público es una lista abierta de todo lo
-- que subió toda la gente. Se leen con URL firmada.
--
-- Dos carpetas:
--   <uuid del usuario>/…  lo que subiste vos
--   catalogo/…            las del catálogo compartido
-- ==================================================================

insert into storage.buckets (id, name, public)
values ('etiquetas', 'etiquetas', false)
on conflict (id) do nothing;

-- Lo tuyo: la primera carpeta de la ruta tiene que ser tu id.
create policy "etiquetas propias: leer" on storage.objects
  for select to authenticated
  using (bucket_id = 'etiquetas' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "etiquetas propias: subir" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'etiquetas' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "etiquetas propias: reemplazar" on storage.objects
  for update to authenticated
  using (bucket_id = 'etiquetas' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'etiquetas' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "etiquetas propias: borrar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'etiquetas' and (storage.foldername(name))[1] = auth.uid()::text);

-- Las del catálogo las ve todo el mundo y las sube administración.
create policy "etiquetas del catalogo: leer" on storage.objects
  for select to authenticated
  using (bucket_id = 'etiquetas' and (storage.foldername(name))[1] = 'catalogo');

create policy "etiquetas del catalogo: escribir" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'etiquetas'
    and (storage.foldername(name))[1] = 'catalogo'
    and public.is_admin()
  )
  with check (
    bucket_id = 'etiquetas'
    and (storage.foldername(name))[1] = 'catalogo'
    and public.is_admin()
  );
