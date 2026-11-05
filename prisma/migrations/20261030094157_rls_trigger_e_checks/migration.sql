-- Dados sensíveis só existem enquanto o cadastro está pendente
ALTER TABLE "host_verifications"
  ADD CONSTRAINT "sensitive_fields_only_while_pending"
  CHECK (
    status = 'pending'
    OR (document_number IS NULL
        AND document_image_path IS NULL
        AND selfie_path IS NULL
        AND residence_proof_path IS NULL)
  );

-- O mesmo documento não pode estar em duas contas
CREATE UNIQUE INDEX "host_verifications_document_hash_key"
  ON "host_verifications"("document_hash")
  WHERE "document_hash" IS NOT NULL;

-- RLS ligada em todas as tabelas, sem políticas: a API REST do
-- Supabase não lê nada. O Prisma ignora a RLS (liga-se como postgres).
ALTER TABLE "countries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "regions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "onboarding_drafts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "emigrant_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "host_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "host_verifications" ENABLE ROW LEVEL SECURITY;

-- Cria a linha em public.users quando alguém se regista no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'given_name'),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name',  NEW.raw_user_meta_data ->> 'family_name')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.onboarding_drafts (user_id, step, data, expires_at)
  VALUES (NEW.id, 1, '{}'::jsonb, now() + interval '7 days')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Guardado: a shadow database do Prisma não tem o schema "auth"
DO $guard$
BEGIN
  IF to_regclass('auth.users') IS NULL THEN
    RAISE NOTICE 'schema auth ausente (shadow database), trigger ignorado';
    RETURN;
  END IF;

  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
END
$guard$;