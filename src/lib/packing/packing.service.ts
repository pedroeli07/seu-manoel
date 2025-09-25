import { Injectable } from '@nestjs/common';
import { CaixaDisponivel, EmpacotamentoPedidoResultado, EmpacotamentoRequestDto, EmpacotamentoResponseDto, ProdutoDto, ResultadoCaixa } from './dto';

interface ProdutoInterno {
  id: string;
  dims: [number, number, number]; // sorted descending per item to allow rotation
  volume: number;
}

interface CaixaEstado {
  def: CaixaDisponivel;
  usados: ProdutoInterno[];
  volumeUsado: number;
}

@Injectable()
export class PackingService {
  private readonly caixas: CaixaDisponivel[] = [
    { caixa_id: 'Caixa 1', altura: 30, largura: 40, comprimento: 80 },
    { caixa_id: 'Caixa 2', altura: 50, largura: 50, comprimento: 40 },
    { caixa_id: 'Caixa 3', altura: 50, largura: 80, comprimento: 60 },
  ];

  private getProdutoInterno(p: ProdutoDto): ProdutoInterno {
    const dims = [p.dimensoes.altura, p.dimensoes.largura, p.dimensoes.comprimento].sort((a, b) => b - a) as [number, number, number];
    const volume = p.dimensoes.altura * p.dimensoes.largura * p.dimensoes.comprimento;
    return { id: p.produto_id, dims, volume };
  }

  private cabeNaCaixa(prod: ProdutoInterno, caixa: CaixaDisponivel): boolean {
    // Permite rotação: tente todas as permutações (6)
    const dims = prod.dims;
    const permutations: [number, number, number][] = [
      [dims[0], dims[1], dims[2]],
      [dims[0], dims[2], dims[1]],
      [dims[1], dims[0], dims[2]],
      [dims[1], dims[2], dims[0]],
      [dims[2], dims[0], dims[1]],
      [dims[2], dims[1], dims[0]],
    ];
    return permutations.some(([a, l, c]) => a <= caixa.altura && l <= caixa.largura && c <= caixa.comprimento);
  }

  private empacotarPedido(produtos: ProdutoDto[]): ResultadoCaixa[] {
    const itens = produtos.map((p) => this.getProdutoInterno(p));
    // Heurística: ordenar por volume decrescente e tentar best-fit em caixas, abrindo novas quando necessário.
    itens.sort((a, b) => b.volume - a.volume);

    const resultados: CaixaEstado[] = [];

    for (const item of itens) {
      // Primeiro, verifique se cabe em alguma caixa já aberta com espaço dimensional suficiente.
      // Observação: aqui usamos uma heurística com verificação apenas dimensional item-a-caixa (não 3D exato),
      // e controlamos pelo volume para evitar estouro grosseiro.
      let colocado = false;
      let melhorIndice = -1;
      let menorEspacoRestante = Number.POSITIVE_INFINITY;

      for (let i = 0; i < resultados.length; i++) {
        const estado = resultados[i];
        const volumeCaixa = estado.def.altura * estado.def.largura * estado.def.comprimento;
        const volumeRestante = volumeCaixa - estado.volumeUsado;
        if (this.cabeNaCaixa(item, estado.def) && item.volume <= volumeRestante) {
          // escolha best-fit por volume restante mais apertado
          if (volumeRestante - item.volume < menorEspacoRestante) {
            menorEspacoRestante = volumeRestante - item.volume;
            melhorIndice = i;
          }
        }
      }

      if (melhorIndice >= 0) {
        const estado = resultados[melhorIndice];
        estado.usados.push(item);
        estado.volumeUsado += item.volume;
        colocado = true;
      }

      if (!colocado) {
        // Abrir nova caixa, escolhendo a menor possível em que o item caiba
        const caixaEscolhida = this.caixas
          .filter((c) => this.cabeNaCaixa(item, c))
          .sort((a, b) => a.altura * a.largura * a.comprimento - b.altura * b.largura * b.comprimento)[0];

        if (!caixaEscolhida) {
          // Não cabe em nenhuma caixa – registramos como uma "caixa" especial para o item
          resultados.push({
            def: { caixa_id: 'N/A', altura: 0, largura: 0, comprimento: 0 },
            usados: [item],
            volumeUsado: item.volume,
          });
          continue;
        }

        resultados.push({ def: caixaEscolhida, usados: [item], volumeUsado: item.volume });
      }
    }

    // Mapear resultado final
    const mapped: ResultadoCaixa[] = resultados.map((r) => {
      if (r.def.caixa_id === 'N/A') {
        return {
          caixa_id: null,
          produtos: r.usados.map((u) => u.id),
          observacao: 'Produto não cabe em nenhuma caixa disponível.',
        };
      }
      return { caixa_id: r.def.caixa_id, produtos: r.usados.map((u) => u.id) };
    });
    return mapped;
  }

  public calcular(req: EmpacotamentoRequestDto): EmpacotamentoResponseDto {
    const pedidos: EmpacotamentoPedidoResultado[] = req.pedidos.map((p) => ({
      pedido_id: p.pedido_id,
      caixas: this.empacotarPedido(p.produtos),
    }));
    return { pedidos };
  }
}


