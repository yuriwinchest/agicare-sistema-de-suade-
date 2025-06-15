# Diagramas do SaludoCare Manager

Este diretório contém diagrama Mermaid para documentar a arquitetura e fluxos do sistema SaludoCare Manager.

## Diagramas disponíveis

- **ER-Diagram.md**: Diagrama de Entidade-Relacionamento mostrando as principais entidades do sistema e seus relacionamentos
- **Patient-Flow.md**: Fluxograma detalhado do processo de atendimento ao paciente
- **System-Architecture.md**: Diagrama da arquitetura técnica do sistema
- **Database-Schema.md**: Esquema do banco de dados mostrando as tabelas e suas relações

## Como visualizar os diagramas

### Opção 1: Visualização no GitHub

Todos os diagramas estão escritos em Markdown usando a sintaxe Mermaid, que é suportada nativamente pelo GitHub. Basta abrir os arquivos no repositório GitHub para visualizá-los.

### Opção 2: Editor Mermaid Live

Para editar ou visualizar os diagramas interativamente:

1. Copie o conteúdo do diagrama (o código entre os delimitadores ```mermaid)
2. Acesse o [Mermaid Live Editor](https://mermaid.live/)
3. Cole o código no editor para visualizar e editar

### Opção 3: Extensões para VSCode

Para visualizar diretamente no VSCode, instale uma extensão Mermaid:

1. Abra o VSCode
2. Acesse a aba de extensões (Ctrl+Shift+X)
3. Busque por "Mermaid"
4. Instale uma extensão como "Markdown Preview Mermaid Support" ou "Mermaid Markdown Syntax Highlighting"
5. Abra o arquivo Markdown e visualize com a opção de preview (Ctrl+K V)

## Modificando os diagramas

Ao modificar os diagramas, siga estas diretrizes:

1. Mantenha-os simples e focados em uma única área ou processo
2. Use cores coerentes para categorias semelhantes
3. Adicione comentários para explicar partes complexas
4. Verifique se o diagrama renderiza corretamente antes de fazer commit

## Recursos para Mermaid

- [Documentação oficial do Mermaid](https://mermaid-js.github.io/mermaid/#/)
- [Cheatsheet de sintaxe Mermaid](https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/)
- [Exemplos de diagramas Mermaid](https://mermaid-js.github.io/mermaid/#/examples)

## Convenções de nomenclatura

- **Entidades**: Use substantivos no singular (ex: "Patient" em vez de "Patients")
- **Relacionamentos**: Use verbos no presente ou expressões curtas (ex: "manages", "belongs to")
- **Ações em fluxogramas**: Use verbos no infinitivo (ex: "Register Patient")
- **Decisões**: Formule como perguntas (ex: "Is patient registered?")

## Geração de outros tipos de diagramas

Para gerar diagramas a partir do schema Prisma, considere usar ferramentas como:

- [Prisma ERD Generator](https://github.com/keonik/prisma-erd-generator)
- [Prisma Schema to UML](https://github.com/emyann/prisma-schema-to-uml) 