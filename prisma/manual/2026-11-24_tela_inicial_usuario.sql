-- Tela inicial: rota interna em que o usuário entra no sistema após o login.
-- Aplicar manualmente no Postgres da intranet ANTES do deploy do sistema-service (sem `prisma migrate`).
-- Depois rodar `npx prisma generate` no sistema-service.

ALTER TABLE sis_usuarios ADD COLUMN IF NOT EXISTS tela_inicial VARCHAR(120);

COMMENT ON COLUMN sis_usuarios.tela_inicial IS 'Rota em que o usuário entra no sistema após o login; vazio = feed';
