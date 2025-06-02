import React, { useState } from "react";
import items from "./data/produtos";
import './App.css';

function App() {
  // Estado dos produtos (quantidade e estoque)
  const [products, setProducts] = useState(
    items.map((item) => ({
      ...item,
      quantity: 0,
      stock: item.stock || 10, // valor padrão de estoque
    }))
  );

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
  const [payment, setPayment] = useState(""); // pagamento
  const [troco, setTroco] = useState(""); // valor do troco

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
        i === idx && p.stock < 50 // Limita o estoque a 50 unidades
          ? { ...p, stock: p.stock + 10 }
          : p
      )
    );
  }

  // Função para admin
  function handleAdmin() {
    const senha = prompt("Digite a senha de admin:");
    if (senha === "22042020") { // senha alterada
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
    (modalidade === "delivery" ? 2 : 0); // valor do delivery atualizado para R$ 2,00

  // Envio automático para WhatsApp
  function sendToWhatsApp() {
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

    let mensagem = `*Pedido LaBrownie*\n\n${produtosSelecionados}\n\n*Total:* R$ ${total.toFixed(2)}\n\n*Modalidade:* ${modalidade === "delivery" ? "Delivery" : "Retirada"}\n*Pagamento:* ${payment === "dinheiro" ? "Dinheiro" : payment === "pix" ? "Pix" : "Cartão"}\n\n*Nome:* ${nome}\n*Telefone:* ${telefone}`;
    if (modalidade === "delivery") {
      mensagem += `\n*Endereço:* ${endereco}\n*Ponto de referência:* ${referencia}`;
    }
    if (payment === "dinheiro") {
      mensagem += `\n*Troco para:* R$ ${parseFloat(troco).toFixed(2)}`;
    }

    const numero = "5582994221186";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  }

  return (
    <div style={{ 
      background: "#fbcfe8", 
      minHeight: "100vh", 
      padding: "16px", 
      fontFamily: "'Roboto', Arial, sans-serif",
      position: 'relative'
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Cardápio LaBrownie</h1>
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
        
        <div className="menu-container">
          <div className="products-grid" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {products.map((product, idx) => (
              <div 
                key={product.id} 
                className="product-card" 
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <img 
                  src={product.img} 
                  alt={product.name} 
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    height: "auto",
                    borderRadius: "8px",
                    marginBottom: "16px"
                  }}
                />
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{product.name}</h3>
                <p style={{ fontSize: "14px", color: "#555", marginBottom: "8px" }}>{product.desc}</p>
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#be185d", marginBottom: "16px" }}>
                  R${product.price.toFixed(2)}
                </p>
                <div 
                  className="quantity-controls" 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <button 
                    onClick={() => decreaseQuantity(idx)} 
                    disabled={product.quantity === 0}
                    style={{
                      background: "#e11d48",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>{product.quantity}</span>
                  <button 
                    onClick={() => increaseQuantity(idx)} 
                    disabled={product.quantity === product.stock}
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}
                  >
                    +
                  </button>
                </div>
                {isAdmin && (
                  <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => addStock(idx)}
                      style={{
                        background: "#10b981",
                        color: "#fff",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Adicionar Estoque
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Informações do cliente */}
        <div style={{ marginTop: "32px" }}>
          <h2>Informações do Cliente</h2>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "8px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "16px",
            }}
          />
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "8px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "16px",
            }}
          />
          {modalidade === "delivery" && (
            <>
              <input
                type="text"
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "16px",
                }}
              />
              <input
                type="text"
                placeholder="Ponto de Referência"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "16px",
                }}
              />
            </>
          )}
          <div style={{ marginBottom: "16px" }}>
            <label>
              <input
                type="radio"
                name="modalidade"
                value="retirada"
                checked={modalidade === "retirada"}
                onChange={() => setModalidade("retirada")}
              />
              Retirada
            </label>
            <label style={{ marginLeft: "16px" }}>
              <input
                type="radio"
                name="modalidade"
                value="delivery"
                checked={modalidade === "delivery"}
                onChange={() => setModalidade("delivery")}
              />
              Delivery
            </label>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label>
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={payment === "pix"}
                onChange={() => setPayment("pix")}
              />
              Pix
            </label>
            <label style={{ marginLeft: "16px" }}>
              <input
                type="radio"
                name="payment"
                value="cartao"
                checked={payment === "cartao"}
                onChange={() => setPayment("cartao")}
              />
              Cartão
            </label>
            <label style={{ marginLeft: "16px" }}>
              <input
                type="radio"
                name="payment"
                value="dinheiro"
                checked={payment === "dinheiro"}
                onChange={() => setPayment("dinheiro")}
              />
              Dinheiro
            </label>
          </div>
          {payment === "dinheiro" && (
            <input
              type="text"
              placeholder="Troco para quanto?"
              value={troco}
              onChange={(e) => setTroco(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "8px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "16px",
              }}
            />
          )}
          <button
            onClick={sendToWhatsApp}
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              padding: "12px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              width: "100%",
            }}
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
