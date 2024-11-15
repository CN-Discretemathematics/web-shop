import React from 'react';
import { useCart } from '../../hooks/useCart';
import CartItem from './CartItem';
import { useAuth } from '../../hooks/useAuth'; // 

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, loading, error } = useCart(user?.uid);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!cartItems.length) return <div className="p-4">Your cart is empty</div>;

  const total = cartItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem 
            key={item.id}
            item={item}
            userId={user.uid}
          />
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button 
          onClick={() => window.location.href = '/checkout'}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;