import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import items from "./data/produtos";
import './App.css';
import LazyCarrinho from './components/LazyCarrinho';
import axios from 'axios';
import { WhatsAppService } from './services/WhatsAppService';

// Componentes
const Menu = () => {
  const [products, setProducts] = useState(
    items.map((item) => ({
      ...item,
      quantity: 0,
      stock: item.stock || 10,
    }))
  );

  // Total do carrinho
  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const increaseQuantity = (idx) => {
    setProducts((products) =>
      products.map((p, i) =>
        i === idx && p.quantity < p.stock
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    );
  };

  const decreaseQuantity = (idx) => {
    setProducts((products) =>
      products.map((p, i) =>
        i === idx && p.quantity > 0
          ? { ...p, quantity: p.quantity - 1 }
          : p
      )
    );
  };

  return (
    <div className="menu-container">
      <h1>Cardápio</h1>
      {total > 0 && (
        <div className="carrinho-summary">
          <h3>Total: R${total.toFixed(2)}</h3>
        </div>
      )}
      <div className="products-grid">
        {products.map((product, idx) => (
          <div key={product.id} className="product-card">
            <img src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.desc}</p>
            <p>R${product.price.toFixed(2)}</p>
            <div className="quantity-controls">
              <button onClick={() => decreaseQuantity(idx)}>-</button>
              <span>{product.quantity}</span>
              <button onClick={() => increaseQuantity(idx)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Pedido = () => {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [referencia, setReferencia] = useState("");
  const [telefone, setTelefone] = useState("");
  const [modalidade, setModalidade] = useState("retirada");
  const [payment, setPayment] = useState("");
  const [troco, setTroco] = useState("");

  return (
    <div className="pedido-container">
      <h1>Faça seu Pedido</h1>
      <form>
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Endereço:</label>
          <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Referência:</label>
          <input type="text" value={referencia} onChange={(e) => setReferencia(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Telefone:</label>
          <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Modalidade:</label>
          <select value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
            <option value="retirada">Retirada</option>
            <option value="entrega">Entrega</option>
          </select>
        </div>
        <div className="form-group">
          <label>Forma de Pagamento:</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">Selecione</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
          </select>
        </div>
        {payment === "dinheiro" && (
          <div className="form-group">
            <label>Troco para:</label>
            <input type="text" value={troco} onChange={(e) => setTroco(e.target.value)} />
          </div>
        )}
        <button type="submit">Enviar Pedido</button>
      </form>
    </div>
  );
};

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo à Labrownie</h1>
      <p>Delicie-se com nossos produtos artesanais!</p>
      <div className="cta-buttons">
        <button onClick={() => window.location.href = '/menu'}>Ver Cardápio</button>
        <button onClick={() => window.location.href = '/pedido'}>Fazer Pedido</button>
      </div>
    </div>
  );
};

function App() {
  // Estado dos produtos (quantidade e estoque)
  const [products, setProducts] = useState(
    items.map((item) => ({
      ...item,
      quantity: 0,
      stock: item.stock || 10,
    }))
  );

  // Estado do carrinho
  const [carrinho, setCarrinho] = useState([]);

  // Função para remover item do carrinho
  const removeDoCarrinho = (productId) => {
    setProducts(products.map(product =>
      product.id === productId ? { ...product, quantity: 0 } : product
    ));
  };

  // Campos do cliente
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [referencia, setReferencia] = useState("");
  const [telefone, setTelefone] = useState("");

  // Modalidade
  const [modalidade, setModalidade] = useState("retirada");

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Pagamento
  const [payment, setPayment] = useState("");
  const [troco, setTroco] = useState("");

  // Funções para quantidade
  function increaseQuantity(idx) {
    setProducts((products) =>
      products.map((p, i) =>
        i === idx && p.quantity < p.stock
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    );
  }

  function decreaseQuantity(idx) {
    setProducts((products) =>
      products.map((p, i) =>
        i === idx && p.quantity > 0
          ? { ...p, quantity: p.quantity - 1 }
          : p
      )
    );
  }

  // Função para adicionar estoque (admin)
  function addStock(idx) {
    setProducts((products) =>
      products.map((p, i) =>
        i === idx ? { ...p, stock: p.stock + 10 } : p
      )
    );
  }

  // Função para admin
  function handleAdmin() {
    const senha = prompt("Digite a senha de admin:");
    if (senha === "22042020") {
      setIsAdmin(true);
      alert("Modo admin ativado!");
    } else {
      alert("Senha incorreta!");
    }
  }

  // Função para sair do admin
  function handleLogoutAdmin() {
    setIsAdmin(false);
    alert("Modo admin desativado!");
  }

  // Total
  const total =
    products.reduce((sum, p) => sum + p.price * p.quantity, 0) +
    (modalidade === "delivery" ? 2 : 0);

  // Função para enviar pedido via WhatsApp
  async function sendToWhatsApp() {
    if (!nome || !telefone || (modalidade === "delivery" && (!endereco || !referencia))) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    if (!payment) {
      alert("Selecione a modalidade de pagamento!");
      return;
    }
    if (payment === "dinheiro" && !troco) {
      alert("Informe o valor para troco!");
      return;
    }

    const produtosSelecionados = products
      .filter((p) => p.quantity > 0)
      .map((p) => `*${p.name}* x${p.quantity} = R$ ${(p.price * p.quantity).toFixed(2)}`)
      .join('\n');

    if (!produtosSelecionados) {
      alert("Selecione pelo menos um produto!");
      return;
    }

    // Criar mensagem formatada
    const mensagem = `*Pedido LaBrownie*\n\n${produtosSelecionados}\n\n*Total:* R$ ${total.toFixed(2)}\n\n*Modalidade:* ${modalidade === "delivery" ? "Delivery" : "Retirada"}\n*Pagamento:* ${payment === "dinheiro" ? "Dinheiro" : payment === "pix" ? "Pix" : "Cartão"}\n\n*Nome:* ${nome}\n*Telefone:* ${telefone}`;
    
    // Adicionar informações de entrega se necessário
    const mensagemFinal = modalidade === "delivery" 
      ? `${mensagem}\n*Endereço:* ${endereco}\n*Ponto de referência:* ${referencia}`
      : mensagem;

    // Adicionar troco se for pagamento em dinheiro
    const mensagemFinalComTroco = payment === "dinheiro"
      ? `${mensagemFinal}\n*Troco para:* R$ ${parseFloat(troco).toFixed(2)}`
      : mensagemFinal;

    // Enviar para WhatsApp
    const numero = "5582994221186";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagemFinalComTroco)}`;
    
    // Limpar carrinho após envio
    setProducts(products.map(product => ({
      ...product,
      quantity: 0
    })));

    // Abrir WhatsApp
    window.open(url, "_blank");

    // Notificação de sucesso
    alert("Pedido enviado com sucesso! Você será redirecionado para o WhatsApp.");

    // Limpar formulário após envio
    setNome("");
    setEndereco("");
    setReferencia("");
    setTelefone("");
    setModalidade("retirada");
    setPayment("");
    setTroco("");
  }

  return (
    <div style={{ 
      background: "#fbcfe8", 
      minHeight: "100vh", 
      padding: 24, 
      fontFamily: "'Roboto', Arial, sans-serif",
      position: 'relative'
    }}>
      {/* Carrinho flutuante */}
      <LazyCarrinho products={products} total={total} onRemove={removeDoCarrinho} />
      
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {!isAdmin ? (
          <button
            onClick={handleAdmin}
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              background: "#be185d",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 16
            }}
          >
            Modo Admin
          </button>
        ) : (
          <button
            onClick={handleLogoutAdmin}
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              background: "#e11d48",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 16
            }}
          >
            Sair Admin
          </button>
        )}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/pedido" element={<Pedido />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
