import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, Heart, Activity, Pill, ArrowRight } from 'lucide-react';

const QuizPage = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Assessment Quiz</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete our comprehensive health assessment to receive personalized supplement recommendations tailored to your unique needs.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Tell us about yourself - age, gender, height, weight, and more.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Lifestyle Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share your daily routines, activities, and lifestyle preferences.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Pill className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Supplement Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Let us know your preferred supplement forms and budget range.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA Card */}
        <Card className="max-w-lg mx-auto shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Begin?</CardTitle>
            <CardDescription className="text-base">
              The assessment takes about 5 minutes to complete. You'll need your unique quiz code provided by your principal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">What you'll need:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your unique quiz code from your principal</li>
                <li>• About 5 minutes of your time</li>
                <li>• Basic health information (height, weight, etc.)</li>
              </ul>
            </div>
            
            <Button onClick={handleStartQuiz} className="w-full" size="lg">
              Begin Assessment
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <p className="text-xs text-center text-gray-500">
              Don't have a quiz code? Contact your principal to get one.
            </p>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Take the Assessment?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-3 text-left p-4 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">Personalized Recommendations</h3>
                <p className="text-sm text-gray-600">Get supplement suggestions tailored to your unique health profile.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-left p-4 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold">Science-Based Approach</h3>
                <p className="text-sm text-gray-600">Our recommendations are based on your lifestyle and health goals.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-left p-4 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Budget-Friendly Options</h3>
                <p className="text-sm text-gray-600">We consider your budget to suggest affordable supplements.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-left p-4 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold">Easy to Complete</h3>
                <p className="text-sm text-gray-600">Simple questions that take just 5 minutes to answer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
