# Catarina API

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/08da26fbb0574c04933646f9735614fa)](https://app.codacy.com/gh/leonardocintra/catarina/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

## ERPzinho

### Pessoas / Clientes / Empresas

API de dados pessoais criptografados (LGPD)

- Dados pessoas
- Dados endereco
- Dados telefone

### Produtos / SKU / Catalogo

- Dados de produtos
- Categorias
- SKU
- Variações (P, M, G, GG, ect)
- Controle de estoque

## Validações

- Valida se o endereço/CEP esta correto consultando a api do ViaCEP

![santa-Caterina-e-il-Dialogo](https://user-images.githubusercontent.com/5832193/230446119-01e5e763-3e6e-4223-8c13-b9629fa7e9f7.jpg)

## Descrição

Liberte-se da complexidade do gerenciamento de cadastros e dados pessoais em seus sistemas.

### Conheca o Catarina API - nosso sistema backend:

- Atende aos requisitos da lei LGPD
- Oferece uma solução segura e eficiente para que você possa se concentrar no desenvolvimento do seu negócio.
- Salve apenas um campo que ache necessario (Ex: id, email, cpf ou CNPJ) no seu banco de dados.

## Installation

```bash
$ npm install
$ docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql
$ docker run -d --name=grafana -p 3333:3333 grafana/grafana

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Documentação

http://localhost:3000/api

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - Leonardo Cintra
- API Backend - https://catarina-production.up.railway.app/api
- Twitter - [@leonardoncintra](https://twitter.com/leonardoncintra)

## License

Nest is [MIT licensed](LICENSE).
