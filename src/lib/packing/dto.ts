import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min, ValidateNested } from 'class-validator';

export class DimensoesDto {
  @ApiProperty({ example: 40 })
  @IsNumber()
  @IsPositive()
  altura!: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  largura!: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @IsPositive()
  comprimento!: number;
}

export class ProdutoDto {
  @ApiProperty({ example: 'PS5' })
  @IsString()
  @IsNotEmpty()
  produto_id!: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DimensoesDto)
  dimensoes!: DimensoesDto;
}

export class PedidoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  pedido_id!: number;

  @ApiProperty({ type: [ProdutoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoDto)
  produtos!: ProdutoDto[];
}

export class EmpacotamentoRequestDto {
  @ApiProperty({ type: [PedidoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoDto)
  pedidos!: PedidoDto[];
}

export interface CaixaDisponivel {
  caixa_id: string;
  altura: number;
  largura: number;
  comprimento: number;
}

export interface ResultadoCaixa {
  caixa_id: string | null;
  produtos: string[];
  observacao?: string;
}

export interface EmpacotamentoPedidoResultado {
  pedido_id: number;
  caixas: ResultadoCaixa[];
}

export interface EmpacotamentoResponseDto {
  pedidos: EmpacotamentoPedidoResultado[];
}


