import React from 'react';
import './Carrinho.css';

const Carrinho = ({ products, total, onRemove }) => {
  const selectedProducts = products.filter(product => product.quantity > 0);

  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="carrinho-container">
      <h2>Carrinho de Compras</h2>
      <div className="carrinho-items">
        {selectedProducts.map((product) => (
          <div key={product.id} className="carrinho-item">
            <img src={product.img} alt={product.name} />
            <div className="carrinho-item-details">
              <h3>{product.name}</h3>
              <p>Quantidade: {product.quantity}</p>
              <p>Preço: R${(product.price * product.quantity).toFixed(2)}</p>
              <button onClick={() => onRemove(product.id)}>&times;</button>
            </div>
          </div>
        ))}
      </div>
      <div className="carrinho-total">
        <h3>Total: R${total.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default Carrinho;
