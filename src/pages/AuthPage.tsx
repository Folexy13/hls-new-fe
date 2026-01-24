import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useStore } from '../store/useStore';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import SignUpSelectPage from './auth/SignUpSelectPage';
import SignUpBenfekPage from './auth/SignUpBenfekPage';
import SignUpPrincipalPage from './auth/SignUpPrincipalPage';
import SignUpWholesalerPage from './auth/SignUpWholesalerPage';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const user = {
        id: response.user.id,
        email: response.user.email,
        name: `${response.user.firstName} ${response.user.lastName}`,
        role: response.user.role,
        isAuthenticated: true,
      };

      login(user, response.tokens.accessToken, response.tokens.refreshToken);
      toast.success('Successfully signed in!');
      
      // Role-based routing
      let redirectPath = '/dashboard'; // default fallback
      switch (response.user.role) {
        case 'benfek':
          redirectPath = '/benfek/dashboard';
          break;
        case 'principal':
          redirectPath = '/principal';
          break;
        case 'wholesaler':
          redirectPath = '/wholesaler';
          break;
        default:
          redirectPath = '/benfek/dashboard';
      }
      
      const from = location.state?.from?.pathname || redirectPath;
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error)
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your HLS account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          <div className="text-center space-y-2">
            <Link to="/auth/forgot-password" className="text-sm text-emerald-600 hover:underline">
              Forgot your password?
            </Link>
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="text-emerald-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!Object.values(formData).every(value => value)) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      toast.success('Account created successfully! Please sign in.');
      navigate('/auth/signin');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your HLS account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="First name"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Create a password"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/signin" className="text-emerald-600 hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Password reset link sent to your email!');
    } else {
      toast.error('Please enter your email address');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your email to receive a reset link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
          <div className="text-center">
            <Link to="/auth/signin" className="text-sm text-emerald-600 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const AuthPage = () => {
  return (
    <Routes>
      <Route path="signin" element={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8 lg:py-4">
          <div className="w-full max-w-md">
            <SignInPage />
          </div>
        </div>
      } />
      <Route path="signup" element={<SignUpSelectPage />} />
      <Route path="signup/benfek" element={<SignUpBenfekPage />} />
      <Route path="signup/principal" element={<SignUpPrincipalPage />} />
      <Route path="signup/wholesaler" element={<SignUpWholesalerPage />} />
      <Route path="forgot-password" element={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8 lg:py-4">
          <div className="w-full max-w-md">
            <ForgotPasswordPage />
          </div>
        </div>
      } />
    </Routes>
  );
};

export default AuthPage;
