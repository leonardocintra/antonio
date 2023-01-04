# Catarina API
API de dados pessoais
- Dados pessoas
- Dados endereco
- Dados telefone


## Description

Não precisem mais criar tabela de clientes, empresas, endereço, telefones, etc em seus sitemas. Use o Catarina-API

## Installation

```bash
$ npm install
$ docker run --name catarina-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=catarina-pwd -d mysql
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
- Website - [https://www.likeestampa.com.br](https://www.likeestampa.com.br)
- Twitter - [@leonardoncintra](https://twitter.com/leonardoncintra)

## License

Nest is [MIT licensed](LICENSE).
