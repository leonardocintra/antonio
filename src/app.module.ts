import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { DataSource } from 'typeorm';
import { Pessoa } from './pessoa/entities/pessoa.entity';
import { EnderecoModule } from './endereco/endereco.module';
import { Endereco } from './endereco/entity/endereco.entity';
import { TelefoneModule } from './telefone/telefone.module';
import { Telefone } from './telefone/entity/telefone.entity';
import { PessoaEnderecoModule } from './pessoa-endereco/pessoa-endereco.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { Usuario } from './usuarios/entities/usuario.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT')),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [Usuario, Pessoa, Endereco, Telefone],
          synchronize: true,
        } as TypeOrmModuleAsyncOptions),
    }),
    AuthModule,
    UsuariosModule,
    PessoaModule,
    EnderecoModule,
    TelefoneModule,
    PessoaEnderecoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
