const apiBaseInput = document.getElementById('base');
const apiBase = () => apiBaseInput.value || 'http://localhost:3000';
let token = '';

const payloadEl = document.getElementById('payload');
const outEl = document.getElementById('out');
const loginMsg = document.getElementById('loginMsg');
const pedidoIdSpan = document.getElementById('pedidoId');

const prodTableBody = document.querySelector('#prodTable tbody');
const pedidosTableBody = document.querySelector('#pedidosTable tbody');

let produtosCurrent = [];
let pedidos = [];
let pedidoSeq = 1;

function renderProdutos(){
  prodTableBody.innerHTML='';
  produtosCurrent.forEach((p,idx)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${p.produto_id}</td><td>${p.dimensoes.altura}</td><td>${p.dimensoes.largura}</td><td>${p.dimensoes.comprimento}</td><td><button data-i="${idx}" class="ghost small">Remover</button></td>`;
    prodTableBody.appendChild(tr);
  });
}

function renderPedidos(){
  pedidosTableBody.innerHTML='';
  pedidos.forEach((pd,idx)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>#${pd.pedido_id}</td><td>${pd.produtos.length}</td><td><button data-i="${idx}" class="ghost small danger">Excluir</button></td>`;
    pedidosTableBody.appendChild(tr);
  });
  payloadEl.value = JSON.stringify({ pedidos }, null, 2);
}

document.getElementById('addProd').addEventListener('click',()=>{
  const id=document.getElementById('pId').value.trim();
  const a=parseFloat(document.getElementById('pAlt').value);
  const l=parseFloat(document.getElementById('pLar').value);
  const c=parseFloat(document.getElementById('pComp').value);
  if(!id||!a||!l||!c){ alert('Preencha ID e dimensões (>0).'); return; }
  produtosCurrent.push({ produto_id:id, dimensoes:{ altura:a, largura:l, comprimento:c }});
  renderProdutos();
});

prodTableBody.addEventListener('click',(e)=>{
  const btn=e.target.closest('button');
  if(!btn) return;
  const i=parseInt(btn.dataset.i,10);
  produtosCurrent.splice(i,1);
  renderProdutos();
});

document.getElementById('clearProds').addEventListener('click',()=>{
  produtosCurrent=[]; renderProdutos();
});

document.getElementById('addPedido').addEventListener('click',()=>{
  if(produtosCurrent.length===0){ alert('Adicione ao menos um produto.'); return; }
  pedidos.push({ pedido_id: pedidoSeq++, produtos:[...produtosCurrent] });
  produtosCurrent=[]; renderProdutos(); renderPedidos();
  pedidoIdSpan.textContent=String(pedidoSeq);
});

pedidosTableBody.addEventListener('click',(e)=>{
  const btn=e.target.closest('button');
  if(!btn) return;
  const i=parseInt(btn.dataset.i,10);
  pedidos.splice(i,1); renderPedidos();
});

document.getElementById('resetAll').addEventListener('click',()=>{
  produtosCurrent=[]; pedidos=[]; pedidoSeq=1; renderProdutos(); renderPedidos(); pedidoIdSpan.textContent='1'; outEl.textContent='';
});

document.getElementById('btnLogin').addEventListener('click', async () => {
  loginMsg.textContent = 'Autenticando...';
  try {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    const res = await fetch(`${apiBase()}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    token = data.access_token;
    loginMsg.textContent = 'Token obtido com sucesso';
  } catch (e) {
    loginMsg.textContent = 'Falha no login: ' + e.message;
  }
});

document.getElementById('btnDocs').addEventListener('click',()=>{
  window.open(`${apiBase()}/docs`,`_blank`);
});

document.getElementById('btnCalc').addEventListener('click', async () => {
  outEl.textContent = 'Calculando...';
  try {
    if(pedidos.length===0){ alert('Adicione ao menos um pedido.'); outEl.textContent=''; return; }
    const body = { pedidos };
    const res = await fetch(`${apiBase()}/packing/calculate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    outEl.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    outEl.textContent = 'Erro: ' + e.message;
  }
});

// Estado inicial
renderProdutos();
renderPedidos();
