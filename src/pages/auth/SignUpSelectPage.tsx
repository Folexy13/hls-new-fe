import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SignUpSelectPage: React.FC = () => {
  const roles = [
    {
      name: 'Benfek',
      description: 'Customer account - requires quiz code from your principal',
      icon: '👤',
      path: '/assessment', // Redirect to assessment first, then to signup after completion
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      hoverColor: 'hover:border-emerald-500',
      textColor: 'text-emerald-600',
      note: 'You will need a quiz code'
    },
    {
      name: 'Principal',
      description: 'Admin account to manage the platform, users, and products',
      icon: '👔',
      path: '/auth/signup/principal',
      color: 'blue',
      bgColor: 'bg-blue-100',
      hoverColor: 'hover:border-blue-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'Wholesaler',
      description: 'Seller account to list and sell products on the platform',
      icon: '🏪',
      path: '/auth/signup/wholesaler',
      color: 'purple',
      bgColor: 'bg-purple-100',
      hoverColor: 'hover:border-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8 lg:py-4">
      <div className="w-full max-w-2xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>Choose your account type to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {roles.map((role) => (
                <Link
                  key={role.name}
                  to={role.path}
                  className={`block p-6 border-2 rounded-lg transition-all ${role.hoverColor} hover:shadow-md relative`}
                >
                  <div className="text-center">
                    <div className={`mx-auto mb-4 w-16 h-16 ${role.bgColor} rounded-full flex items-center justify-center`}>
                      <span className="text-3xl">{role.icon}</span>
                    </div>
                    <h3 className={`font-semibold text-lg mb-2 ${role.textColor}`}>{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                    {'note' in role && role.note && (
                      <p className="text-xs text-amber-600 mt-2 font-medium">⚠️ {role.note}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6 space-y-2">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/auth/signin" className="text-emerald-600 hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpSelectPage;
