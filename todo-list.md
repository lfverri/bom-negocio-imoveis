# ToDo List - Real State Management System

Este documento detalha o estado atual do projeto e as etapas necessárias para completar o backend e integrá-lo com o frontend.

## 📌 Visão Geral

O projeto utiliza **NestJS** no backend com **Prisma ORM** e **Next.js** no frontend.
Atualmente, o banco de dados está bem modelado, mas os módulos do backend são apenas esqueletos e o frontend está utilizando dados fictícios (mock).

---

## 🛠️ Padrões e Convenções

### Nomenclatura

- **Backend (API):** `camelCase` para propriedades de objetos e variáveis. `PascalCase` para classes e tipos.
- **Banco de Dados:** `snake_case` (mapeado via Prisma `@map`).
- **Frontend (TS Types):** Atualmente está em `snake_case`, mas deve ser migrado para **`camelCase`** para manter consistência direta com a API sem necessidade de transformadores complexos.

### Arquitetura Backend

- **Controller:** Gerenciamento de rotas e entrada/saída.
- **Service:** Lógica de negócio.
- **Repository:** Acesso direto ao Prisma (separação de preocupação).
- **DTOs:** Validação de entrada usando `class-validator`.

---

## 📋 Lista de Tarefas (Priorizado)

### 1. Infraestrutura e Global (Backend)

- [ ] Configurar um `BaseRepository` genérico para operações CRUD comuns (opcional, mas recomendado).
- [ ] Verificar e completar o `AuthModule` (Login, Registro, Recuperação de Senha).
- [ ] Implementar middleware ou interceptor para log de requisições.
- [ ] Validar o funcionamento do `HttpExceptionFilter`.

### 2. CRM - Leads (Backend)

- [ ] Implementar CRUD completo para `Leads`.
- [ ] Implementar histórico de status de leads (`LeadStatusHistory`).
- [ ] Implementar atividades de leads (`LeadActivity`).
- [ ] Adicionar filtros de busca (nome, status, origem).

### 3. Gestão de Pessoas (Backend)

- [ ] **Proprietários (Landlords):** CRUD completo, filtros e busca por CPF/CNPJ.
- [ ] **Inquilinos (Tenants):** CRUD completo, contatos de emergência e busca por CPF/CNPJ.
- [ ] **Usuários:** Gerenciamento de perfis e permissões (Roles).

### 4. Gestão de Imóveis (Backend)

- [ ] **Imóveis (Properties):** CRUD completo.
- [ ] Implementar upload de imagens para imóveis (integração com local storage ou S3).
- [ ] Filtros avançados (cidade, tipo, valor de aluguel, status).
- [ ] Relacionamento com `Landlord` (retornar nome do proprietário na listagem).

### 5. Contratos e Financeiro (Backend)

- [ ] **Contratos (Leases):** Geração de contratos, vinculação de Imóvel, Inquilino e Proprietário.
- [ ] **Pagamentos (Payments):** Geração automática de parcelas de aluguel.
- [ ] **Repasses (LandlordPayments):** Lógica de cálculo de comissão e repasse ao proprietário.
- [ ] Integração com Gateway de Boleto/Pix (ex: Asaas, Juno) - _opcional/futuro_.

### 6. Seguros, Vistorias e Documentos (Backend)

- [ ] **Seguros:** Controle de apólices e vencimentos.
- [ ] **Vistorias:** Registro de vistorias com fotos e itens de checklist.
- [ ] **Documentos:** Sistema de upload de documentos anexados a entidades (Leads, Imóveis, etc.).

---

## 🔗 Integração Frontend (Web)

### 🔄 Sincronização de Tipos

- [ ] Atualizar `web/lib/types.ts` para usar `camelCase`.
- [ ] Garantir que os Enums no frontend correspondam exatamente aos do Prisma.

### 🔌 API Client & Telas

- [ ] Remover lógica de "Mock data" nos blocos `catch` das páginas.
- [ ] Implementar paginação real no `DataTable` (o backend deve retornar `total` e `data`).
- [ ] Integrar formulários de criação/edição com a API (atualmente muitos são apenas UI).
- [ ] Implementar feedback de erro global (Toasts) para falhas na API.

---

## 🚀 Como Proceder

1. **Passo 1:** Começar pelo módulo de `Properties` no backend, implementando o CRUD real no `PropertiesRepository` e `PropertiesService`.
2. **Passo 2:** Atualizar a página de listagem de imóveis no frontend para consumir esses dados reais e remover os mocks.
3. **Passo 3:** Seguir o mesmo fluxo para `Tenants` e `Landlords`, que são dependências para o módulo de `Leases`.
4. **Passo 4:** Implementar a lógica de `Leases` que é o coração do sistema.

## 🛠️ Comandos Úteis

- Backend: `npm run start:dev`
- Frontend: `npm run dev`
- Prisma: `npx prisma generate` | `npx prisma studio`
