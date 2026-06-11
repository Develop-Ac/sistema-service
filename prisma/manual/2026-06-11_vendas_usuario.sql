-- Hub de Vendas: vincula vendedor (rep_codigo) e hub inicial ao usuário.
-- Aplicar manualmente no Postgres do sistema-service (sem `prisma migrate`).
-- Depois rodar `npx prisma generate` no sistema-service.

ALTER TABLE sis_usuarios ADD COLUMN IF NOT EXISTS vendas_rep_codigo  INTEGER;
ALTER TABLE sis_usuarios ADD COLUMN IF NOT EXISTS vendas_hub_inicial VARCHAR(10); -- 'VAREJO' | 'ATACADO'

-- Exemplos (opcional):
-- UPDATE sis_usuarios SET vendas_rep_codigo = 341, vendas_hub_inicial = 'VAREJO'  WHERE codigo = '<codigo_bruno>';
-- UPDATE sis_usuarios SET vendas_rep_codigo = 163, vendas_hub_inicial = 'ATACADO' WHERE codigo = '<codigo_alisson>';
