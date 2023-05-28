import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { DataSource } from 'typeorm';
import { Pessoa } from './pessoa/entities/pessoa.entity';
import { Endereco } from './pessoa/endereco/entities/endereco.entity';
import { UsuariosModule } from './usuarios/usuarios.module';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Telefone } from './pessoa/telefone/entities/telefone.entity';
import { CatalogsModule } from './catalogs/catalogs.module';
import { Category } from './catalogs/categories/entities/category.entity';
import { Product } from './catalogs/products/entities/product.entity';
import { Variation } from './catalogs/variations/entities/variation.entity';
import { VariationsValue } from './catalogs/variations/entities/variations-value.entity';
import { FirmsModule } from './firms/firms.module';
import { Firm } from './firms/entities/firm.entity';

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
          logging: false,
          entities: [
            Usuario,
            Pessoa,
            Endereco,
            Firm,
            Telefone,
            Category,
            Product,
            Variation,
            VariationsValue,
          ],
          synchronize: true,
        } as TypeOrmModuleAsyncOptions),
    }),
    AuthModule,
    UsuariosModule,
    PessoaModule,
    CatalogsModule,
    FirmsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
