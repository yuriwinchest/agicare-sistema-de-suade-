# Verificação das Tabelas para o SaludoCare Manager

## Tabelas Definidas no Script SQL

O script SQL atual (`scripts/create-tables-sql.txt`) define as seguintes tabelas:

1. `departments` - Departamentos
2. `health_professionals` - Profissionais de saúde
3. `users` - Usuários do sistema
4. `user_profiles` - Perfis de usuário
5. `patients` - Pacientes
6. `healthcare_units` - Unidades de saúde
7. `appointments` - Agendamentos
8. `vital_signs` - Sinais vitais
9. `collaborators` - Colaboradores
10. `posts` - Posts do blog
11. `categories` - Categorias de posts
12. `post_categories` - Relacionamento entre posts e categorias
13. `comments` - Comentários em posts
14. `offline_sync_queue` - Fila de sincronização offline
15. `patient_notes` - Notas do paciente
16. `patient_logs` - Logs do paciente

## Tabelas Definidas no Modelo Prisma

O modelo Prisma (`prisma/schema.prisma`) define um conjunto mais amplo de tabelas:

1. `User` - Usuários do sistema
2. `Patient` - Pacientes
3. `Allergy` - Alergias dos pacientes
4. `Medication` - Medicações dos pacientes
5. `HealthCondition` - Condições de saúde dos pacientes
6. `Document` - Documentos dos pacientes
7. `Payment` - Pagamentos
8. `PaymentService` - Relacionamento entre pagamentos e serviços (implícito)
9. `Consultation` - Consultas médicas
10. `ExamRequest` - Solicitações de exames
11. `ExamResult` - Resultados de exames
12. `StaffSchedule` - Escala de profissionais
13. `MedicalRecord` - Prontuário médico
14. `NursingRecord` - Registro de enfermagem
15. `Hospitalization` - Internações
16. `Bed` - Leitos hospitalares
17. `Ward` - Alas/setores hospitalares
18. `SystemSettings` - Configurações do sistema
19. `AuditLog` - Logs de auditoria
20. `ServicePrice` - Tabela de preços dos serviços
21. `ServiceCategory` - Categorias de serviços

## Tabelas Utilizadas no Código-Fonte

O código-fonte do projeto utiliza principalmente:

1. `patients` - Para gerenciamento de pacientes
2. `vital_signs` - Para registro de sinais vitais
3. `health_professionals` - Para profissionais de saúde
4. `healthcare_units` - Para unidades de saúde
5. `offline_sync_queue` - Para sincronização offline
6. `ServicePrice` - Para preços de serviços e exames
7. `ServiceCategory` - Para categorias de serviços

## Análise e Recomendações

### Tabelas Essenciais que Estão Presentes no Script SQL:
- ✅ `users`
- ✅ `patients`
- ✅ `health_professionals`
- ✅ `appointments`
- ✅ `vital_signs`
- ✅ `offline_sync_queue`

### Tabelas Importantes que Faltam no Script SQL:
- ❌ `ServicePrice` - Tabela de preços de serviços (usada no código)
- ❌ `ServiceCategory` - Categorias de serviços (usada no código)
- ❌ `Allergy` - Alergias dos pacientes
- ❌ `Medication` - Medicações dos pacientes
- ❌ `HealthCondition` - Condições de saúde
- ❌ `Consultation` - Consultas médicas
- ❌ `ExamRequest` - Solicitações de exames
- ❌ `ExamResult` - Resultados de exames
- ❌ `MedicalRecord` - Prontuário médico
- ❌ `NursingRecord` - Registro de enfermagem

### Recomendações:

1. **Prioridade Alta**: Adicionar as tabelas `ServicePrice` e `ServiceCategory` ao script SQL, pois são utilizadas diretamente no código-fonte.

2. **Prioridade Média**: Adicionar as tabelas relacionadas ao prontuário eletrônico (`MedicalRecord`, `NursingRecord`, `Consultation`, `ExamRequest`, `ExamResult`).

3. **Prioridade Baixa**: Adicionar as tabelas relacionadas ao histórico de saúde do paciente (`Allergy`, `Medication`, `HealthCondition`).

4. **Considerar para o Futuro**: Avaliar a necessidade das tabelas de internação (`Hospitalization`, `Bed`, `Ward`) conforme a evolução do projeto.

## Conclusão

O script SQL atual cobre as tabelas básicas necessárias para o funcionamento inicial do sistema, mas faltam algumas tabelas importantes que são utilizadas no código-fonte ou definidas no modelo Prisma. Recomenda-se adicionar pelo menos as tabelas de serviços (`ServicePrice` e `ServiceCategory`) para garantir o funcionamento adequado do sistema.