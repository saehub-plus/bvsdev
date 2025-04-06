
<div align="center">
  <h1><span style="color:#39FF14;">&lt;BVS/&gt;</span> Developments</h1>
  <p>Portfolio de Desenvolvimento Sci-Fi</p>
  <hr>
</div>

# 🧠 BVS Development Portfolio

Este repositório contém o projeto de portfólio de desenvolvimento com temática sci-fi/cyberpunk de Bruno Vinícius Silva, enfermeiro e desenvolvedor web.

![BVS Dev Banner](https://firebasestorage.googleapis.com/v0/b/projetos-bruno-1d53d.appspot.com/o/screenshots%2Fbanner-bvs.png?alt=media)

## ✨ Funcionalidades

- 📱 Design responsivo com tema futurista/Matrix
- 🔒 Autenticação com Firebase (e-mail/senha)
- 🛡️ Sistema de segurança "Modo Invasão Hacker" na tela de login
- 📂 Gerenciamento completo de projetos
- 🖼️ Upload e gestão de imagens
- 📊 Visualização detalhada de projetos
- 🎭 Animações fluidas e efeitos visuais de alta qualidade

## 🚀 Tecnologias Utilizadas

- **Frontend**
  - React + TypeScript
  - Tailwind CSS (com estilo cyberpunk personalizado)
  - Animações personalizadas
  - shadcn-ui para componentes
  - Lucide Icons para ícones

- **Backend / Infraestrutura**
  - Firebase Authentication
  - Firebase Firestore Database
  - Firebase Storage
  - Firebase Hosting

## 💻 Como Rodar Localmente

1. Clone o repositório
   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd bvs-portfolio
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   ```

4. Acesse `http://localhost:5173` em seu navegador

## 🔐 Área Administrativa

O projeto possui uma área administrativa para gerenciar projetos, acessível em `/admin`. É necessário autenticação para acessar.

### Configuração do Firebase Auth:

1. Crie um usuário com e-mail e senha no Firebase Auth
2. Use essas credenciais para acessar a área administrativa
3. Em caso de erro de autenticação com e-mail não registrado, o sistema ativará o "Modo Invasão Hacker" como medida de segurança

## 📁 Estrutura do Projeto

```
src/
│
├── components/        # Componentes reutilizáveis
│   ├── ui/            # Componentes base (shadcn-ui)
│   ├── Layout.tsx     # Layout principal da aplicação
│   └── ...            # Outros componentes
│
├── contexts/          # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
│
├── lib/               # Utilitários e configurações
│   ├── firebase.ts    # Configuração e funções do Firebase
│   └── utils.ts       # Funções utilitárias
│
├── pages/             # Páginas da aplicação
│   ├── Index.tsx      # Página inicial
│   ├── LoginPage.tsx  # Página de login com modo hacker
│   ├── AdminPage.tsx  # Painel administrativo
│   └── ...            # Outras páginas
│
├── hooks/             # Hooks personalizados
│   └── use-toast.ts   # Hook para notificações
│
└── App.tsx            # Componente principal e rotas
```

## 🧩 Recursos Adicionais

1. **Efeitos visuais personalizados**
   - Efeito de escaneamento na imagem de perfil
   - Animações de neon e glitch
   - Ícones das redes sociais flutuantes

2. **Sistema de proteção contra intrusão**
   - Ativação do modo de alerta em caso de tentativas de login inválidas
   - Feedback visual e animações para diferentes estados de autenticação

3. **Gerenciamento completo de projetos**
   - Criação, edição e exclusão de projetos
   - Upload de múltiplas imagens por projeto
   - Organização por páginas e tecnologias

## 🌐 Demo Online

O projeto está disponível online em:
[https://bvsdev.web.app](https://bvsdev.web.app)

## 🙌 Créditos

© 2025 BVS Developments - Bruno Vinicius Silva

---

<div align="center">
  <p>
    <a href="https://github.com/bruvini" target="_blank">
      <img src="https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>
    <a href="https://www.linkedin.com/in/enfbrunovinicius" target="_blank">
      <img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
    </a>
    <a href="https://www.instagram.com/bruvini/" target="_blank">
      <img src="https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram">
    </a>
  </p>
</div>
