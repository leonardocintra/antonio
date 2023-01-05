import { Module } from '@nestjs/common';
import { PessoaEnderecoService } from './pessoa-endereco.service';
import { PessoaEnderecoController } from './pessoa-endereco.controller';
import { PessoaModule } from '../pessoa/pessoa.module';
import { EnderecoModule } from '../endereco/endereco.module';

@Module({
  imports: [EnderecoModule, PessoaModule],
  providers: [PessoaEnderecoService],
  controllers: [PessoaEnderecoController],
})
export class PessoaEnderecoModule {}
