import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoa/pessoa.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  // TODO: pegar parametros da .env que não esta funcionano aqui
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'catarina-pwd',
  database: 'catarinadb',
  entities: [Pessoa],
  synchronize: true,
};
