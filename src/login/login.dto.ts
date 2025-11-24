import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'USR001' })
  @IsNotEmpty()
  @IsString()
  codigo!: string;

  @ApiProperty({ example: 'SenhaF0rte!' })
  @IsNotEmpty()
  @IsString()
  senha!: string;
}

export class LoginResponseView {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token!: string;

  @ApiProperty({ example: 3600, description: 'Validade do token em segundos' })
  expires_in!: number;

  @ApiProperty({
    example: 'JOÃO DA SILVA',
  })
  usuario!: string;

  @ApiProperty({
    example: 'user-123',
  })
  usuario_id!: string;

  @ApiProperty({
    example: 'USR001',
  })
  codigo!: string;

  @ApiProperty({
    example: 'TI',
    required: false,
  })
  setor?: string;

  @ApiProperty({
    example: [
      {
        id: 'uuid',
        usuario_id: 'user-123',
        modulo: 'estoque',
        tela: 'produtos',
        visualizar: true,
        editar: false,
        criar: false,
        deletar: false,
      },
    ],
    description: 'Permissões do usuário',
    required: false,
    type: 'array',
  })
  permissoes?: any[];

  @ApiProperty({ example: 'Bearer' })
  token_type!: string;
}

