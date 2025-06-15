# Schema Prisma para SaludoCare Manager

Este diretório contém o schema do Prisma ORM para o projeto SaludoCare Manager, definindo o modelo de dados para todas as entidades principais do sistema.

## Sobre o Prisma

[Prisma](https://www.prisma.io/) é um ORM (Object-Relational Mapping) moderno para Node.js e TypeScript que simplifica o acesso a bancos de dados. Ele proporciona:

- Schema declarativo e tipado
- Migrações de banco de dados seguras
- Cliente TypeScript com tipos gerados automaticamente
- Validação de dados em tempo de compilação

## Estrutura do Schema

O schema inclui todos os principais modelos de dados necessários para o sistema SaludoCare Manager:

### Usuários e Autenticação
- `User`: Profissionais do sistema (médicos, enfermeiros, recepcionistas, etc.)
- `UserRole`: Enum para os diferentes papéis de usuário

### Pacientes
- `Patient`: Informações completas dos pacientes
- `Allergy`: Alergias registradas para pacientes
- `Medication`: Medicações em uso pelos pacientes
- `HealthCondition`: Condições de saúde dos pacientes
- `Document`: Documentos e arquivos relacionados aos pacientes

### Agendamento e Consultas
- `Appointment`: Agendamentos de consultas
- `Consultation`: Registro de consultas realizadas
- `StaffSchedule`: Horários de disponibilidade dos profissionais

### Registros Médicos e de Enfermagem
- `MedicalRecord`: Prontuário médico
- `NursingRecord`: Registros de procedimentos de enfermagem

### Exames
- `ExamRequest`: Solicitações de exames
- `ExamResult`: Resultados de exames

### Internação
- `Hospitalization`: Registros de internação
- `Bed`: Leitos disponíveis
- `Ward`: Alas/setores do estabelecimento

### Sistema
- `SystemSettings`: Configurações do sistema
- `AuditLog`: Logs de auditoria para segurança e compliance

## Integrando com o Projeto Atual

Este schema Prisma pode ser integrado com o projeto atual que utiliza Supabase. Existem duas abordagens principais:

### 1. Substituição Completa

Substituir o Supabase pelo Prisma como ORM principal:

1. Instalar o Prisma:
   ```
   npm install prisma @prisma/client
   ```

2. Inicializar o Prisma:
   ```
   npx prisma init
   ```

3. Configurar a URL do banco de dados no arquivo `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/saludocare?schema=public"
   ```

4. Gerar a primeira migração:
   ```
   npx prisma migrate dev --name init
   ```

### 2. Uso Complementar

Usar o Prisma em conjunto com o Supabase para tarefas específicas:

1. Instalar o Prisma apenas como dependência de desenvolvimento:
   ```
   npm install -D prisma
   ```

2. Configurar o Prisma para se conectar ao banco de dados do Supabase:
   ```
   DATABASE_URL="postgresql://postgres:postgres@db.xspmibkhtmnetivtnjox.supabase.co:5432/postgres"
   ```

3. Usar o Prisma para gerar esquemas e migrações, enquanto mantém o Supabase para autenticação e armazenamento.

## Inicialização e Migrações

Para inicializar o banco de dados com este schema:

1. Certifique-se de ter o PostgreSQL instalado e configurado
2. Configure a variável de ambiente `DATABASE_URL` no arquivo `.env`
3. Execute o comando de migração:
   ```
   npx prisma migrate dev --name initial
   ```

## Uso no Código

Exemplo de como usar o cliente Prisma no código:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Exemplo: Criar um novo paciente
async function createPatient(patientData) {
  const patient = await prisma.patient.create({
    data: {
      name: patientData.name,
      registrationNumber: patientData.registrationNumber,
      cpf: patientData.cpf,
      dateOfBirth: new Date(patientData.dateOfBirth),
      gender: patientData.gender,
      phone: patientData.phone,
      // ... outros campos
      registeredBy: patientData.userId,
    },
  })
  return patient
}

// Exemplo: Buscar pacientes
async function searchPatients(query) {
  return prisma.patient.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { cpf: { contains: query } },
        { registrationNumber: { contains: query } }
      ]
    },
    include: {
      appointments: {
        where: {
          scheduledStart: {
            gte: new Date()
          }
        },
        orderBy: {
          scheduledStart: 'asc'
        },
        take: 1
      }
    }
  })
}
```

## Geração de Tipos

O Prisma gera automaticamente tipos TypeScript que podem ser usados em toda a aplicação:

```
npx prisma generate
```

Isso criará ou atualizará o cliente Prisma com tipos baseados no schema atual.

## Recursos Adicionais

- [Documentação do Prisma](https://www.prisma.io/docs/)
- [Referência do Schema Prisma](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Referência do Client Prisma](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference) 