-- ============================================================================
-- Permissões: a Análise de Produtos mudou de módulo e nasceu o Painel de Compras
-- ----------------------------------------------------------------------------
-- APLICAÇÃO MANUAL no Postgres da intranet (banco `intranet`).
--
-- Contexto: a tela /compras/analise (abas "Painel de Estoque" + "Análise de
-- Produtos") passou a viver em /estoque/analise, no módulo Estoque; o módulo
-- Compras ganhou /compras/painel (Eficiência de Compras). Sem este script:
--   · quem tinha a análise perde a tela (a permissão antiga aponta p/ rota morta);
--   · ninguém enxerga o painel novo no menu.
--
-- Idempotente: rode quantas vezes quiser. Envolvido em transação — confira os
-- SELECTs do fim antes do COMMIT se estiver rodando passo a passo.
-- ============================================================================

BEGIN;

-- 1) A permissão da análise acompanha a tela: vai para o módulo Estoque.
--    Mantém os flags de cada usuário (visualizar/editar/criar/deletar).
UPDATE sis_permissoes p
   SET modulo = 'Estoque',
       tela   = '/estoque/analise'
 WHERE p.tela = '/compras/analise'
   AND NOT EXISTS (
         SELECT 1 FROM sis_permissoes q
          WHERE q.usuario_id = p.usuario_id AND q.tela = '/estoque/analise');

-- Sobra só se o usuário JÁ tivesse a tela nova: a linha velha vira lixo.
DELETE FROM sis_permissoes WHERE tela = '/compras/analise';

-- 2) Painel de Compras para quem já acompanhava a análise (leitura).
--    Painel é somente leitura: editar/criar/deletar ficam falsos.
INSERT INTO sis_permissoes (id, usuario_id, modulo, tela, visualizar, editar, criar, deletar)
SELECT gen_random_uuid()::text, p.usuario_id, 'Compras', '/compras/painel', true, false, false, false
  FROM sis_permissoes p
 WHERE p.tela = '/estoque/analise'
   AND p.visualizar = true
   AND NOT EXISTS (
         SELECT 1 FROM sis_permissoes q
          WHERE q.usuario_id = p.usuario_id AND q.tela = '/compras/painel');

-- 3) Conferência.
SELECT modulo, tela, COUNT(*) AS usuarios, COUNT(*) FILTER (WHERE visualizar) AS com_visualizar
  FROM sis_permissoes
 WHERE tela IN ('/compras/analise', '/estoque/analise', '/compras/painel')
 GROUP BY modulo, tela
 ORDER BY 1, 2;

COMMIT;
