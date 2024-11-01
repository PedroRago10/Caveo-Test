
# Projeto Backend API - Autenticação e Gerenciamento de Usuários

Este projeto consiste em uma API backend desenvolvida para um teste técnico para a empresa Caveo. A API permite autenticação e gerenciamento de usuários com integração ao AWS Cognito e uso de banco de dados PostgreSQL com TypeORM, utilizando o framework Koa.js.

## Sumário

- [Visão Geral do Projeto](#visão-geral-do-projeto)
- [Arquitetura e Estrutura do Projeto](#arquitetura-e-estrutura-do-projeto)
- [Dependências e Versões](#dependências-e-versões)
- [Instalação e Configuração](#instalação-e-configuração)
- [Configuração do AWS Cognito](#configuração-do-aws-cognito)
- [Uso do Docker](#uso-do-docker)
- [Regras de Negócio e Validações](#regras-de-negócio-e-validações)
- [Documentação das Rotas](#documentação-das-rotas)
- [Estrutura de Testes](#estrutura-de-testes)

---

## Visão Geral do Projeto

Esta API foi desenvolvida para operações comuns de autenticação e gerenciamento de perfis, utilizando AWS Cognito para segurança e autenticação e integrando-se a um banco de dados PostgreSQL via TypeORM. 

### Principais Funcionalidades

- Registro de usuários e autenticação via AWS Cognito.
- Atualização de perfis de usuário com controle de permissões.
- Listagem de usuários para administradores.
- Testes unitários com Jest e configuração via Docker.

---

## Arquitetura e Estrutura do Projeto

O projeto segue uma arquitetura modular com separação de responsabilidades para diferentes camadas:

- **/src**: Contém o código-fonte.
  - **/config**: Configurações gerais (ex: conexão com DB, integração Cognito).
  - **/controllers**: Controladores das rotas e lógica de negócios.
  - **/entities**: Definição das entidades para ORM.
  - **/middleware**: Middlewares personalizados (autenticação, autorização).
  - **/routes**: Configuração das rotas.
  - **/services**: Lógica de negócios, incluindo integração Cognito.
  - **/tests**: Testes unitários e de integração.

---

## Dependências e Versões

- **Node.js**: v20.16.0
- **Koa.js**: Framework da API.
- **TypeORM**: ORM para PostgreSQL.
- **PostgreSQL**: v14.
- **AWS Cognito SDK**: Integração com Cognito.
- **Jest**: v28 - Framework de testes.
- **Docker**: Configuração de ambiente.

---

## Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone <repo-url>
   cd nome-do-repositorio
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` na raiz com as seguintes variáveis:
   ```plaintext
   PORT=4000
   DATABASE_HOST=db
   DATABASE_PORT=5432
   DATABASE_USER=user
   DATABASE_PASSWORD=password
   DATABASE_NAME=caveo
   AWS_REGION=<REGIAO_AWS>
   AWS_USER_POOL_ID=<ID_DO_USER_POOL>
   AWS_CLIENT_ID=<ID_DO_CLIENT_APP>
   AWS_ACCESS_KEY_ID=<CHAVE_DE_ACESSO_AWS>
   AWS_SECRET_ACCESS_KEY=<CHAVE_SECRETA_AWS>
   ```

### Configuração do AWS Cognito

1. **Crie um User Pool** no AWS Cognito e configure os fluxos de autenticação:

   - **ALLOW_ADMIN_USER_PASSWORD_AUTH**
   - **ALLOW_CUSTOM_AUTH**
   - **ALLOW_REFRESH_TOKEN_AUTH**
   - **ALLOW_USER_PASSWORD_AUTH**
   - **ALLOW_USER_SRP_AUTH**

   Esses fluxos permitem autenticação personalizada, autenticação com senha e uso de tokens.

2. **Client Application**: Ao configurar o aplicativo cliente no Cognito, permita os fluxos de autenticação acima.

3. **Atributo Personalizado `role`**: Caso necessário, adicione um atributo personalizado chamado `custom:role` para definir a função do usuário (ex: admin, user). Configure-o como "mutável". Este atributo permite controle de permissões na API.

---

## Uso do Docker

1. Execute o Docker:
   ```bash
   docker-compose up --build
   ```

2. Acesse a API em `http://localhost:4000`.

---

## Regras de Negócio e Validações

### Autenticação e Registro

- **Critérios de Autenticação**: Tokens válidos emitidos pelo AWS Cognito.
- **Registro de Usuário**: Novos usuários são confirmados automaticamente e registrados no banco.

### Atualização de Perfil

- **Admin**: Pode editar campos como `role` e `name`.
- **Usuário**: Pode editar apenas o `name`.

---

## Documentação das Rotas

### Rota: /auth
- **Método**: POST
- **Descrição**: Autentica um usuário ou registra um novo.
- **Parâmetros**: `email`, `password`.

### Rota: /me
- **Método**: GET
- **Descrição**: Retorna os dados do usuário autenticado.

### Rota: /edit-account
- **Método**: PUT
- **Descrição**: Atualiza o perfil do usuário autenticado.
- **Permissões**: Admin pode editar `role`, `name`; Usuário comum apenas `name`.

### Rota: /users
- **Método**: GET
- **Descrição**: Lista todos os usuários.
- **Permissões**: Restrito a administradores.

---

## Estrutura de Testes

- **/tests/config** Testes de configuração.
- **/tests/controllers**  Testes de controladores.
- **/tests/middlewares** Testes de middleware.

### Comandos de Testes

- Executar todos os testes:
   ```bash
   npm run test
   ```


# Documentação com Postman

Para facilitar o entendimento e o teste das rotas da API, foi criada uma coleção no Postman chamada `Caveo Collections.postman_collection.json`. Essa coleção está localizada na pasta `/collection` na raiz do projeto e contém todos os endpoints da API com exemplos de requisições, explicações de cada rota, e scripts de testes específicos para validar a API.

## Como Importar a Coleção no Postman

1. Abra o Postman.
2. Clique em **Import** (no canto superior esquerdo).
3. Escolha a opção **File** e selecione o arquivo `Caveo Collections.postman_collection.json` da pasta `/collection`.
4. Clique em **Import** para adicionar a coleção ao seu workspace.

## Estrutura da Coleção

A coleção `Caveo Collections` contém:

- **Autenticação**: Inclui exemplos de requisições para a rota `/auth`, com parâmetros necessários para autenticação e registro de usuários.
- **Perfil do Usuário**: Rota `/me` para obter os dados do usuário autenticado, demonstrando o uso do token JWT.
- **Atualização de Perfil**: Rota `/edit-account`, com exemplos de edição de perfil e permissões para diferentes níveis de acesso.
- **Administração de Usuários**: Rota `/users` para listagem de usuários (exclusiva para administradores).

Cada rota contém exemplos de requisições HTTP (GET, POST, PUT) com os cabeçalhos e corpos necessários. A coleção ajuda a verificar rapidamente o comportamento da API e a validação dos requisitos de negócio.

## Scripts de Testes no Postman

Os scripts de testes no Postman foram configurados para garantir a consistência das respostas da API e o cumprimento das regras de negócio. Abaixo estão os scripts implementados em cada uma das principais rotas:

### Autenticação (`/auth`)

- **Testa a Autenticação com Credenciais Válidas**: Verifica se a resposta contém um token JWT ao fornecer credenciais corretas.
- **Testa Erro com Credenciais Inválidas**: Valida se o status de resposta é 401 quando credenciais inválidas são enviadas.
  
#### Script:
```javascript
pm.test("Token JWT está presente", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json()).to.have.property("token");
});

pm.test("Erro com credenciais inválidas", function () {
    pm.response.to.have.status(401);
});
```

### Perfil do Usuário (`/me`)

- **Verifica Dados do Usuário**: Confirma que a rota `/me` retorna os dados corretos do usuário autenticado.
  
#### Script:
```javascript
pm.test("Dados do usuário retornados com sucesso", function () {
    pm.response.to.have.status(200);
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("email");
    pm.expect(jsonData).to.have.property("role");
});
```

### Atualização de Perfil (`/edit-account`)

- **Valida Permissões de Atualização**: Verifica se o usuário comum pode alterar apenas o campo `name` e se o usuário administrador pode alterar `name` e `role`.
- **Erro para Tentativas Inválidas de Atualização**: Confirma que a API retorna erro apropriado (403) quando um usuário tenta modificar um campo para o qual não tem permissão.

#### Script:
```javascript
pm.test("Perfil atualizado com sucesso", function () {
    pm.response.to.have.status(200);
});

pm.test("Erro de permissão", function () {
    pm.response.to.have.status(403);
});
```

### Administração de Usuários (`/users`)

- **Valida Acesso Restrito**: Garante que somente administradores consigam acessar a listagem de usuários.
- **Testa Conteúdo da Listagem**: Confirma que a resposta contém um array de usuários com os campos esperados.

#### Script:
```javascript
pm.test("Acesso restrito para administradores", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json()).to.be.an("array");
});

pm.test("Erro para usuários sem permissão", function () {
    pm.response.to.have.status(403);
});
```

### Executando os Testes no Postman

1. Após importar a coleção, expanda a coleção `Caveo Collections` no Postman.
2. Selecione **Run** para iniciar a execução de todos os testes configurados.
3. Visualize os resultados dos testes em cada requisição para verificar o comportamento da API.

Esses scripts de testes no Postman permitem validar o fluxo de autenticação, permissões e regras de negócio de maneira automatizada e são úteis para garantir a integridade da API ao longo do desenvolvimento.

---
