import axios from 'axios';

// Configuração do Webhook para o WhatsApp
const WEBHOOK_URL = 'https://seu-webhook-url.com/whatsapp';

export class WhatsAppService {
  constructor() {
    this.messages = new Map();
    this.initializeWebhook();
  }

  // Inicializa o webhook para receber mensagens
  async initializeWebhook() {
    try {
      await axios.post(WEBHOOK_URL, {
        event: 'INITIALIZE',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao inicializar webhook:', error);
    }
  }

  // Processa uma nova mensagem recebida
  async processMessage(message) {
    const { from, body } = message;
    
    // Verifica se é um novo pedido
    if (body.includes('*Pedido LaBrownie*')) {
      await this.handleNewOrder(message);
    }
  }

  // Lida com novos pedidos
  async handleNewOrder(message) {
    const { from, body } = message;
    
    // Extrai informações do pedido
    const orderInfo = this.extractOrderInfo(body);
    
    // Responde automaticamente
    await this.sendConfirmation(from, orderInfo);
  }

  // Extrai informações do pedido
  extractOrderInfo(body) {
    const lines = body.split('\n');
    const info = {};
    
    lines.forEach(line => {
      if (line.includes('Total:')) info.total = line.split(':')[1].trim();
      if (line.includes('Modalidade:')) info.modalidade = line.split(':')[1].trim();
      if (line.includes('Pagamento:')) info.pagamento = line.split(':')[1].trim();
      if (line.includes('Nome:')) info.nome = line.split(':')[1].trim();
      if (line.includes('Telefone:')) info.telefone = line.split(':')[1].trim();
    });
    
    return info;
  }

  // Envia confirmação de pedido
  async sendConfirmation(phone, orderInfo) {
    const message = `
*LABROWNIE - PEDIDO CONFIRMADO*

*Nome:* ${orderInfo.nome}
*Total:* ${orderInfo.total}
*Pagamento:* ${orderInfo.pagamento}
*Modalidade:* ${orderInfo.modalidade}

Obrigado pelo seu pedido! 🎉

*Tempo estimado:*
- Retirada: 15-20 minutos
- Delivery: 20-50 minutos

*Observações:*
- Horário de funcionamento: 10h às 20h
- Entregas apenas na região central
- Taxa de delivery: R$ 3,00

Precisa de mais alguma coisa? 😊
`;  

    try {
      await axios.post(WEBHOOK_URL, {
        to: phone,
        type: 'text',
        body: message
      });
    } catch (error) {
      console.error('Erro ao enviar confirmação:', error);
    }
  }

  // Envia mensagem de status do pedido
  async sendOrderStatus(phone, status) {
    const statusMessages = {
      'preparando': 'Seu pedido está sendo preparado com carinho! 🍰',
      'pronto': 'Seu pedido está pronto! 🎉',
      'saiu': 'Seu pedido saiu para entrega! 🚚',
      'entregue': 'Seu pedido foi entregue! 🎉',
      'cancelado': 'Seu pedido foi cancelado. 😔'
    };

    try {
      await axios.post(WEBHOOK_URL, {
        to: phone,
        type: 'text',
        body: statusMessages[status]
      });
    } catch (error) {
      console.error('Erro ao enviar status:', error);
    }
  }
}
