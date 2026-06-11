-- Hub de Vendas: vincula vendedor (rep_codigo) e hub inicial ao usuário.
-- Aplicar manualmente no Postgres do sistema-service (sem `prisma migrate`).
-- Depois rodar `npx prisma generate` no sistema-service.

ALTER TABLE sis_usuarios ADD COLUMN IF NOT EXISTS vendas_rep_codigo  INTEGER;
ALTER TABLE sis_usuarios ADD COLUMN IF NOT EXISTS vendas_hub_inicial VARCHAR(30); -- 'VAREJO' | 'ATACADO' | 'SUPERVISAO_ATACADO'

-- Se a coluna já existe como VARCHAR(10), alargue para caber 'SUPERVISAO_ATACADO':
ALTER TABLE sis_usuarios ALTER COLUMN vendas_hub_inicial TYPE VARCHAR(30);

-- Exemplos (opcional):
-- UPDATE sis_usuarios SET vendas_rep_codigo = 341, vendas_hub_inicial = 'VAREJO'  WHERE codigo = '<codigo_bruno>';
-- UPDATE sis_usuarios SET vendas_rep_codigo = 163, vendas_hub_inicial = 'ATACADO' WHERE codigo = '<codigo_alisson>';
-- Supervisor (sem rep): UPDATE sis_usuarios SET vendas_rep_codigo = NULL, vendas_hub_inicial = 'SUPERVISAO_ATACADO' WHERE codigo = '<codigo_supervisor>';
