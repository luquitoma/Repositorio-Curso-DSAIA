# Harmonia Instrumentos

Loja virtual de instrumentos com catálogo por categoria, contas de clientes, painel
administrativo e compras totalmente fictícias.

## Executar localmente

1. Instale Node.js 20+ e MySQL 8+.
2. Instale as dependências:

   ```powershell
   npm.cmd install
   ```

3. Crie o banco e o catálogo inicial:

   ```powershell
   mysql -u root -p < database/schema.sql
   ```

4. Copie `.env.example` para `.env` e ajuste as credenciais do MySQL.
5. Inicie:

   ```powershell
   npm.cmd start
   ```

6. Abra `http://localhost:3000`.

Para criar o primeiro administrador, cadastre uma conta e promova-a diretamente no banco:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

O painel administrativo fica disponível em `#/admin`. O sandbox gera apenas saldo
demonstrativo; não existe pagamento, saque, conversão ou entrega real.

## Qualidade

```powershell
npm.cmd test
```

O projeto segue a constituição em `.specify/memory/constitution.md`: módulos por domínio
em `src/features/`, componentes visuais separados de serviços e nenhuma biblioteca externa
de UI ou gerenciamento de estado.
