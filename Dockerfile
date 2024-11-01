# Utilizar uma imagem Node.js como base
FROM node:18

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar o package.json e o package-lock.json para instalar as dependências
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código para o diretório de trabalho
COPY . .

# Expor a porta em que o KoaJS está rodando
EXPOSE 4000

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]