import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Giovana Custodio', maxLength: 255 })
  @IsNotEmpty() @IsString() @MaxLength(255)
  nome!: string;

  @ApiProperty({ example: '12345', maxLength: 50, description: 'Código único do usuário' })
  @IsNotEmpty() @IsString() @MaxLength(50)
  codigo!: string;

  @ApiProperty({ example: 'TI', maxLength: 100, description: 'Setor do usuário' })
  @IsString() @MaxLength(100)
  setor!: string;

  @ApiProperty({ example: 'Admin', maxLength: 100, description: 'Perfil de acesso do usuário' })
  @IsNotEmpty() @IsString() @MaxLength(100)
  perfil_acesso!: string;

  @ApiProperty({ example: 'SenhaF0rte!', minLength: 6, description: 'Mínimo 6 caracteres' })
  @IsNotEmpty() @IsString() @MinLength(6)
  senha!: string;

  @ApiPropertyOptional({ example: 341, description: 'rep_codigo do vendedor (painel de vendas)' })
  @IsOptional() @Type(() => Number) @IsInt()
  vendas_rep_codigo?: number;

  @ApiPropertyOptional({ example: 'VAREJO', enum: ['VAREJO', 'ATACADO', 'SUPERVISAO_ATACADO', 'GERENCIA'], description: 'Hub de vendas inicial' })
  @IsOptional() @IsIn(['VAREJO', 'ATACADO', 'SUPERVISAO_ATACADO', 'GERENCIA'])
  vendas_hub_inicial?: string;
}

export class UsuarioView {
  @ApiProperty({ example: 'cuid123' }) id!: string;
  @ApiProperty({ example: 'Giovana Custodio' }) nome!: string;
  @ApiProperty({ example: '12345' }) codigo!: string;
  @ApiProperty({ example: 'Vendas' }) setor!: string;
  @ApiProperty({ example: 'Admin' }) perfil_acesso!: string;
  @ApiPropertyOptional({ example: 341 }) vendas_rep_codigo?: number;
  @ApiPropertyOptional({ example: 'VAREJO' }) vendas_hub_inicial?: string;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) { }

