import React from 'react';
import { Button } from '@/components/ui/button';

interface DashboardModalContentProps {
  title: string;
  description: string;
  onBack: () => void;
  children?: React.ReactNode;
}

const DashboardModalContent: React.FC<DashboardModalContentProps> = ({ title, description, onBack, children }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
      <Button onClick={onBack} className="mt-4 w-full">Back to Dashboard</Button>
    </div>
  );
};

export default DashboardModalContent;
