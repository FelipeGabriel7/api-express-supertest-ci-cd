# 🚀 REST API — Node.js + Express

Projeto desenvolvido como um desafio prático para consolidar fundamentos de desenvolvimento de APIs REST com **Node.js e Express**, evoluindo de um CRUD em memória para uma API com persistência em banco de dados e testes automatizados.

## 📌 Sobre o projeto

A aplicação consiste em uma API REST simples para gerenciamento de usuários.

O projeto começou utilizando um array em memória para armazenar os usuários e será evoluído para utilizar **MySQL** como banco de dados.

Além disso, serão implementados testes automatizados de API utilizando **SuperTest**.

## 🛠️ Stack

- Node.js
- Express
- JavaScript
- REST API
- MySQL _(em implementação)_
- SuperTest _(em implementação)_

## ✅ Implementado

- [x] Configuração do projeto Node.js
- [x] Express
- [x] Criação de rotas REST
- [x] CRUD de usuários em memória
- [x] `GET` — listar usuários
- [x] `GET` — buscar usuário por ID
- [x] `POST` — criar usuário
- [x] `PUT` — atualizar usuário
- [x] `DELETE` — excluir usuário
- [x] Uso de `req.params`
- [x] Uso de `req.body`
- [x] Middleware de autenticação básico
- [x] Status HTTP
- [x] Organização inicial entre rotas, controllers e middlewares

## 🚧 Em desenvolvimento

- [x] Integração com MySQL
- [x] Persistência dos usuários no banco de dados
- [x] Queries SQL parametrizadas
- [x] Tratamento de erros de banco de dados
- [ ] Testes automatizados com SuperTest
- [ ] Testes positivos e negativos das rotas
- [ ] Validação dos dados recebidos pela API

## 📚 Endpoints

### Health Check

```http
GET /health
```

Verifica se a API está funcionando.

### Listar usuários

```http
GET /users/list
```

### Buscar usuário

```http
GET /user/:id
```

Exemplo:

```http
GET /user/1
```

### Criar usuário

```http
POST /user/create
```

Body:

```json
{
  "name": "Felipe",
  "age": 30
}
```

### Atualizar usuário

```http
PUT /user/edit/:id
```

Body:

```json
{
  "name": "Felipe Gabriel",
  "age": 31
}
```

### Excluir usuário

```http
DELETE /user/:id
```

## 📂 Estrutura atual

```text
src/
├── controllers/
│   ├── health.js
│   └── users.js
│
├── middlewares/
│   └── AuthMiddleware.js
│
├── routes.js
│
└── ...
```

## 🎯 Objetivo do projeto

O objetivo deste projeto é servir como um laboratório prático para evolução dos conhecimentos em:

- Desenvolvimento de APIs REST
- Node.js e Express
- HTTP
- Middlewares
- CRUD
- SQL
- Persistência de dados
- Testes automatizados de API
- Boas práticas de desenvolvimento

A ideia é evoluir o projeto gradualmente, começando por uma implementação simples e posteriormente aplicando uma arquitetura mais estruturada.

## 🗺️ Roadmap

```text
[x] Node.js + Express
[x] Rotas
[x] CRUD em memória
[x] Controllers
[x] Middlewares
[x] MySQL
[x] CRUD com persistência
[ ] SuperTest
[ ] Testes automatizados
[ ] Validações
[ ] SuperTest
[ ] CI/CD com Github Actions
[x] Tratamento de erros
[x] Arquitetura mais estruturada
```

---

### 👨‍💻 Autor

**Felipe Gabriel**

QA Engineer | Software Quality Engineering
