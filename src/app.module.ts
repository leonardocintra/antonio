import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { DataSource } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Endereco } from './entities/endereco.entity';
import { UsuariosModule } from './usuarios/usuarios.module';
import { Usuario } from './entities/usuario.entity';
import { Telefone } from './entities/telefone.entity';
import { CatalogsModule } from './catalogs/catalogs.module';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Variation } from './entities/variation.entity';
import { FirmsModule } from './firms/firms.module';
import { Firm } from './entities/firm.entity';
import { VariationValue } from './entities/variation-value.entity';
import { ProductVariation } from './entities/product-variation.entity';

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
            VariationValue,
            ProductVariation,
          ],
          synchronize: true,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
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
