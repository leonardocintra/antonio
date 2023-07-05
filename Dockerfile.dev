# Define a imagem base
FROM node:18

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o arquivo package.json para o diretório de trabalho
COPY package.json .

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos para o diretório de trabalho
COPY . .

# Expõe a porta em que a API estará rodando (certifique-se de configurar o NestJS para usar a mesma porta)
EXPOSE 3000

RUN npm build

# Define o comando de execução do contêiner
CMD [ "npm", "run", "start:prod" ]