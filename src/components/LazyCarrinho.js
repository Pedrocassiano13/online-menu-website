import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './LazyCarrinho.css';

const LazyCarrinho = ({ products, total, onRemove }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para verificar quais itens estão visíveis
  const checkVisibleItems = () => {
    const items = document.querySelectorAll('.carrinho-item');
    const visible = [];
    
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visible.push(item.dataset.productId);
      }
    });
    
    setVisibleItems(visible);
  };

  // Observa o scroll para carregar itens
  useEffect(() => {
    window.addEventListener('scroll', checkVisibleItems);
    return () => window.removeEventListener('scroll', checkVisibleItems);
  }, []);

  const selectedProducts = products.filter(product => product.quantity > 0);

  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="carrinho-container">
      <h2>Carrinho de Compras</h2>
      <div className="carrinho-items">
        {selectedProducts.map((product) => (
          <div 
            key={product.id} 
            className="carrinho-item"
            data-product-id={product.id}
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            <LazyLoadImage
              src={product.img}
              alt={product.name}
              width={60}
              height={60}
              effect="blur"
              visibleByDefault={visibleItems.includes(product.id.toString())}
              afterLoad={() => setLoading(false)}
            />
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

export default LazyCarrinho;
