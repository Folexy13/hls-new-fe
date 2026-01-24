import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import { validatePassword, validateEmail, passwordsMatch, getPasswordStrength, getPasswordStrengthColor } from '../../utils/validation';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const SignUpBenfekPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const quizCode = searchParams.get('code');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValidation, setPasswordValidation] = useState<{ isValid: boolean; errors: string[] }>({ isValid: false, errors: [] });
  const navigate = useNavigate();

  // Redirect to assessment if no quiz code
  useEffect(() => {
    if (!quizCode) {
      toast.warning('Please complete the assessment first to get a quiz code');
      navigate('/assessment');
    }
  }, [quizCode, navigate]);

  // Validate password on change
  useEffect(() => {
    if (formData.password) {
      setPasswordValidation(validatePassword(formData.password));
    } else {
      setPasswordValidation({ isValid: false, errors: [] });
    }
  }, [formData.password]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: 'benfek',
      });
      
      toast.success('Account created successfully! Please sign in.');
      navigate('/auth/signin');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; error?: { details?: Array<{ message: string }> } } } };
      const errorMessage = err.response?.data?.error?.details?.[0]?.message 
        || err.response?.data?.message 
        || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColor = getPasswordStrengthColor(passwordStrength);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8 lg:py-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <CardTitle>Sign Up as Benfek</CardTitle>
            <CardDescription>Create your customer account to access health products</CardDescription>
            {quizCode && (
              <div className="mt-2 text-sm text-emerald-600 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Quiz code verified: {quizCode}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({...formData, firstName: e.target.value});
                      if (errors.firstName) setErrors({...errors, firstName: ''});
                    }}
                    placeholder="First name"
                    disabled={isLoading}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({...formData, lastName: e.target.value});
                      if (errors.lastName) setErrors({...errors, lastName: ''});
                    }}
                    placeholder="Last name"
                    disabled={isLoading}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
                  placeholder="Create a password"
                  disabled={isLoading}
                  className={errors.password ? 'border-red-500' : ''}
                />
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                            passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                            'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${strengthColor}`}>
                        {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                      </span>
                    </div>
                    
                    {/* Password requirements checklist */}
                    <div className="text-xs space-y-1">
                      <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                        {formData.password.length >= 8 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[A-Z]/.test(formData.password) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[a-z]/.test(formData.password) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[0-9]/.test(formData.password) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        One number
                      </div>
                      <div className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        One special character
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({...formData, confirmPassword: e.target.value});
                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                  }}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {formData.confirmPassword && (
                  <div className={`text-xs mt-1 flex items-center gap-1 ${
                    passwordsMatch(formData.password, formData.confirmPassword) ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {passwordsMatch(formData.password, formData.confirmPassword) ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Passwords do not match
                      </>
                    )}
                  </div>
                )}
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700" 
                disabled={isLoading || !passwordValidation.isValid}
              >
                {isLoading ? 'Creating Account...' : 'Create Benfek Account'}
              </Button>
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/auth/signin" className="text-emerald-600 hover:underline">
                    Sign in
                  </Link>
                </div>
                <div className="text-sm text-gray-600">
                  Want a different account type?{' '}
                  <Link to="/auth/signup" className="text-emerald-600 hover:underline">
                    Choose role
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpBenfekPage;
