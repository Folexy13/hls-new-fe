import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/config/axios';

interface QuizCodeResponse {
  code?: string;
  benfekName?: string;
  benfekPhone?: string;
  principalName?: string;
}

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  const [quizCode, setQuizCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [quizData, setQuizData] = useState<QuizCodeResponse | null>(null);

  const handleValidateCode = async () => {
    if (!quizCode.trim()) {
      setErrorMessage('Please enter a quiz code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setIsValidated(false);
    setQuizData(null);

    try {
      const response = await apiClient.post('/api/v2/quiz-code/validate', {
        code: quizCode.trim(),
      });

      const data = response.data?.data;
      const quizCodeData = data?.quizCode;

      setQuizData({
        code: quizCodeData?.code || quizCode,
        benfekName: quizCodeData?.benfekName || '',
        benfekPhone: quizCodeData?.benfekPhone || '',
        principalName: quizCodeData?.createdBy
          ? `${quizCodeData.createdBy.firstName} ${quizCodeData.createdBy.lastName}`.trim()
          : '',
      });

      setIsValidated(true);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || 'Invalid quiz code. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = () => {
    if (!quizData) return;

    // Save validated quiz details temporarily
    sessionStorage.setItem('validatedQuizCode', quizData.code || '');
    sessionStorage.setItem('validatedBenfekName', quizData.benfekName || '');
    sessionStorage.setItem('validatedBenfekPhone', quizData.benfekPhone || '');

    // Move to next step
    navigate('/auth/signup/researcher');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-8 bg-white border-b text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">Validate Quiz Code</h1>
            <p className="text-sm text-gray-500 mt-2">
              Enter the quiz code given by your principal to continue
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quiz Code</label>
              <Input
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value)}
                placeholder="Enter your quiz code"
                className="h-11 rounded-xl"
              />
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isValidated && quizData && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  <span>Quiz code validated successfully</span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Name:</span>{' '}
                    {quizData.benfekName || 'Not available'}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{' '}
                    {quizData.benfekPhone || 'Not available'}
                  </p>
                  {quizData.principalName && (
                    <p>
                      <span className="font-semibold">Principal:</span>{' '}
                      {quizData.principalName}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleValidateCode}
                disabled={isLoading}
                className="w-full h-11 rounded-xl"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating...
                  </span>
                ) : (
                  'Validate Code'
                )}
              </Button>

              {isValidated && (
                <Button
                  variant="outline"
                  onClick={handleProceed}
                  className="w-full h-11 rounded-xl"
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPage;


