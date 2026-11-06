# CRUD simples com Fastify, TypeScript, Prisma e SQLite

Base de uma API para praticar as operações de CRUD de usuários com Node.js e TypeScript.

## Estado atual da base

A infraestrutura inicial da aplicação está pronta:

- servidor HTTP funcionando com Fastify;
- TypeScript configurado em modo estrito;
- execução automática durante o desenvolvimento;
- compilação para JavaScript;
- Prisma ORM 7 configurado;
- banco SQLite criado por migração;
- Prisma Client gerado e conectado à aplicação;
- logger do Fastify habilitado;
- rota de saúde da API;
- rota para listar usuários sem expor o campo `senha`;
- repositório Git isolado e arquivos locais ignorados.

Essa é a base necessária para começar a implementar as demais operações do CRUD. Bibliotecas específicas para recursos futuros, como hash de senha, validação avançada e testes, ainda serão escolhidas e instaladas quando esses recursos forem desenvolvidos.

## Requisitos do ambiente

| Ferramenta | Versão usada | Finalidade |
| --- | --- | --- |
| Node.js | 24.22.2 LTS | Executar a aplicação e o JavaScript compilado. |
| npm | 11.19.1 | Instalar dependências e executar os scripts do projeto. |
| Git | versão instalada no sistema | Versionar o código e registrar sua evolução. |

No PowerShell deste computador, os comandos do npm são executados com `npm.cmd`, pois a política de execução bloqueia o arquivo `npm.ps1`.

## Tecnologias e dependências

### Aplicação

| Pacote | Finalidade |
| --- | --- |
| `fastify` | Framework HTTP usado para criar o servidor, as rotas e as respostas da API. |
| `@prisma/client` | API tipada usada pelo código para consultar e modificar os dados. |
| `@prisma/adapter-better-sqlite3` | Adaptador que conecta o Prisma Client ao driver do SQLite. |
| `better-sqlite3` | Driver que realiza a comunicação com o arquivo do banco SQLite. |
| `dotenv` | Carrega variáveis do arquivo `.env` em `process.env`. |

### Desenvolvimento

| Pacote | Finalidade |
| --- | --- |
| `typescript` | Verifica os tipos e compila arquivos `.ts` para JavaScript. |
| `tsx` | Executa TypeScript no desenvolvimento e reinicia o servidor ao salvar alterações. |
| `@types/node` | Fornece ao TypeScript os tipos das APIs do Node.js. |
| `prisma` | CLI usada para validar o schema, criar migrações e gerar o Prisma Client. |
| `@types/better-sqlite3` | Fornece os tipos TypeScript do driver `better-sqlite3`. |

## Configurações principais

### ES Modules

O `package.json` contém:

```json
"type": "module"
```

Isso permite usar a sintaxe moderna de módulos:

```ts
import Fastify from "fastify";
export const exemplo = true;
```

### TypeScript

O `tsconfig.json` configura, entre outros itens:

- `src/` como diretório do código-fonte;
- `dist/` como diretório do JavaScript compilado;
- `NodeNext` para integração com os módulos do Node.js;
- `ES2023` como alvo da compilação;
- modo estrito de verificação de tipos;
- tipos do Node.js;
- source maps para relacionar erros do JavaScript ao TypeScript original.

### Variáveis de ambiente

O arquivo `.env` contém a variável que indica a localização do SQLite:

```env
DATABASE_URL="file:./dev.db"
```

O `.env` não é versionado. No futuro, um `.env.example` poderá documentar as variáveis necessárias sem expor valores privados.

## Banco de dados

### SQLite

O SQLite foi escolhido porque armazena o banco em um arquivo local e não exige a instalação de um servidor de banco separado. O arquivo `dev.db` é local e não é versionado.

### Prisma ORM

O Prisma relaciona o código TypeScript ao banco:

```text
Rota Fastify
    -> Prisma Client
    -> adaptador better-sqlite3
    -> driver better-sqlite3
    -> arquivo SQLite
```

Arquivos importantes:

| Arquivo ou pasta | Finalidade |
| --- | --- |
| `prisma/schema.prisma` | Define os modelos e campos do banco. |
| `prisma7.config.ts` | Configura o schema, as migrações e a URL do banco para o Prisma CLI. |
| `prisma/migrations/` | Guarda o histórico SQL versionado das alterações do banco. |
| `src/generated/prisma/` | Contém o Prisma Client gerado; pode ser recriado e não é versionado. |
| `src/lib/prisma.ts` | Cria e exporta uma única instância reutilizável do Prisma Client. |

### Modelo atual

O model `User` possui:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | inteiro | Chave primária com incremento automático. |
| `name` | texto | Obrigatório. |
| `senha` | texto | Obrigatório; deverá receber apenas um hash, nunca a senha original. |
| `email` | texto | Obrigatório e único. |
| `createdAt` | data e hora | Preenchido automaticamente na criação. |
| `updatedAt` | data e hora | Atualizado automaticamente pelo Prisma. |

A migração inicial cria a tabela `User` e um índice único para `email`.

## Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm.cmd run dev` | Executa `src/server.ts` com recarregamento automático. |
| `npm.cmd run build` | Compila o TypeScript para a pasta `dist/`. |
| `npm.cmd start` | Executa a versão compilada em `dist/server.js`. |
| `npx.cmd tsc --noEmit` | Verifica os tipos sem gerar JavaScript. |
| `npx.cmd prisma format` | Formata o `schema.prisma`. |
| `npx.cmd prisma validate` | Valida o schema e a configuração do Prisma. |
| `npx.cmd prisma migrate dev --name <nome>` | Cria e aplica uma migração no banco de desenvolvimento. |
| `npx.cmd prisma generate` | Gera novamente o Prisma Client após mudanças no schema. |
| `npx.cmd prisma migrate status` | Mostra o estado das migrações. |

## Rotas disponíveis

### Verificar a API

```http
GET /
```

Resposta:

```json
{
  "message": "API funcionando"
}
```

### Listar usuários

```http
GET /users
```

Retorna os usuários em ordem crescente de `id`. A consulta seleciona explicitamente os campos públicos e não devolve `senha`.

Enquanto o banco estiver vazio, a resposta será:

```json
[]
```

## Estrutura principal

```text
.
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── generated/prisma/
│   ├── lib/prisma.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── prisma7.config.ts
└── tsconfig.json
```

## Arquivos que não são versionados

O `.gitignore` exclui:

- `node_modules/`, pois as dependências podem ser reinstaladas;
- `dist/`, pois o JavaScript pode ser recompilado;
- `.env`, pois pode conter configurações privadas;
- `src/generated/prisma/`, pois o Client pode ser gerado novamente;
- arquivos `*.db` e auxiliares, pois representam o banco local;
- configurações locais de assistentes de código.

## O que ainda será implementado

A base está pronta, mas o CRUD completo ainda não. As próximas funcionalidades serão:

- criar usuário (`POST /users`);
- buscar usuário por ID (`GET /users/:id`);
- atualizar usuário (`PUT` ou `PATCH /users/:id`);
- excluir usuário (`DELETE /users/:id`);
- validar os dados recebidos;
- gerar hash seguro da senha;
- tratar erros como e-mail duplicado e usuário inexistente;
- adicionar testes.

> Senhas nunca devem ser armazenadas ou retornadas em texto puro. A rota de criação só será implementada depois que o mecanismo de hash estiver configurado.
