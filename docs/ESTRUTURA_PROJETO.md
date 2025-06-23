# 🗂️ Estrutura Organizacional do Projeto Saludocare Manager

## 📋 **Visão Geral**
Estrutura organizada seguindo os princípios **SoC, KISS, DRY e YAGNI** para facilitar desenvolvimento, manutenção e compreensão do projeto.

---

## 🗂️ **Estrutura de Pastas**

### **📁 /src** - Código Fonte Principal
```
src/
├── components/           # Componentes React reutilizáveis
│   ├── ui/              # Componentes base (FormFieldWrapper, StandardLabel)
│   ├── auth/            # Componentes de autenticação
│   ├── admin/           # Componentes administrativos
│   ├── nursing/         # Componentes de enfermagem
│   ├── patient-*/       # Componentes relacionados a pacientes
│   └── layout/          # Componentes de layout
├── pages/               # Páginas da aplicação
├── hooks/               # Custom hooks reutilizáveis
├── services/            # Serviços e integrações
├── constants/           # Constantes centralizadas
├── utils/               # Utilitários gerais
├── styles/              # Estilos organizados
└── integrations/        # Integrações externas
```

**Responsabilidade**: Código fonte da aplicação React com TypeScript.

---

### **📁 /docs** - Documentação Técnica
```
docs/
├── architecture/        # Documentação de arquitetura
│   └── PRD.md          # Product Requirements Document
├── principles/         # Documentação dos princípios aplicados
│   ├── REFATORACAO_SOC.md
│   ├── APLICACAO_KISS.md
│   ├── APLICACAO_DRY.md
│   └── LIMPEZA_CODIGO.md
└── development/        # Documentação de desenvolvimento
    ├── INSTRUCOES_MELHORIAS.md
    ├── CHANGELOG.md
    └── CLAUDE.md
```

**Responsabilidade**: Documentação técnica, princípios e guias de desenvolvimento.

---

### **📁 /tools** - Ferramentas e Scripts
```
tools/
├── deployment/         # Scripts de deploy
│   ├── deploy-to-server.bat
│   └── deploy-to-server.sh
├── database/           # Scripts de banco de dados
│   └── scripts/        # Scripts SQL e de migração
└── dev-scripts/        # Scripts de desenvolvimento
    └── *.mjs          # Scripts de desenvolvimento e teste
```

**Responsabilidade**: Ferramentas, scripts de automação e utilitários de desenvolvimento.

---

### **📁 /tests** - Testes
```
tests/
└── legacy/            # Testes legados (mantidos apenas o essencial)
    └── testar-supabase.mjs
```

**Responsabilidade**: Testes automatizados e scripts de validação.

---

### **📁 /public** - Recursos Públicos
```
public/
├── *.png              # Ícones e favicons
├── *.ico              # Favicons
├── *.svg              # Ícones SVG
└── robots.txt         # SEO
```

**Responsabilidade**: Recursos estáticos servidos publicamente.

---

### **📁 /diagrams** - Diagramas e Modelagem
```
diagrams/
├── Database-Schema.md
├── ER-Diagram.md
├── Patient-Flow.md
├── System-Architecture.md
└── README.md
```

**Responsabilidade**: Diagramas de sistema, fluxos e documentação visual.

---

### **📁 /prisma** - Configuração de Banco
```
prisma/
├── schema.prisma      # Schema do banco de dados
├── env-example        # Exemplo de variáveis de ambiente
└── README.md          # Documentação do Prisma
```

**Responsabilidade**: Configuração e schema do banco de dados.

---

### **📁 /supabase** - Configuração Supabase
```
supabase/
└── config.toml       # Configuração do Supabase
```

**Responsabilidade**: Configurações específicas do Supabase.

---

## 🎯 **Princípios Aplicados na Organização**

### **SoC (Separation of Concerns)**
- **Documentação** separada do código fonte
- **Scripts** organizados por funcionalidade
- **Testes** em pasta dedicada
- **Recursos** públicos isolados

### **KISS (Keep It Simple, Stupid)**
- **Estrutura simples** e intuitiva
- **Nomes descritivos** para pastas
- **Hierarquia lógica** fácil de navegar

### **DRY (Don't Repeat Yourself)**
- **Componentes reutilizáveis** em /src/components/ui/
- **Constantes centralizadas** em /src/constants/
- **Hooks compartilhados** em /src/hooks/

### **YAGNI (You Aren't Gonna Need It)**
- **Removidos arquivos duplicados** de teste
- **Eliminadas pastas vazias** ou desnecessárias
- **Mantido apenas o essencial** para funcionamento

---

## 🎯 **Arquivos na Raiz (Somente Configuração)**

```
├── package.json           # Dependências e scripts NPM
├── package-lock.json      # Lock de dependências
├── bun.lockb              # Lock file do Bun
├── tsconfig.*.json        # Configurações TypeScript
├── vite.config.ts         # Configuração Vite
├── tailwind.config.ts     # Configuração Tailwind CSS
├── postcss.config.js      # Configuração PostCSS
├── eslint.config.js       # Configuração ESLint
├── components.json        # Configuração shadcn/ui
├── index.html             # HTML principal
├── README.md              # Documentação principal do projeto
├── .gitignore             # Arquivos ignorados pelo Git
├── .env.local             # Variáveis de ambiente (local)
└── bifrost.json           # Configuração específica
```

**🎯 Responsabilidade**: Apenas configurações de build, linting, dependências e arquivos essenciais do projeto.

### **📝 Nota sobre Arquivos de Configuração**
Os arquivos de configuração (vite.config.ts, tailwind.config.ts, etc.) **permanecem na raiz** porque:
- **Convenção padrão** da maioria das ferramentas
- **Referências automáticas** pelos bundlers e ferramentas
- **Evita complexidade** de ajustar paths em múltiplos arquivos
- **Facilita manutenção** e atualizações das ferramentas

---

## 🚀 **Como Navegar na Estrutura**

### **Para Desenvolvedores**
1. **Código fonte**: `/src/` - Todo código React/TypeScript
2. **Componentes**: `/src/components/` - Componentes reutilizáveis
3. **Páginas**: `/src/pages/` - Páginas da aplicação
4. **Documentação**: `/docs/` - Guias e princípios

### **Para DevOps/Deploy**
1. **Scripts de deploy**: `/tools/deployment/`
2. **Scripts de DB**: `/tools/database/`
3. **Configurações**: Arquivos na raiz

### **Para Arquitetos/PMs**
1. **PRD**: `/docs/architecture/PRD.md`
2. **Diagramas**: `/diagrams/`
3. **Princípios**: `/docs/principles/`

---

## ✅ **Benefícios da Nova Estrutura**

### **🔍 Encontrabilidade**
- **Localização intuitiva** de arquivos
- **Separação clara** por responsabilidade
- **Navegação facilitada**

### **🔧 Manutenibilidade**
- **Modificações isoladas** por funcionalidade
- **Documentação organizada**
- **Scripts centralizados**

### **👥 Colaboração**
- **Estrutura padronizada** para toda equipe
- **Documentação acessível**
- **Onboarding facilitado**

### **⚡ Performance**
- **Imports otimizados** com estrutura clara
- **Build mais eficiente**
- **Cache melhorado**

---

*Estrutura organizada seguindo rigorosamente o PRD e os 4 princípios fundamentais de desenvolvimento.*