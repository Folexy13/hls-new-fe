
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'react-toastify';
import PersonalInfoSection from './quiz/PersonalInfoSection';
import LifestyleSection from './quiz/LifestyleSection';
import PreferenceSection from './quiz/PreferenceSection';

interface QuizFormProps {
  onComplete: (data: any) => void;
}

interface QuizData {
  personalInfo: {
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    height: number;
    weight: number;
    activityLevel: string;
    healthGoals: string[];
    medicalConditions: string[];
  };
  lifestyle: {
    sleepHours: number;
    stressLevel: string;
    dietType: string;
    habits: string; // comma-separated
    fun: string; // comma-separated
    routine: string; // comma-separated
  };
  preference: {
    supplementPreference: string[];
    budgetRange: string;
    deliveryFrequency: string;
    drugForm: string; // comma-separated
    allergies: string[];
  };
}

const QuizForm: React.FC<QuizFormProps> = ({ onComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({
    personalInfo: {
      name: '',
      age: 0,
      gender: 'male',
      height: 0,
      weight: 0,
      activityLevel: '',
      healthGoals: [],
      medicalConditions: []
    },
    lifestyle: {
      sleepHours: 0,
      stressLevel: '',
      dietType: '',
      habits: '',
      fun: '',
      routine: ''
    },
    preference: {
      supplementPreference: [],
      budgetRange: '',
      deliveryFrequency: '',
      drugForm: '',
      allergies: []
    }
  });

  const sections = [
    { title: 'Personal Information', component: PersonalInfoSection },
    { title: 'Lifestyle', component: LifestyleSection },
    { title: 'Preferences', component: PreferenceSection }
  ];

  const handleSectionComplete = (sectionData: any) => {
    const sectionKeys = ['personalInfo', 'lifestyle', 'preference'];
    const updatedData = {
      ...quizData,
      [sectionKeys[currentSection]]: sectionData
    };
    setQuizData(updatedData);

    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      toast.success('Section completed! Moving to next section.');
    } else {
      // Quiz completed
      onComplete(updatedData);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Assessment Quiz</h1>
          <div className="flex justify-center space-x-4 mb-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  index === currentSection
                    ? 'bg-blue-600 text-white'
                    : index < currentSection
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {section.title}
              </div>
            ))}
          </div>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              Section {currentSection + 1}: {sections[currentSection].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <CurrentSectionComponent
                data={Object.values(quizData)[currentSection]}
                onComplete={handleSectionComplete}
                onPrevious={currentSection > 0 ? handlePrevious : undefined}
                isLastSection={currentSection === sections.length - 1}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizForm;
