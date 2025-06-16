
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '../store/useStore';
import { Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, cartTotal, updateCartQuantity, removeFromCart, clearCart } = useStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePayment = () => {
    setShowCheckout(false);
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      setPaymentSuccess(success);
      setShowPaymentStatus(true);
      
      if (success) {
        clearCart();
        toast.success('Payment successful!');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">Add some supplements to get started</p>
              <Button>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-lg font-bold text-emerald-600">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={handleCheckout}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Modal */}
        <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
              <DialogDescription>Complete your order</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry</label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <Input placeholder="123" />
                </div>
              </div>
              <Button className="w-full" onClick={handlePayment}>
                Pay ${cartTotal.toFixed(2)}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Status Modal */}
        <Dialog open={showPaymentStatus} onOpenChange={setShowPaymentStatus}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {paymentSuccess ? 'Payment Successful!' : 'Payment Failed'}
              </DialogTitle>
              <DialogDescription>
                {paymentSuccess 
                  ? 'Your order has been placed successfully.'
                  : 'There was an issue processing your payment. Please try again.'
                }
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowPaymentStatus(false)}>
              {paymentSuccess ? 'Continue Shopping' : 'Try Again'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CartPage;
