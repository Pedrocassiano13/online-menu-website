# Labrownie - Cardápio Online

Sistema de pedidos online para a Labrownie, com integração direta com WhatsApp e otimização de performance.

## 🚀 Começando

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Git (para versionamento)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/labrownie.git
cd labrownie
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Acesse o site em: http://localhost:3000

## 📦 Deploy

O projeto utiliza GitHub Pages para deploy. Para fazer o deploy:

1. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env na raiz do projeto
REACT_APP_WHATSAPP_WEBHOOK_URL=seu-webhook-url
```

2. Execute o comando de deploy:
```bash
npm run deploy
```

## 📱 WhatsApp Integration

O sistema utiliza um webhook para receber mensagens do WhatsApp. Para configurar:

1. Configure um webhook no seu provedor de WhatsApp (como Twilio ou 360Dialog)
2. Defina a URL do webhook no arquivo WhatsAppService.js
3. Configure as respostas automáticas no WhatsAppService.js

## 🚀 Otimização

O projeto inclui otimização automática de imagens:

1. Novas imagens são otimizadas automaticamente no build
2. Use o comando para otimizar imagens existentes:
```bash
npm run optimize:images
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.