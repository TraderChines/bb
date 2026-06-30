# Configuração do GitHub & Deploy Automático - Broker Breaker

Para enviar este projeto para o seu repositório e ativar o deploy automático, siga estas etapas:

## 1. Enviar para o GitHub
Execute os seguintes comandos no terminal:

```bash
git init
git add .
git commit -m "Configuração de deploy automático via GitHub Actions"
git branch -M main
git remote add origin https://github.com/TraderChines/bb.git
git push -u origin main
```

## 2. Configurar o Segredo de Deploy (Obrigatório para GitHub Actions)
Para que o GitHub tenha permissão de fazer o deploy no Firebase:

1. No **Console do Firebase**, vá em **Configurações do Projeto** > **Contas de Serviço**.
2. Clique em **Gerar nova chave privada** e baixe o arquivo JSON.
3. No seu repositório no **GitHub**, vá em **Settings** > **Secrets and variables** > **Actions**.
4. Clique em **New repository secret**.
5. Nome: `FIREBASE_SERVICE_ACCOUNT_STUDIO_6066508295_D330E`.
6. Valor: Cole todo o conteúdo do arquivo JSON que você baixou.

## 3. Firebase App Hosting (Alternativa Recomendada)
Para projetos Next.js 15, o **App Hosting** é a solução nativa e mais simples do Firebase:
1. No [Console do Firebase](https://console.firebase.google.com/), acesse **App Hosting**.
2. Clique em **Começar** e conecte seu GitHub.
3. Selecione o repositório `TraderChines/bb`.
4. O Firebase gerencia o deploy automaticamente sem necessidade de configurar segredos manuais no GitHub.

---
Os arquivos de workflow e o `firebase.json` já foram configurados para suportar o deploy automático via frameworks.
