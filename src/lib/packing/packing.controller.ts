import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmpacotamentoRequestDto, EmpacotamentoResponseDto } from './dto';
import { PackingService } from './packing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('packing')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('packing')
export class PackingController {
  constructor(private readonly packing: PackingService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calcula o empacotamento por pedido' })
  @ApiBody({ type: EmpacotamentoRequestDto })
  calculate(@Body() body: EmpacotamentoRequestDto): EmpacotamentoResponseDto {
    return this.packing.calcular(body);
  }
}


