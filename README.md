# Tarefa Backend Caveo

## Objetivo

Nesta tarefa, o candidato deverá configurar um projeto backend utilizando Node.js e integrar a aplicação com AWS Cognito para controlar a autorização de rotas. A tarefa inclui a configuração de um banco de dados com PostgreSQL, o uso do ORM TypeORM, e a inicialização do ambiente de desenvolvimento com Docker Compose.

## Requisitos

1. **Inicialização do Repositório**
   - Configure um novo repositório Node.js.
   - Utilize o framework **KoaJS**.
   - Adicione **TypeORM** para gerenciar o banco de dados.
   - Utilize **PostgreSQL** como banco de dados relacional.
   - Utilize **Typescript**.

2. **Tabelas**
   - Deverá ser criada uma tabela com o nome de `User`, com os seguintes campos: name, email, role, isOnboarded, createdAt, deletedAt, updatedAt.

3. **Configuração com Docker Compose**
   - Configure um arquivo `docker-compose.yml` para inicializar a API e o banco de dados PostgreSQL.
   - Certifique-se de que o ambiente esteja isolado e fácil de replicar.

4. **Integração com AWS Cognito**
   - Crie uma conta AWS, se necessário.
   - Configure um User Pool no AWS Cognito.
   - Integre a API com AWS Cognito para autenticação de usuários.

5. **Middleware de Autorização**
   - Desenvolva um middleware em KoaJS para controlar a autorização das rotas.
   - O middleware deve bloquear o acesso de usuários não autenticados.
   - Integre a verificação do JWT gerado pelo Cognito para proteger as rotas.

6. **Escopos e Permissões**
   - Crie diferentes escopos de usuário (por exemplo, `admin`, `usuário`) no cognito.
   - Configure permissões específicas para cada escopo, garantindo que apenas usuários com as permissões corretas possam acessar determinadas rotas.

7. **Criação de rotas**
   - Deve ser criadas rotas de /auth, /me, /edit-account e /users
   - A rota `/auth` deverá ser pública, a rota /me e /edit-account devem ser protegidas pelo JWT retornado pelo Cognito
   - A rota `/auth` servirá como um signInOrRegister, onde deverá verificar se o usuário já existe, senão criar em nosso banco de dados.
   - Para a rota `/edit-account` os usuários com escopo de admin, poderão alterar as informações de nome e role, enquanto os usuários com escopo de usuário somente poderão alterar o seu nome, após alterar o nome, a flag de isOnboarded deve ser modificada para true.
   - A rota `/users` deverá ser protegida e somente os usuários com escopo de admin poderão acessa-lá, essa rota retornara todos os usuários cadastrados em nosso banco.

8. **Documentação**
   - Utilize Postman ou Swagger para a documentação das rotas e funcionalidades.
   - Exemplifique os requests que serão executados na plataforma.
   - Utilize commits pequenos e de claro entendimento.

**Diferenciais**
- Testes unitários e E2E
- Postman com rotas de testes
- Flow no Postman com testes aplicados
- Env com variáveis de ambiente encriptadas
- Aplicação funcional com link na AWS
- Padrões de desenvolvimento aplicados (Camel Case, Snake Case, linter, etc)

## Referências

- [Documentação do Docker](https://docs.docker.com/)
- [Documentação do KoaJS](https://koajs.com/)
- [Documentação do TypeORM](https://typeorm.io/)
