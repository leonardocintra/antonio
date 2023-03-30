# Use a imagem base do Node.js Alpine é a mais leve
FROM node:alpine

# Crie e defina o diretório de trabalho dentro do container
WORKDIR /usr/app

# Copie o arquivo package.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todo o resto dos arquivos do projeto para dentro do container
COPY . .

# Exponha a porta que será usada pela aplicação
EXPOSE 3000

# Inicie a aplicação Node.js
CMD ["npm", "start"]
