/* eslint-disable no-console */

const base = process.env.SMOKE_BASE_URL || 'http://localhost:3000';
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASS || 'admin123';

async function waitForServer(timeoutMs = 60000) {
  const start = Date.now();
  const urls = [`${base}/docs`, `${base}/auth/login`];
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(urls[0], { method: 'GET' });
      if (res.ok) return true;
    } catch {}
    try {
      const res = await fetch(urls[1], {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: adminUser, password: adminPass }),
      });
      if (res.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
    process.stdout.write('.');
  }
  return false;
}

async function login() {
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: adminUser, password: adminPass }),
  });
  if (!res.ok) throw new Error(`login failed: ${res.status}`);
  const json = await res.json();
  if (!json.access_token) throw new Error('no access_token');
  return json.access_token;
}

function buildSampleInput() {
  return {
    pedidos: [
      { pedido_id: 1, produtos: [
        { produto_id: 'PS5', dimensoes: { altura: 40, largura: 10, comprimento: 25 } },
        { produto_id: 'Volante', dimensoes: { altura: 40, largura: 30, comprimento: 30 } },
      ]},
      { pedido_id: 2, produtos: [
        { produto_id: 'Joystick', dimensoes: { altura: 15, largura: 20, comprimento: 10 } },
        { produto_id: 'Fifa 24', dimensoes: { altura: 10, largura: 30, comprimento: 10 } },
        { produto_id: 'Call of Duty', dimensoes: { altura: 30, largura: 15, comprimento: 10 } },
      ]},
      { pedido_id: 3, produtos: [
        { produto_id: 'Headset', dimensoes: { altura: 25, largura: 15, comprimento: 20 } },
      ]},
      { pedido_id: 4, produtos: [
        { produto_id: 'Mouse Gamer', dimensoes: { altura: 5, largura: 8, comprimento: 12 } },
        { produto_id: 'Teclado Mecânico', dimensoes: { altura: 4, largura: 45, comprimento: 15 } },
      ]},
      { pedido_id: 5, produtos: [
        { produto_id: 'Cadeira Gamer', dimensoes: { altura: 120, largura: 60, comprimento: 70 } },
      ]},
      { pedido_id: 6, produtos: [
        { produto_id: 'Webcam', dimensoes: { altura: 7, largura: 10, comprimento: 5 } },
        { produto_id: 'Microfone', dimensoes: { altura: 25, largura: 10, comprimento: 10 } },
        { produto_id: 'Monitor', dimensoes: { altura: 50, largura: 60, comprimento: 20 } },
        { produto_id: 'Notebook', dimensoes: { altura: 2, largura: 35, comprimento: 25 } },
      ]},
      { pedido_id: 7, produtos: [
        { produto_id: 'Jogo de Cabos', dimensoes: { altura: 5, largura: 15, comprimento: 10 } },
      ]},
      { pedido_id: 8, produtos: [
        { produto_id: 'Controle Xbox', dimensoes: { altura: 10, largura: 15, comprimento: 10 } },
        { produto_id: 'Carregador', dimensoes: { altura: 3, largura: 8, comprimento: 8 } },
      ]},
      { pedido_id: 9, produtos: [
        { produto_id: 'Tablet', dimensoes: { altura: 1, largura: 25, comprimento: 17 } },
      ]},
      { pedido_id: 10, produtos: [
        { produto_id: 'HD Externo', dimensoes: { altura: 2, largura: 8, comprimento: 12 } },
        { produto_id: 'Pendrive', dimensoes: { altura: 1, largura: 2, comprimento: 5 } },
      ]},
    ],
  };
}

async function calculate(token, payload) {
  const res = await fetch(`${base}/packing/calculate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`calculate failed: ${res.status}`);
  return res.json();
}

function validateOutput(out) {
  const issues = [];
  if (!out || !Array.isArray(out.pedidos)) issues.push('missing pedidos array');
  if (out.pedidos?.length !== 10) issues.push('expected 10 pedidos');
  const p5 = out.pedidos?.find((p) => p.pedido_id === 5);
  if (!p5) issues.push('pedido 5 missing');
  else if (p5.caixas?.[0]?.caixa_id !== null) issues.push('pedido 5 should have caixa_id null');
  return issues;
}

(async () => {
  console.log(`Waiting for API at ${base} ...`);
  const up = await waitForServer();
  if (!up) {
    console.error('API not reachable. Ensure Docker is running: docker compose up -d');
    process.exit(2);
  }
  console.log('\nAPI is up');

  const token = await login();
  console.log('Obtained JWT');

  const input = buildSampleInput();
  const output = await calculate(token, input);

  const issues = validateOutput(output);
  if (issues.length) {
    console.error('Smoke test FAILED:', issues);
    console.error(JSON.stringify(output, null, 2));
    process.exit(1);
  }

  console.log('Smoke test PASSED');
})();
