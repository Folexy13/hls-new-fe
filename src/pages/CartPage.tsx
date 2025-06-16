
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '../store/useStore';
import { Minus, Plus, Trash2, CreditCard, Truck } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart } = useStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: ''
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = total > 50 ? 0 : 9.99;
  const finalTotal = total + shipping;

  const handleQuantityChange = (id: number, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change);
      if (newQuantity === 0) {
        removeFromCart(id);
      } else {
        updateCartItem(id, newQuantity);
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(checkoutData).every(value => value)) {
      setShowCheckout(false);
      // Simulate payment processing
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        setPaymentSuccess(success);
        setShowPaymentStatus(true);
        if (success) {
          clearCart();
          toast.success('Payment successful! Order confirmed.');
        } else {
          toast.error('Payment failed. Please try again.');
        }
      }, 2000);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl">Your Cart is Empty</CardTitle>
              <CardDescription>Add some supplements to get started on your health journey</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.history.back()} className="mt-4">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-emerald-600 font-medium">${item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <span className="text-lg font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <div className="text-sm text-emerald-600">
                    <Truck className="inline h-4 w-4 mr-1" />
                    Free shipping on orders over $50!
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Modal */}
        <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
              <DialogDescription>Complete your order</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={checkoutData.firstName}
                    onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={checkoutData.lastName}
                    onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={checkoutData.email}
                  onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={checkoutData.address}
                  onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={checkoutData.city}
                    onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={checkoutData.zipCode}
                    onChange={(e) => setCheckoutData({...checkoutData, zipCode: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={checkoutData.country} onValueChange={(value) => setCheckoutData({...checkoutData, country: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={checkoutData.paymentMethod} onValueChange={(value) => setCheckoutData({...checkoutData, paymentMethod: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg mb-4">
                  <span>Total: ${finalTotal.toFixed(2)}</span>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Complete Order
                </Button>
              </div>
            </form>
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
                  ? 'Your order has been confirmed and will be shipped soon.'
                  : 'There was an issue processing your payment. Please try again.'
                }
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowPaymentStatus(false)} className="w-full">
              {paymentSuccess ? 'Continue' : 'Try Again'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CartPage;
