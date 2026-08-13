# API REST de Usuários com Node.js

API REST para gerenciamento de usuários, desenvolvida como projeto de estudo e portfólio para demonstrar conhecimentos em desenvolvimento back-end, persistência de dados e automação de testes.

O projeto implementa um CRUD completo com Node.js, Express e MySQL. A qualidade da API é verificada em duas camadas: testes de contrato com Jest e Supertest e testes funcionais com Postman e Newman. Todo esse processo também pode ser executado em uma pipeline manual no GitHub Actions.

> Status: projeto concluído dentro do escopo proposto.

## Principais destaques

- API REST com operações de criação, consulta, atualização e exclusão de usuários;
- persistência em MySQL e criação automática da tabela `users`;
- queries SQL parametrizadas;
- separação entre aplicação Express e inicialização da infraestrutura;
- organização em rotas, controllers, model, middleware e configuração;
- middleware de autorização nas rotas de escrita;
- tratamento de recursos inexistentes e erros internos;
- testes automatizados de contrato HTTP com Jest e Supertest;
- fluxo funcional completo com Postman e Newman;
- pipeline manual de testes no GitHub Actions com Node.js e MySQL;
- relatório de cobertura disponível pelo Jest.

## Tecnologias

- Node.js 24
- Express 5
- JavaScript e CommonJS
- MySQL 8
- Jest
- Supertest
- Postman
- Newman
- GitHub Actions
- Nodemon

## Arquitetura

A aplicação separa a construção do servidor Express da inicialização do banco e da abertura da porta HTTP. Essa divisão permite que o Supertest importe a aplicação diretamente e execute os contratos HTTP em memória, sem iniciar um servidor ou depender de um banco real.

```text
Requisição HTTP
    ↓
Express e rotas
    ↓
Middleware de autorização, quando aplicável
    ↓
Controllers
    ↓
UserModel
    ↓
MySQL
```

Nos testes com Jest, o `UserModel` é simulado para produzir cenários determinísticos de sucesso, recurso inexistente e erro interno. Na execução com Newman, a API e o MySQL reais são utilizados para validar o fluxo completo.

## Endpoints

A URL local padrão é `http://127.0.0.1:3001`.

| Método | Endpoint | Protegido | Descrição |
| --- | --- | --- | --- |
| `GET` | `/health` | Não | Verifica a disponibilidade da API |
| `GET` | `/users/list` | Não | Lista todos os usuários |
| `GET` | `/user/:id` | Não | Busca um usuário pelo ID |
| `POST` | `/user/create` | Sim | Cria um usuário |
| `PUT` | `/user/edit/:id` | Sim | Atualiza um usuário |
| `DELETE` | `/user/:id` | Sim | Exclui um usuário |

### Corpo das requisições de criação e atualização

```json
{
  "name": "Felipe Gabriel",
  "age": 30
}
```

### Autorização

As rotas de criação, atualização e exclusão exigem o header `Authorization`:

```http
Authorization: Bearer token-de-exemplo
```

O middleware possui finalidade didática e verifica apenas a presença do header. Ele não implementa emissão, assinatura ou validação de JWT.

## Como executar localmente

### Pré-requisitos

- Node.js 24 ou versão compatível;
- npm;
- MySQL 8 em execução.

### 1. Instale as dependências

```bash
npm install
```

### 2. Prepare as variáveis de ambiente

O repositório inclui o arquivo `.env.example` com todas as variáveis exigidas pela aplicação. Crie uma cópia chamada `.env`:

```powershell
Copy-Item .env.example .env
```

Preencha o novo arquivo com os dados do seu MySQL:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=usuarios_crud
```

O arquivo `.env` contém credenciais locais e não deve ser versionado. O `.env.example` permanece no repositório como referência segura de configuração.

### 3. Crie o banco de dados

A aplicação cria automaticamente a tabela `users`, mas o banco informado em `DB_NAME` precisa existir:

```sql
CREATE DATABASE usuarios_crud;
```

### 4. Inicie a API

```bash
npm run dev
```

Após a conexão com o banco, a API estará disponível na porta `3001`. Para conferir:

```http
GET http://127.0.0.1:3001/health
```

## Testes automatizados

A suíte local possui **7 suítes e 23 testes**, cobrindo configuração, health check, autorização e todos os endpoints do CRUD em cenários positivos e negativos.

```bash
# Executa Jest e Supertest
npm test

# Executa os testes em modo interativo
npm run test:watch

# Gera o relatório de cobertura
npm run test:coverage
```

Os testes com Supertest exercitam o contrato HTTP da aplicação sem abrir a porta `3001` e sem acessar o MySQL. O model é simulado para isolar rotas, middleware e controllers.

### Testes funcionais com Newman

Com a API e o MySQL em execução, a collection do Postman pode ser executada pelo terminal:

```bash
npm run test:postman
```

A collection realiza um ciclo independente e reproduzível:

```text
Health → Create → Search → Update → List → Delete
```

O ID criado durante a execução é reutilizado nas requisições seguintes e o registro é excluído ao final. Assim, o teste não depende de IDs fixos nem de dados previamente cadastrados.

## Pipeline de testes

O workflow `.github/workflows/api-tests.yml` disponibiliza a pipeline **API tests** no GitHub Actions. Ela é iniciada manualmente pela opção `Run workflow`, permitindo demonstrar o processo de integração sem consumir execuções a cada alteração no repositório.

A pipeline executa as seguintes etapas:

1. prepara o ambiente Ubuntu com Node.js 24;
2. instala as dependências de forma reproduzível com `npm ci`;
3. executa os testes de contrato com Jest e Supertest;
4. inicia um serviço temporário do MySQL 8;
5. configura credenciais descartáveis para o banco de teste;
6. inicia a API e aguarda a resposta do health check;
7. executa o fluxo funcional do Postman com Newman;
8. encerra a aplicação e disponibiliza os logs para diagnóstico.

O banco e as credenciais existem somente durante o job. Nenhum segredo ou dado do ambiente local é enviado para a pipeline.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia a API com reinicialização automática pelo Nodemon |
| `npm test` | Executa toda a suíte Jest/Supertest |
| `npm run test:watch` | Executa o Jest em modo watch |
| `npm run test:coverage` | Gera o relatório de cobertura |
| `npm run test:postman` | Executa a collection com Newman |

## Estrutura do projeto

```text
.
├── .github/
│   └── workflows/
│       └── api-tests.yml
├── postman/
│   └── api_collection.json
├── src/
│   ├── config/
│   │   └── env.js
│   ├── controllers/
│   │   ├── health.js
│   │   └── users.js
│   ├── database/
│   │   └── database.js
│   ├── middlewares/
│   │   └── AuthMiddleware.js
│   ├── models/
│   │   └── userModel.js
│   ├── tests/
│   │   ├── config/
│   │   ├── http/
│   │   └── setup.js
│   ├── app.js
│   ├── index.js
│   └── routes.js
├── .env.example
├── jest.config.js
└── package.json
```

## Competências demonstradas

Este projeto foi construído como uma experiência prática de engenharia de software e qualidade. Ele demonstra:

- modelagem e implementação de contratos HTTP;
- construção de APIs REST com Express;
- persistência e consultas parametrizadas em MySQL;
- separação de responsabilidades para melhorar testabilidade;
- testes de integração HTTP com dependências simuladas;
- testes funcionais de uma API e seu banco real;
- automação de qualidade em uma pipeline de integração contínua;
- análise de cenários positivos, negativos e falhas de infraestrutura.

## Autor

**Felipe Gabriel**

QA Engineer | Software Quality Engineering
