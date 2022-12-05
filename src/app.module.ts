import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { DataSource } from 'typeorm';
import { Pessoa } from './pessoa/entity/pessoa.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // TODO: pegar parametros da .env que não esta funcionano aqui
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 3306)),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'catarina-pwd'),
        database: configService.get('DB_DATABASE', 'catarinadb'),
        entities: [Pessoa],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    PessoaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
