# Design: testes de contrato HTTP com Jest e Supertest

## Contexto

A API Express gerencia usuários com persistência em MySQL. Atualmente, `src/index.js` cria o aplicativo, conecta ao banco e abre a porta HTTP no mesmo módulo. O projeto possui testes da configuração de ambiente escritos com `node:test`, mas ainda não utiliza Jest nem Supertest.

Os testes manuais no Postman continuarão exercitando a aplicação iniciada com o MySQL real. A primeira suíte automatizada terá outro propósito: validar de forma rápida e determinística o contrato HTTP existente para posteriormente ser executada em integração contínua com GitHub Actions.

## Objetivos

- Aprender Jest e Supertest por meio de exercícios incrementais.
- Validar rotas, status HTTP, headers e corpos JSON da API.
- Validar a passagem de parâmetros, body e autorização até a camada de aplicação.
- Simular o `UserModel` para não depender de banco, porta ou estado externo.
- Produzir uma suíte adequada para execução futura com `npm test` no GitHub Actions.

## Fora do escopo

- Validar queries ou integração real com MySQL.
- Criar ou configurar o workflow do GitHub Actions nesta etapa.
- Adicionar regras de validação para nome, idade ou identificadores neste primeiro ciclo de aprendizagem.
- Automatizar a coleção do Postman.

## Arquitetura

Será criado `src/app.js`, responsável por construir e exportar a aplicação Express com `express.json()` e as rotas. `src/index.js` ficará responsável somente pela inicialização do banco e pela chamada de `app.listen()`.

Os testes importarão `app.js` com o Supertest. Dessa maneira, cada requisição será processada em memória, sem abrir a porta 3001. Jest substituirá os métodos do `UserModel` por mocks controlados em cada cenário.

Fluxo dos testes:

```text
Jest -> Supertest -> Express -> rota/middleware/controller -> UserModel simulado
```

## Organização da suíte

- Testes de configuração: migrar `src/tests/config/env.test.js` de `node:test` para Jest.
- Teste de saúde: contrato de `GET /health`.
- Testes de autenticação: interrupção das rotas protegidas sem o header `Authorization`.
- Testes de usuários: contratos positivos, recursos inexistentes e falhas simuladas do model.
- Limpeza: restaurar ou limpar os mocks entre testes para impedir vazamento de estado.

## Matriz de contrato

| Endpoint | Cenários automatizados |
| --- | --- |
| `GET /health` | `200`, conteúdo JSON e mensagem esperada |
| `GET /users/list` | lista com `200`; rejeição do model com `500` |
| `GET /user/:id` | usuário com `200`; inexistente com `404`; rejeição do model com `500` |
| Rotas protegidas | ausência de autorização com `401`; model não chamado |
| `POST /user/create` | criação com `201`; rejeição do model com `500` |
| `PUT /user/edit/:id` | atualização com `200`; inexistente com `404`; rejeição do model com `500` |
| `DELETE /user/:id` | exclusão com `204` e corpo vazio; inexistente com `404`; rejeição do model com `500` |

Cada teste verificará somente os elementos relevantes para o contrato do cenário: status, tipo de conteúdo e corpo. A interação com o model será observada apenas quando necessário para demonstrar que a entrada HTTP foi mapeada corretamente ou que o middleware interrompeu a requisição. Queries e outros detalhes internos do model não serão testados nesta suíte.

## Dependências e comandos

Jest e Supertest serão dependências de desenvolvimento. Os scripts do `package.json` disponibilizarão:

- `npm test`: execução completa e não interativa;
- `npm run test:watch`: execução durante o desenvolvimento;
- `npm run test:coverage`: relatório de cobertura.

O comando padrão não dependerá de serviços externos e poderá ser reutilizado no GitHub Actions.

## Tratamento dos cenários de erro

Os mocks poderão resolver com dados, resolver sem recurso ou rejeitar com erro. Isso permitirá alcançar os contratos `200`/`201`/`204`, `404` e `500` sem provocar erros reais no MySQL. Como os controllers atualmente registram falhas com `console.error`, os testes de erro silenciarão esse método apenas durante o cenário necessário e o restaurarão depois.

As respostas existentes serão testadas como são hoje, inclusive quando o corpo JSON for uma string. Uma futura padronização para objetos de erro será tratada como mudança de contrato e terá seus próprios testes.

## Método de aprendizagem

O trabalho avançará em ciclos curtos. Em cada ciclo, o professor apresenta o objetivo e os conceitos; o aluno escreve o teste; ambos executam e interpretam o resultado; depois o código é revisado antes do próximo cenário.

Ordem dos exercícios:

1. Instalar e configurar Jest e Supertest.
2. Separar a aplicação da inicialização do servidor.
3. Migrar o teste de ambiente para Jest.
4. Escrever o teste de saúde.
5. Testar o middleware de autorização.
6. Testar os contratos positivos do CRUD.
7. Adicionar recursos inexistentes e falhas do model.
8. Executar a suíte completa e o relatório de cobertura.

## Próximos ciclos do roadmap

Após concluir o aprendizado inicial de Supertest, o projeto continuará nesta ordem:

1. Definir o contrato de validação dos dados recebidos pela API.
2. Implementar as validações guiadas por testes positivos e negativos.
3. Configurar o GitHub Actions para executar a suíte a cada alteração.

Essa separação preserva os três itens do roadmap do projeto — testes automatizados com Supertest, cenários positivos e negativos e validação de dados — sem misturar o aprendizado inicial da ferramenta com uma mudança de comportamento da API.

## Critérios de conclusão

- Todos os endpoints atuais possuem os cenários definidos na matriz.
- A suíte passa sem abrir uma porta ou conectar ao MySQL.
- Os testes são independentes e podem ser executados em qualquer ordem.
- `npm test` encerra com código zero quando todos os contratos são atendidos.
- O aluno consegue explicar o padrão Arrange, Act, Assert e criar um novo teste de rota seguindo a estrutura praticada.
