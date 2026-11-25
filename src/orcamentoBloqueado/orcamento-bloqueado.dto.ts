import { ApiProperty } from '@nestjs/swagger';

export class OrcamentoBloqueadoResponseDto {
  @ApiProperty({
    description: 'Código do representante de vendas informado na rota',
    example: 12,
  })
  vendas_rep_codigo: number;

  @ApiProperty({
    description: 'Valor aplicado ao campo orcamentoBloqueado',
    example: false,
  })
  orcamentoBloqueado: boolean;

  @ApiProperty({
    description: 'Quantidade de usuários atualizados',
    example: 1,
  })
  atualizados: number;

  @ApiProperty({
    description:
      'Orçamentos do rep (importados no Celta e não comparados) que receberam liberadogerencia = true',
    example: 1,
  })
  orcamentos_liberados: number;
}
