import React from 'react';
import { 
  removeFromCart, 
  updateCartItemQuantity 
} from '../../firebase/cart';

const CartItem = ({ item, userId }) => {
  const { product, quantity } = item;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItemQuantity(userId, product.id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(userId, product.id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className="flex items-center border p-4 rounded-lg">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-20 h-20 object-cover rounded"
      />
      <div className="ml-4 flex-grow">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="px-2 py-1 border rounded"
          >
            -
          </button>
          <span className="mx-4">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="px-2 py-1 border rounded"
          >
            +
          </button>
        </div>
      </div>
      <div className="ml-4">
        <p className="font-semibold">${(product.price * quantity).toFixed(2)}</p>
        <button
          onClick={handleRemove}
          className="text-red-500 mt-2 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;