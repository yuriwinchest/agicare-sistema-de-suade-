# 🏥 AgiCare - Sistema de Gestão de Saúde

![AgiCare Logo](public/logo-favicon.html)

## 📋 Sobre o Sistema

O **AgiCare** é um sistema completo de gestão médica e hospitalar desenvolvido para otimizar o atendimento e administração de clínicas e hospitais. Com interface moderna e intuitiva, oferece uma solução integrada para todas as necessidades de gestão em saúde.

## 🚀 Funcionalidades Principais

### 📋 **Recepção & Atendimento (5 Módulos)**
- **Recepção de Pacientes** - Gestão completa da recepção
- **Cadastro Individual** - Acolhimento personalizado
- **Agendamento** - Sistema de consultas e horários
- **Agendamento Rápido** - Marcação express de consultas
- **Consulta de Pacientes** - Busca avançada de dados

### 🩺 **Módulos Médicos (5 Módulos)**
- **Ambulatório** - Atendimentos ambulatoriais
- **Prontuário Eletrônico** - Registro médico completo
- **Sistema de Prontuário** - Anamnese, evolução e laudos
- **Cadastro de Pacientes** - Registro completo com alergias
- **Fluxo de Pacientes** - Acompanhamento em tempo real

### 👩‍⚕️ **Enfermagem (3 Módulos)**
- **Módulo de Enfermagem** - Cuidados completos
- **Avaliação SAE** - Sistematização da Assistência
- **Internação** - Gestão de leitos e cuidados

### ⚙️ **Administração (4 Módulos)**
- **Gestão de Usuários** - Controle de acesso
- **Dashboard** - Indicadores e métricas
- **Faturamento** - Controle financeiro e cobrança
- **Cadastro Empresarial** - Dados corporativos

### 🖥️ **Sistema (2 Módulos)**
- **Resumo Completo** - Visão geral do sistema
- **Monitoramento** - Alertas e status em tempo real

## 🏆 Certificações e Conformidade

- ✅ **ISO 27001** - Segurança da informação
- ✅ **LGPD** - Proteção de dados pessoais
- ✅ **CFM** - Aprovado pelo Conselho Federal de Medicina
- ✅ **ANVISA** - Conformidade sanitária

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript
- **UI Framework:** Tailwind CSS + Shadcn/UI
- **Roteamento:** React Router DOM
- **Formulários:** React Hook Form + Zod
- **Backend:** Supabase (PostgreSQL)
- **Build Tool:** Vite
- **Ícones:** Lucide React

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn
- Git

### Passos de Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/yuriwinchest/agicare-sistema-de-suade-.git
cd agicare-sistema-de-suade-
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp prisma/env-example .env
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

5. **Acesse o sistema:**
```
http://localhost:5173
```

## 🎯 Estrutura do Projeto

```
agicare-sistema-de-suade/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── admin/          # Componentes administrativos
│   │   ├── auth/           # Autenticação
│   │   ├── nursing/        # Enfermagem
│   │   ├── patient-*/      # Módulos de pacientes
│   │   └── ui/             # Componentes de interface
│   ├── pages/              # Páginas principais
│   ├── services/           # Serviços e APIs
│   ├── hooks/              # Custom hooks
│   ├── styles/             # Estilos CSS
│   └── utils/              # Utilitários
├── docs/                   # Documentação
├── diagrams/               # Diagramas do sistema
├── prisma/                 # Schema do banco de dados
└── tools/                  # Scripts e ferramentas
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa o linter

## 📊 Módulos do Sistema

| Categoria | Módulos | Descrição |
|-----------|---------|-----------|
| **Recepção** | 5 módulos | Atendimento e agendamento |
| **Médico** | 5 módulos | Prontuários e consultas |
| **Enfermagem** | 3 módulos | Cuidados e internação |
| **Admin** | 4 módulos | Gestão e faturamento |
| **Sistema** | 2 módulos | Monitoramento e relatórios |

**Total: 19 módulos funcionais completos!**

## 🎨 Interface e Design

- **Design System:** Baseado em princípios de UX médica
- **Responsivo:** Adaptado para desktop, tablet e mobile
- **Acessibilidade:** Conformidade com WCAG 2.1
- **Tema:** Paleta profissional para ambiente médico
- **Tipografia:** Inter font para máxima legibilidade

## 🔐 Segurança

- **Autenticação:** Sistema robusto com controle de sessão
- **Autorização:** Controle de acesso por perfis
- **Criptografia:** Dados sensíveis protegidos
- **Auditoria:** Log de todas as ações do sistema
- **Backup:** Rotinas automatizadas de backup

## 📈 Performance

- **Otimizado:** Bundle splitting e lazy loading
- **Cache:** Estratégias de cache inteligente
- **SEO:** Meta tags e estrutura otimizada
- **Monitoramento:** Métricas de performance

## 🚀 Deploy

O sistema está pronto para deploy em:
- **Vercel** (Recomendado)
- **Netlify**
- **AWS**
- **Azure**
- **Google Cloud**

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- **Email:** suporte@agicare.com
- **Documentação:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/yuriwinchest/agicare-sistema-de-suade-/issues)

## 🎯 Roadmap

- [ ] App móvel nativo
- [ ] Integração com equipamentos médicos
- [ ] IA para diagnósticos
- [ ] Telemedicina integrada
- [ ] API pública para integrações

---

**AgiCare** - Transformando a gestão de saúde com agilidade e tecnologia 🏥✨

## 📱 Screenshots

### Dashboard Principal
![Dashboard](docs/screenshots/dashboard.png)

### Módulo de Recepção
![Recepção](docs/screenshots/recepcao.png)

### Prontuário Eletrônico
![Prontuário](docs/screenshots/prontuario.png)

### Sistema de Enfermagem
![Enfermagem](docs/screenshots/enfermagem.png)
