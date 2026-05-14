import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '../../store/useStore';
import { useCart } from '../../hooks/useCart';
import { Minus, Plus, Trash2, CreditCard, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { paystackService } from '@/services/paystackService';
import { getApiErrorMessage } from '@/utils/apiError';
import { useLocation, useNavigate } from 'react-router-dom';
import { cartService } from '@/services/cartService';

const CartPage = () => {
  const { clearCart, removeFromCart, updateCartQuantity, setCartFromBackend, user, cartItems } = useStore();
  const isLoggedIn = !!user?.email;
  const { cart: apiCart, loading, error, refetch } = useCart(isLoggedIn);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [clearingCart, setClearingCart] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const displayedCart = isLoggedIn
    ? apiCart
    : {
        id: 0,
        userId: 0,
        items: cartItems.map((item) => ({
          id: Number(item.id),
          quantity: item.quantity,
          supplement: {
            id: Number(item.id),
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            imageUrl: item.image,
          },
        })),
      };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentMode = searchParams.get('payment');
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    if (paymentMode !== 'cart' || !reference) return;

    let cancelled = false;

    const verifyCartPayment = async () => {
      try {
        setVerifyingPayment(true);
        await paystackService.verifyCheckout(reference);
        if (cancelled) return;
        setPaymentSuccess(true);
        setShowPaymentStatus(true);
        setCartFromBackend([]);
        await refetch();
        toast.success('Payment successful. Your order has been placed.');
      } catch (err) {
        if (cancelled) return;
        setPaymentSuccess(false);
        setShowPaymentStatus(true);
        toast.error(getApiErrorMessage(err, 'Could not verify payment. Please try again.'));
      } finally {
        if (!cancelled) {
          setVerifyingPayment(false);
          const cleanedParams = new URLSearchParams(location.search);
          cleanedParams.delete('payment');
          cleanedParams.delete('reference');
          cleanedParams.delete('trxref');
          navigate(
            {
              pathname: location.pathname,
              search: cleanedParams.toString() ? `?${cleanedParams.toString()}` : '',
            },
            { replace: true }
          );
        }
      }
    };

    verifyCartPayment();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, navigate, refetch, setCartFromBackend]);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error('You must be logged in to checkout.');
      navigate('/auth/signin');
      return;
    }
    try {
      setCheckingOut(true);
      const callbackUrl = `${window.location.origin}/cart?payment=cart`;
      const result = await paystackService.initializeCartCheckout(callbackUrl);
      const url = result?.data?.authorization_url || result?.authorization_url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error('Failed to initialize payment.');
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to initialize payment.'));
      setCheckingOut(false);
    }
  };

  const syncBackendCart = async () => {
    const refreshedCart = await cartService.getCart();
    setCartFromBackend((refreshedCart.cart?.items || []).map(i => ({
      id: i.supplement.id.toString(),
      name: i.supplement.name,
      price: i.supplement.price,
      image: i.supplement.image || i.supplement.imageUrl || '',
      description: i.supplement.description,
      category: 'supplement',
      quantity: i.quantity
    })));
    await refetch();
  };

  const handleQuantityChange = async (item: any, nextQuantity: number) => {
    if (nextQuantity < 1) return;
    const itemId = item.id.toString();
    setUpdatingItemId(itemId);
    try {
      if (!isLoggedIn) {
        await updateCartQuantity(item.supplement.id.toString(), nextQuantity);
      } else {
        await cartService.updateCartItem(Number(item.id), nextQuantity);
        await syncBackendCart();
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update quantity.'));
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Show loading state
  if ((isLoggedIn && loading) || verifyingPayment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                <span className="text-lg text-gray-600">{verifyingPayment ? 'Confirming your payment...' : 'Loading your cart...'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state
  if (isLoggedIn && error) {
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
              <Button variant="outline" onClick={() => navigate('/marketplace')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show empty cart state
  if (!displayedCart || displayedCart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">Add some supplements to get started</p>
              <Button onClick={() => navigate('/marketplace')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate total from API cart
  const apiCartTotal = displayedCart.items.reduce((total, item) => {
    return total + (item.supplement.price * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={isLoggedIn ? refetch : undefined} size="sm" disabled={!isLoggedIn} className="w-fit">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="destructive" onClick={() => setShowClearConfirm(true)} size="sm" className="w-fit">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {displayedCart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 sm:p-5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                    <div className="h-24 w-24 shrink-0 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden sm:h-28 sm:w-28">
                      {item.supplement.image || item.supplement.imageUrl ? (
                        <img 
                          src={item.supplement.image || item.supplement.imageUrl} 
                          alt={item.supplement.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">IMG</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-semibold text-gray-900">{item.supplement.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-600">{item.supplement.description}</p>
                      <p className="text-lg font-bold text-emerald-600">₦{Number(item.supplement.price).toLocaleString()}</p>
                    </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        disabled={item.quantity <= 1 || updatingItemId === item.id.toString()}
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        aria-label="Reduce quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                        {updatingItemId === item.id.toString() ? <LoadingSpinner /> : item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        disabled={updatingItemId === item.id.toString()}
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total</p>
                      <p className="font-bold text-gray-900">₦{Number(item.supplement.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      disabled={removingItemId === item.id.toString()}
                      onClick={async () => {
                        const itemId = item.id.toString();
                        setRemovingItemId(itemId);
                        try {
                          if (!isLoggedIn) {
                            await removeFromCart(itemId);
                          } else {
                            await cartService.removeCartItem(Number(itemId));
                            await syncBackendCart();
                          }
                        } finally {
                          setRemovingItemId(null);
                        }
                      }}
                      title="Remove from cart"
                    >
                      {removingItemId === item.id.toString() ? <LoadingSpinner /> : <Trash2 className="h-5 w-5" />}
                    </Button>
                    </div>
                    </div>
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
                  <span>₦{apiCartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₦{apiCartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={handleCheckout} disabled={checkingOut}>
                  {checkingOut ? <LoadingSpinner className="mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                  {checkingOut ? 'Redirecting...' : 'Proceed to Checkout'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

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
              <Button variant="destructive" disabled={clearingCart} onClick={async () => {
                setClearingCart(true);
                try {
                  await clearCart();
                  if (isLoggedIn) {
                    await refetch();
                    setCartFromBackend([]);
                  }
                  setShowClearConfirm(false);
                  toast.success('Cart cleared!');
                } finally {
                  setClearingCart(false);
                }
              }}>
                {clearingCart && <LoadingSpinner className="mr-2" />}
                {clearingCart ? 'Clearing...' : 'Clear'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CartPage;
