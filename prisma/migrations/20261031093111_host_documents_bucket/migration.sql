-- Bucket privado para os documentos de verificação do anfitrião.
-- O guard evita falhar na shadow database do Prisma, que não tem o schema storage.
do $$ begin if to_regclass('storage.buckets') is not null then
insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
  )
values (
    'host-documents',
    'host-documents',
    false,
    5242880,
    -- 5 MB
    array ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  ) on conflict (id) do
update
set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
end if;
end $$;