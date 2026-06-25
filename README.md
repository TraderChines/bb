# Broker Breaker - Sistema de Estudo de Bugs

Este é um protótipo avançado construído com Next.js 15, Firebase (Auth/Firestore) e ShadCN UI.

## Estrutura do Projeto

- **`/` (Login)**: Tela de entrada com estética Glassmorphism.
- **`/register`**: Fluxo de ativação gated (Licença -> Termos -> Cadastro).
- **`/bb`**: Simulador principal protegido por autenticação.
- **`/adm`**: Central de comando para gerenciar licenças e preços.
- **`/vip`**: Página de checkout dinâmico.

## Como rodar o projeto na sua máquina

Se você deseja baixar e usar este código fora do Firebase Studio, siga estes passos:

1. **Copie os arquivos**: Copie o conteúdo de cada arquivo da árvore lateral para pastas correspondentes no seu computador.
2. **Instale as dependências**:
   No terminal da pasta do projeto, execute:
   ```bash
   npm install
   ```
3. **Configure seu Firebase**:
   - Vá ao [Console do Firebase](https://console.firebase.google.com/).
   - Crie um novo projeto.
   - Ative o **Authentication** (método E-mail/Senha).
   - Ative o **Cloud Firestore**.
   - No Firestore, crie um documento inicial: `appConfig/registration` com os campos `registrationSecret` (string) e `vipPrice` (string).
   - Copie suas credenciais (SDK Config) e substitua no arquivo `src/firebase/config.ts`.
4. **Inicie o projeto**:
   ```bash
   npm run dev
   ```

## Observações
- A chave de ativação padrão configurada é `1234-5678-9012`.
- O design utiliza a fonte **Source Code Pro** para manter a estética hacker/terminal.
