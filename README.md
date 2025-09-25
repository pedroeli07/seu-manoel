# 🎮 Loja do Seu Manoel - Sistema de Empacotamento Inteligente

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)](https://jestjs.io/)

Sistema completo de empacotamento automatizado para a Loja do Seu Manoel, desenvolvido com **NestJS**, **TypeScript** e **Docker**. O sistema calcula automaticamente a melhor forma de empacotar produtos em caixas de papelão, minimizando o número de caixas utilizadas.

## 🚀 Funcionalidades

- **API RESTful** com NestJS e TypeScript
- **Autenticação JWT** com segurança robusta
- **Documentação Swagger** interativa
- **Frontend responsivo** para testes e demonstração
- **Algoritmo de empacotamento** otimizado (Best-Fit 3D)
- **Containerização Docker** completa
- **Testes unitários** com Jest
- **Validação de dados** com class-validator
- **Rate limiting** e proteções de segurança
- **Variáveis de ambiente** centralizadas

## 📦 Caixas Disponíveis

| Caixa | Dimensões (cm) | Volume (cm³) |
|-------|----------------|--------------|
| Caixa 1 | 30 × 40 × 80 | 96.000 |
| Caixa 2 | 50 × 50 × 40 | 100.000 |
| Caixa 3 | 50 × 80 × 60 | 240.000 |

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem tipada
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Jest** - Testes unitários
- **Helmet** - Segurança HTTP
- **class-validator** - Validação de dados

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização responsiva
- **JavaScript ES6+** - Lógica interativa
- **Nginx** - Servidor web

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Proxy reverso

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose instalados
- Git (para clonar o repositório)

### 1. Clone o repositório
```bash
git clone https://github.com/pedroeli07/seu-manoel
cd seu-manoel
```

### 2. Configure as variáveis de ambiente
```bash
# Crie o arquivo .env na raiz do projeto
cp .env.example .env

# Edite as variáveis conforme necessário
JWT_SECRET=sua-chave-secreta-super-segura-aqui
ADMIN_USER=admin
ADMIN_PASS=admin123
NODE_ENV=production
PORT=3000
```

### 3. Execute com Docker
```bash
# Construa e inicie todos os serviços
docker compose up --build -d

# Verifique se os containers estão rodando
docker compose ps
```

### 4. Acesse a aplicação
- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/docs
- **Frontend**: http://localhost:8080

## 📖 Como Usar

### 1. Autenticação

Primeiro, obtenha um token de acesso:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

### 2. Calcular Empacotamento

Use o token para acessar o endpoint de empacotamento:

```bash
curl -X POST http://localhost:3000/packing/calculate \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "pedidos": [
      {
        "pedido_id": 1,
        "produtos": [
          {
            "produto_id": "PS5",
            "dimensoes": {"altura": 40, "largura": 10, "comprimento": 25}
          },
          {
            "produto_id": "Volante",
            "dimensoes": {"altura": 40, "largura": 30, "comprimento": 30}
          }
        ]
      }
    ]
  }'
```

### 3. Interface Web

Acesse http://localhost:8080 para usar a interface web:

1. **Configure a API**: Insira a URL base da API (padrão: http://localhost:3000)
2. **Adicione produtos**: Preencha as dimensões dos produtos
3. **Crie pedidos**: Organize os produtos em pedidos
4. **Calcule empacotamento**: Clique em "Calcular Empacotamento"
5. **Visualize resultados**: Veja quais caixas foram utilizadas

## 🔧 Desenvolvimento Local

### Instalação
```bash
# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run start:dev
```

### Scripts Disponíveis
```bash
npm run build          # Compila o projeto
npm run start          # Inicia em produção
npm run start:dev      # Inicia em desenvolvimento
npm run start:debug    # Inicia em modo debug
npm run test           # Executa testes unitários
npm run test:watch     # Executa testes em modo watch
npm run test:cov       # Executa testes com cobertura
npm run lint           # Executa linter
npm run format         # Formata código com Prettier
```

### Estrutura do Projeto
```
seu-manoel/
├── src/
│   ├── lib/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── packing/        # Módulo de empacotamento
│   │   └── env.ts          # Configuração de ambiente
│   ├── app.module.ts       # Módulo principal
│   └── main.ts            # Ponto de entrada
├── frontend/              # Interface web
│   ├── index.html
│   ├── style.css
│   ├── main.js
│   └── Dockerfile
├── scripts/               # Scripts utilitários
├── test/                  # Testes e2e
├── docker-compose.yml     # Orquestração Docker
├── Dockerfile            # Container da API
└── README.md
```

## 🧪 Testes

### Testes Unitários
```bash
# Execute todos os testes
npm test

# Execute com cobertura
npm run test:cov

# Execute em modo watch
npm run test:watch
```

### Teste de Fumaça
```bash
# Execute o script de teste de fumaça
npm run smoke
```

### Testes E2E
```bash
# Execute testes end-to-end
npm run test:e2e
```

## 🔒 Segurança

### Medidas Implementadas
- **JWT** com expiração de 1 hora
- **Helmet** para headers de segurança
- **CORS** restrito a origens locais
- **Rate limiting** (120 requests/minuto)
- **Validação de entrada** com whitelist
- **Variáveis de ambiente** para dados sensíveis

### Configuração de Segurança
```typescript
// Headers de segurança
app.use(helmet());

// CORS restritivo
app.enableCors({
  origin: [/localhost:\d+$/],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: false,
});

// Rate limiting
ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }])
```

## 📊 Algoritmo de Empacotamento

### Estratégia Best-Fit 3D
O sistema utiliza uma heurística **Best-Fit** que:

1. **Ordena produtos** por volume (maior primeiro)
2. **Testa rotações** de cada produto (6 orientações possíveis)
3. **Seleciona a menor caixa** que acomoda o produto
4. **Otimiza espaço** tentando colocar múltiplos produtos na mesma caixa
5. **Retorna observação** para produtos que não cabem em nenhuma caixa

### Complexidade
- **Tempo**: O(n × m × 6) onde n = produtos, m = caixas
- **Espaço**: O(n) para armazenar resultados
- **Eficiência**: Boa para casos práticos, não é solver 3D exato

## 🐳 Docker

### Serviços Disponíveis
- **api**: API NestJS (porta 3000)
- **web**: Frontend Nginx (porta 8080)

### Comandos Docker
```bash
# Construir e iniciar
docker compose up --build -d

# Parar serviços
docker compose down

# Ver logs
docker compose logs -f

# Reconstruir apenas um serviço
docker compose build --no-cache api
docker compose up -d api
```

## 📝 API Reference

### Endpoints

#### `POST /auth/login`
Autentica usuário e retorna JWT.

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### `POST /packing/calculate`
Calcula empacotamento de pedidos.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "produtos": [
        {
          "produto_id": "string",
          "dimensoes": {
            "altura": "number",
            "largura": "number", 
            "comprimento": "number"
          }
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "caixas": [
        {
          "caixa_id": "Caixa 2",
          "produtos": ["PS5", "Volante"]
        }
      ]
    }
  ]
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido para o processo seletivo da EMPRESA L2.

---

**🎯 Objetivo**: Demonstrar habilidades em desenvolvimento de APIs robustas, seguras e escaláveis com NestJS, TypeScript e Docker.

**🔧 Stack**: NestJS + TypeScript + Docker + Jest + Swagger + JWT + Nginx
