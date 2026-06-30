
# Configuração do GitHub & Deploy Automático - Broker Breaker

Para enviar este projeto para o seu repositório e ativar o deploy automático, siga estas etapas:

## 1. Enviar para o GitHub (Push)
Execute os seguintes comandos no terminal do Firebase Studio:

```bash
git init
git add .
git commit -m "Correção de estrutura e configuração de deploy"
git branch -M main
git remote add origin https://github.com/TraderChines/bb.git
git push -u origin main --force
```

## 2. Resolver o Erro de Permissão (GitHub Secrets) ⚠️ IMPORTANTE
O erro `firebaseServiceAccount` acontece porque o GitHub não tem a chave de acesso. Siga isto:

1. Vá ao [Console do Firebase](https://console.firebase.google.com/).
2. Selecione o projeto **studio-6066508295-d330e**.
3. Clique na **Engrenagem** (Configurações do Projeto) > **Contas de Serviço**.
4. Clique no botão azul: **Gerar nova chave privada**.
5. Um arquivo `.json` será baixado. **Abra ele, copie todo o conteúdo (texto)**.
6. Vá ao seu GitHub (`https://github.com/TraderChines/bb`).
7. Clique em **Settings** > **Secrets and variables** > **Actions**.
8. Clique em **New repository secret**.
9. Name: `FIREBASE_SERVICE_ACCOUNT_STUDIO_6066508295_D330E`
10. Secret: (Cole o conteúdo do JSON aqui).
11. Clique em **Add secret**.

## 3. Reiniciar o Deploy
Após salvar o secret, vá na aba **Actions** no seu GitHub e clique em **Re-run all jobs** no deploy que falhou.
