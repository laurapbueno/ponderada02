# 🛍️ App de Produtos | Ponderada 01

Este aplicativo mobile foi desenvolvido como parte da Ponderada 01 da disciplina de Desenvolvimento Mobile. O objetivo foi implementar um app funcional com funcionalidades completas de listagem, cadastro, perfil de usuário e interações com a câmera, notificações e armazenamento local, utilizando **React Native**.

## ✅ Funcionalidades implementadas

- [x] Autenticação com email e senha
- [x] Cadastro de novo usuário
- [x] Tela inicial com boas-vindas e navegação
- [x] Listagem de produtos com:
  - Paginação de até **10.000 produtos**
  - Produtos mockados com **Faker.js**
  - Filtro por **favoritos** e **produtos adicionados pelo usuário**
- [x] Tela de detalhes do produto com informações estendidas
- [x] Favoritar produtos
- [x] Câmera para tirar foto e adicionar novo produto
- [x] Compartilhar imagem do produto
- [x] Armazenamento local (AsyncStorage) para:
  - Produtos criados pelo usuário
  - Sessão do usuário logado
- [x] Notificações (somente com app aberto)
- [x] Tela de perfil com:
  - Visualização e edição de nome, email, telefone e foto de perfil

---

## 🚀 Tecnologias e bibliotecas utilizadas

- **React Native**
- **TypeScript**
- **Expo**
- **AsyncStorage**
- **expo-camera**
- **expo-sharing**
- **expo-notifications**
- **faker-js**
- **@react-navigation/native-stack**

---

## 🧪 Testado em

- Emulador Android (Expo Go)
- Dispositivo físico Android

---

## 🧠 Organização do Projeto

```bash
src/
├── navigation/
│   ├── StackNavigator.tsx         # Configuração das rotas
│   └── types.ts                   # Tipagem das rotas
│
├── screens/
│   ├── LoginScreen.tsx           # Tela de login
│   ├── CadastroScreen.tsx        # Tela de cadastro de usuário
│   ├── HomeScreen.tsx            # Tela inicial com opções
│   ├── ProductListScreen.tsx     # Lista de produtos com filtros e favoritos
│   ├── ProductDetailsScreen.tsx  # Tela de detalhes do produto
│   ├── CameraScreen.tsx          # Tela para tirar foto e adicionar produto
│   └── ProfileScreen.tsx         # Tela de perfil do usuário
│
├── services/
│   └── auth.ts                   # Serviço de autenticação mockado (login)

```

## 📂 Instruções para rodar localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ponderada01-app.git

# Acesse a pasta do projeto
cd ponderada01-app

# Instale as dependências
npm install

# Execute o app
npx expo start
