import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '../store/useStore';
import { useCart } from '../hooks/useCart';
import { Minus, Plus, Trash2, CreditCard, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, cartTotal, updateCartQuantity, removeFromCart, clearCart, setCartFromBackend } = useStore();
  const { cart: apiCart, loading, error, refetch } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePayment = async () => {
    setShowCheckout(false);
    // TODO: Integrate Paystack payment here
    // Simulate payment processing
    setTimeout(async () => {
      const success = Math.random() > 0.3; // 70% success rate
      setPaymentSuccess(success);
      setShowPaymentStatus(true);
      if (success) {
        await clearCart();
        toast.success('Payment successful!');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    }, 2000);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                <span className="text-lg text-gray-600">Loading your cart...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Cart</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={refetch} className="mr-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline">Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show empty cart state
  if (!apiCart || apiCart.items.length === 0) {
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

  // Calculate total from API cart
  const apiCartTotal = apiCart.items.reduce((total, item) => {
    return total + (item.supplement.price * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="destructive" onClick={() => setShowClearConfirm(true)} size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {apiCart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.supplement.image ? (
                        <img 
                          src={item.supplement.image} 
                          alt={item.supplement.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">IMG</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.supplement.name}</h3>
                      <p className="text-sm text-gray-600">{item.supplement.description}</p>
                      <p className="text-lg font-bold text-emerald-600">${item.supplement.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${(item.supplement.price * item.quantity).toFixed(2)}</p>
                    </div>
                    {/* Remove from cart button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-red-600 hover:bg-red-50"
                      onClick={async () => {
                        await removeFromCart(item.id);
                        await refetch();
                        if (apiCart && apiCart.items) {
                          // Map backend items to store format
                          setCartFromBackend(apiCart.items.map(i => ({
                            id: i.supplement.id.toString(),
                            name: i.supplement.name,
                            price: i.supplement.price,
                            image: i.supplement.image,
                            description: i.supplement.description,
                            category: 'supplement', // or map actual category if available
                            quantity: i.quantity
                          })));
                        }
                      }}
                      title="Remove from cart"
                    >
                      <Trash2 className="h-5 w-5" />
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
                  <span>${apiCartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${apiCartTotal.toFixed(2)}</span>
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
                Pay ${apiCartTotal.toFixed(2)}
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

        {/* Clear Cart Confirmation Dialog */}
        <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear Cart</DialogTitle>
              <DialogDescription>Are you sure you want to remove all items from your cart? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={async () => {
                await clearCart();
                await refetch();
                if (apiCart && apiCart.items) {
                  setCartFromBackend([]);
                }
                setShowClearConfirm(false);
                toast.success('Cart cleared!');
              }}>Clear</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CartPage;
