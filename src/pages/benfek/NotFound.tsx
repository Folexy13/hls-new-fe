
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 text-6xl font-bold text-emerald-600">404</div>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" onClick={() => window.history.back()}>
              <span className="flex items-center gap-2 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </span>
            </Button>
          </div>
          <div className="text-sm text-gray-600 mt-4">
            If you believe this is an error, please{' '}
            <Link to="/support" className="text-emerald-600 hover:underline">
              contact support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
