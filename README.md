
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

- **Jest** para testes unitários e de integração.

### Comandos de Testes

- Executar todos os testes:
   ```bash
   npm run test
   ```

---
