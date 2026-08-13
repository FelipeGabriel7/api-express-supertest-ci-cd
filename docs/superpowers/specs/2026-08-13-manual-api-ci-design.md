# Design: CI manual de testes da API

## Contexto

O projeto possui duas suítes complementares. Jest e Supertest validam o contrato HTTP com o `UserModel` simulado, sem banco ou servidor permanente. A collection do Postman valida o fluxo funcional contra a API iniciada e um banco MySQL real.

A collection atual depende de IDs fixos (`8` e `19`), executa o DELETE antes do UPDATE e espera dados preexistentes na listagem. Essas condições impedem uma execução confiável em um banco vazio de integração contínua.

## Objetivos

- Executar a CI somente por acionamento manual no GitHub Actions.
- Executar todos os testes Jest e Supertest com `npm test`.
- Subir uma instância MySQL temporária e iniciar a API real.
- Executar a collection por linha de comando com Newman.
- Criar, reutilizar e excluir um usuário dinamicamente em cada iteração da collection.
- Não depender de IDs ou registros existentes antes da execução.
- Encerrar os recursos do teste mesmo quando houver falha.

## Fora do escopo

- Deploy contínuo.
- Gatilhos automáticos em `push` ou `pull_request`.
- Persistência do banco após o job.
- Automação das validações de entrada ainda não implementadas na API.

## Ciclo da collection

A collection será reordenada para formar um único ciclo funcional:

```text
Health -> Create -> Search -> Update -> List -> Delete
```

### Preparação da iteração

O pre-request script de `Create User` removerá qualquer valor anterior de `id_user`. A requisição criará um usuário com nome dinâmico e idade válida.

Após a resposta, os testes validarão status `201`, tipos e propriedades do contrato. O `id` retornado será salvo em uma variável da collection:

```javascript
pm.collectionVariables.set("id_user", responseJson.id);
```

### Uso do recurso dinâmico

As requisições seguintes usarão `{{id_user}}`:

- `GET /user/{{id_user}}` buscará o registro recém-criado.
- `PUT /user/edit/{{id_user}}` atualizará o mesmo registro.
- `GET /users/list` verificará que a lista contém esse ID.
- `DELETE /user/{{id_user}}` excluirá o registro.

As asserções de Search e Update compararão o ID retornado com `Number(pm.collectionVariables.get("id_user"))`, evitando comparação com um literal fixo.

### Limpeza da iteração

DELETE será a última requisição. Ela validará o status `204` e removerá `id_user` da collection. O Newman continuará executando a collection até o cleanup quando uma asserção intermediária falhar, pois a CI não habilitará a opção `--bail`.

Se a API ficar indisponível e o DELETE não puder ser executado, o banco roda em um container temporário e será destruído ao final do job. Assim, nenhuma execução deixa dados persistentes para a próxima.

## Workflow do GitHub Actions

O workflow ficará em `.github/workflows/api-tests.yml` e terá somente:

```yaml
on:
  workflow_dispatch:
```

O job usará Ubuntu, Node.js 24 e um serviço MySQL 8.0. A sequência será:

1. Obter o código com `actions/checkout@v6`.
2. Configurar Node.js 24 e cache npm com `actions/setup-node@v6`.
3. Instalar exatamente o lockfile com `npm ci`.
4. Executar Jest e Supertest com `npm test`.
5. Preparar no MySQL um usuário compatível com o driver `mysql` atual da aplicação.
6. Iniciar `node src/index.js` em background com variáveis de banco exclusivas do job.
7. Consultar `/health` até a API ficar disponível ou encerrar com erro e exibir o log.
8. Executar Newman contra `http://127.0.0.1:3001`.
9. Em uma etapa `if: always()`, encerrar o processo da API e exibir seu log.

O MySQL terá health check próprio antes do início dos steps. Nenhum segredo de produção será usado; credenciais descartáveis existirão somente durante o job.

## Integração do Newman

Newman será instalado como `devDependency`, garantindo versão reproduzível pelo lockfile. O `package.json` terá um script `test:postman` que executa `postman/api_collection.json` e fornece `BASE_LOCAL_URL` via linha de comando.

A saída padrão do Newman será preservada no log do GitHub Actions. Qualquer asserção Postman com falha fará o comando retornar código diferente de zero e marcará o job como falho, depois de a collection terminar seu cleanup.

## Tratamento de falhas

- Falha em Jest/Supertest impede a inicialização da API funcional.
- Falha na inicialização do MySQL ou da API interrompe os testes Postman com log diagnóstico.
- Falha em uma asserção Postman não impede o DELETE final, pois `--bail` não será usado.
- A etapa final encerra a API independentemente do resultado.
- O container MySQL é descartado automaticamente pelo GitHub Actions.

## Critérios de conclusão

- A collection não contém ID literal nas rotas Search, Update ou Delete.
- Cada iteração cria um usuário, usa seu ID em todo o fluxo e o exclui ao final.
- A collection pode rodar contra um banco vazio.
- `npm test` passa localmente sem MySQL.
- O workflow aparece com o botão `Run workflow` e não roda automaticamente.
- Uma execução manual bem-sucedida passa por Jest/Supertest e Newman.
- Uma falha em qualquer suíte marca o job como falho e ainda executa a limpeza de recursos.
