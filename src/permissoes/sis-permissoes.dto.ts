import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SisPermissoesDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  usuario_id: string;

  @IsNotEmpty()
  @IsString()
  modulo: string;

  @IsNotEmpty()
  @IsString()
  tela: string;

  @IsBoolean()
  @IsOptional()
  visualizar?: boolean = false;

  @IsBoolean()
  @IsOptional()
  editar?: boolean = false;

  @IsBoolean()
  @IsOptional()
  criar?: boolean = false;

  @IsBoolean()
  @IsOptional()
  deletar?: boolean = false;
}
