import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useStore } from '../store/useStore';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { tokenManager } from '@/utils/tokenManager';
import { getApiErrorMessage } from '@/utils/apiError';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const SignInPage = () => {
  const location = useLocation();
  const signInState = location.state as
    | { prefill?: { email?: string; password?: string }; from?: { pathname?: string } }
    | null;
  const [email, setEmail] = useState(signInState?.prefill?.email ?? '');
  const [password, setPassword] = useState(signInState?.prefill?.password ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const { login, isAuthenticated, user } = useStore();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      // Check if there's a callback redirect for an external app (like Researcher App)
      const queryParams = new URLSearchParams(location.search);
      const callback = queryParams.get('callback');
      const token = tokenManager.getAccessToken();

      if (callback && token) {
        window.location.href = `${callback}?token=${token}`;
        return;
      }

      const role = String(user.role ?? '').toLowerCase();
      let redirectPath = '/dashboard';
      switch (role) {
        case 'benfek':
          redirectPath = '/benfek/dashboard';
          break;
        case 'principal':
          redirectPath = '/principal';
          break;
        case 'wholesaler':
          redirectPath = '/wholesaler';
          break;
        case 'researcher':
          redirectPath = '/researcher';
          break;
        default:
          redirectPath = '/benfek/dashboard';
      }
      // Use window.location for a hard redirect to ensure URL changes
      window.location.href = redirectPath;
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationMessage('');
    
    if (!email || !password) {
      setValidationMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const user = {
        id: response.user.id,
        email: response.user.email,
        name: `${response.user.firstName} ${response.user.lastName}`,
        role: String(response.user.role ?? '').toLowerCase(),
        isAuthenticated: true,
      };

      login(user, response.tokens.accessToken, response.tokens.refreshToken);
      toast.success('Successfully signed in!');
      
      // Handle external app callback after successful login
      const queryParams = new URLSearchParams(location.search);
      const callback = queryParams.get('callback');
      if (callback) {
        window.location.href = `${callback}?token=${response.tokens.accessToken}`;
        return;
      }

      // Role-based routing
      const role = String(response.user.role ?? '').toLowerCase();
      let redirectPath = '/dashboard'; // default fallback
      switch (role) {
        case 'benfek':
          redirectPath = '/benfek/dashboard';
          break;
        case 'principal':
          redirectPath = '/principal';
          break;
        case 'wholesaler':
          redirectPath = '/wholesaler';
          break;
        case 'researcher':
          redirectPath = '/researcher';
          break;
        default:
          redirectPath = '/benfek/dashboard';
      }
      
      const from = location.state?.from?.pathname || redirectPath;
      navigate(from, { replace: true });
    } catch (error) {
      setValidationMessage(getApiErrorMessage(error, 'Unable to sign in. Please try again.'));
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationMessage) setValidationMessage('');
              }}
              placeholder="Enter your email"
              disabled={isLoading}
              aria-invalid={Boolean(validationMessage)}
              aria-describedby={validationMessage ? 'signin-validation-message' : undefined}
              className={validationMessage ? 'border-red-500 focus-visible:ring-red-500' : undefined}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationMessage) setValidationMessage('');
                }}
                placeholder="Enter your password"
                disabled={isLoading}
                aria-invalid={Boolean(validationMessage)}
                aria-describedby={validationMessage ? 'signin-validation-message' : undefined}
                className={validationMessage ? 'border-red-500 pr-10 focus-visible:ring-red-500' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {validationMessage && (
            <div
              id="signin-validation-message"
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
            >
              {validationMessage}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <LoadingSpinner className="mr-2" />}
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      toast.error(getApiErrorMessage(error, 'Registration failed. Please try again.'));
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Create a password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <LoadingSpinner className="mr-2" />}
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await authService.forgotPassword(email);
      toast.success(response.message || 'Password reset link sent to your email!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <LoadingSpinner className="mr-2" />}
            {isLoading ? 'Sending...' : 'Send Reset Link'}
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

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      navigate('/auth/signin');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.resetPassword(token!, password);
      
      // The backend returns a fresh set of tokens if successful, we can log them in
      login(response.tokens.accessToken, response.tokens.refreshToken, response.user);
      
      toast.success('Password reset successful!');
      
      // Route them to correct dashboard based on role
      const role = response.user.role;
      if (role === 'benfek') navigate('/dashboard');
      else if (role === 'principal') navigate('/principal');
      else if (role === 'researcher') navigate('/researcher');
      else navigate('/');
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set New Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <LoadingSpinner className="mr-2" />}
            {isLoading ? 'Resetting...' : 'Reset Password'}
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8 lg:py-4">
      <div className="w-full max-w-md">
        <Routes>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default AuthPage;
