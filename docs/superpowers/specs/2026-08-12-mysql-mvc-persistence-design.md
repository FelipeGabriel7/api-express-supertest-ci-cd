# MySQL MVC Persistence Design

## Objetivo

Migrar todo o CRUD de usuários do armazenamento em memória para MySQL, mantendo uma arquitetura iniciante com Database, Model e Controller.

## Escopo

- Persistir criação, listagem, busca, atualização e exclusão de usuários.
- Manter os endpoints atuais.
- Usar o pacote `mysql` já instalado.
- Usar Promises no Model e `async/await` nos Controllers.
- Usar queries parametrizadas.
- Criar a tabela automaticamente na inicialização.
- Deixar validações avançadas, tratamento centralizado e novos testes para o próximo estudo.

## Estrutura

```text
src/
├── config/env.js
├── database/database.js
├── models/UserModel.js
├── controllers/users.js
├── routes.js
└── index.js
```

- `env.js`: carrega o `.env`, valida as variáveis e produz a configuração MySQL.
- `database.js`: cria uma única conexão e garante a tabela `users`.
- `UserModel.js`: executa as queries e retorna Promises.
- `users.js`: recebe `req`, chama o Model e envia `res`.
- `routes.js`: associa endpoints aos Controllers.
- `index.js`: inicializa o banco antes de abrir a porta HTTP.

## Tabela `users`

| Coluna | Definição |
|---|---|
| `id` | inteiro positivo, chave primária e auto incremento |
| `name` | `VARCHAR(100)` obrigatório |
| `age` | inteiro positivo obrigatório |
| `created_at` | timestamp preenchido na criação |
| `updated_at` | timestamp atualizado nas alterações |

A criação usará `CREATE TABLE IF NOT EXISTS`, preservando tabela e dados existentes após reinicializações.

## Contrato do Model

| Método | Resultado |
|---|---|
| `findAll()` | array de usuários |
| `findById(id)` | usuário ou `undefined` |
| `create(name, age)` | usuário criado |
| `update(id, name, age)` | usuário atualizado ou `undefined` |
| `remove(id)` | `true` quando remove, `false` quando não encontra |

As queries usarão placeholders `?`, sem concatenar valores recebidos pela API.

## Controllers e HTTP

- Criação: `201`.
- Leituras e atualização: `200`.
- Usuário ausente: `404`.
- Exclusão bem-sucedida: `204`.
- Erro inesperado de banco: `500`, com `try/catch` local por enquanto.

## Fluxo de inicialização

```text
.env → configuração → conexão MySQL → criação da tabela → app.listen()
```

Se a conexão ou criação da tabela falhar, o servidor HTTP não deve iniciar.

## Verificação de hoje

1. Iniciar a API com o MySQL disponível.
2. Exercitar os cinco endpoints.
3. Reiniciar a API.
4. Confirmar que os usuários persistiram.

## Fora do escopo

- Service, Repository, DTO ou Clean Architecture.
- ORM e migrations.
- Validações completas de corpo e parâmetros.
- Tratamento centralizado de erros.
- Novos testes automatizados.
