/// <reference types="jest" />
import { PackingService } from './packing.service';

describe('PackingService', () => {
  let service: PackingService;

  beforeEach(() => {
    service = new PackingService();
  });

  it('deve empacotar exemplo do enunciado (pedido simples)', () => {
    const resp = service.calcular({
      pedidos: [
        {
          pedido_id: 3,
          produtos: [
            { produto_id: 'Headset', dimensoes: { altura: 25, largura: 15, comprimento: 20 } },
          ],
        },
      ],
    });

    expect(resp.pedidos[0].pedido_id).toBe(3);
    expect(resp.pedidos[0].caixas[0].caixa_id).toBeDefined();
    expect(resp.pedidos[0].caixas[0].produtos).toContain('Headset');
  });

  it('deve retornar observacao quando produto nao cabe', () => {
    const resp = service.calcular({
      pedidos: [
        {
          pedido_id: 99,
          produtos: [
            { produto_id: 'Gigante', dimensoes: { altura: 120, largura: 60, comprimento: 70 } },
          ],
        },
      ],
    });

    expect(resp.pedidos[0].caixas[0].caixa_id).toBeNull();
    expect(resp.pedidos[0].caixas[0].observacao).toBeDefined();
  });
});


