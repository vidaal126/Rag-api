#!/bin/sh
set -e

echo "Instalando/atualizando dependências..."
yarn install

echo "Gerando Prisma client..."
npx prisma generate

echo "Executando migrations..."
npx prisma migrate deploy

echo "Iniciando servidor de desenvolvimento..."
exec yarn start:dev
