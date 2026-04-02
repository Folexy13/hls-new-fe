import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { apiClient } from '@/config/axios';

const QuizPage = () => {
  const navigate = useNavigate();
  const [quizCode, setQuizCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateCode = async () => {
    if (!quizCode.trim()) {
      toast.error('Please enter your quiz code');
      return;
    }

    setIsValidating(true);

    try {
      const response = await apiClient.post('/api/v2/quiz-code/verify-benfek', {
        code: quizCode.trim(),
      });

      const data = response.data?.data;

      sessionStorage.setItem(
        'validatedQuizData',
        JSON.stringify({
          code: data?.code || quizCode.trim(),
          benfekName: data?.benfekName || '',
          benfekPhone: data?.benfekPhone || '',
          registrationStatus: data?.registrationStatus || '',
        })
      );

      toast.success('Code validated successfully');
      navigate('/benfek/quiz-form');
    } catch (error) {
      toast.error('Unable to validate code. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Start Your Health Quiz
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Enter the quiz code given by your principal to continue
          </p>
        </div>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Quiz Code Validation</CardTitle>
            <CardDescription>
              This helps us load your correct health assessment details.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="quizCode">Quiz Code</Label>
              <Input
                id="quizCode"
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value)}
                placeholder="Enter your quiz code"
                className="h-12 rounded-xl"
              />
            </div>

            <Button
              onClick={handleValidateCode}
              disabled={isValidating}
              className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
            >
              {isValidating ? 'Validating...' : 'Validate Code'}
              {!isValidating && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              If you do not have a code, please contact your principal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
