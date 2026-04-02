import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type BackToDashboardButtonProps = {
  isDirty?: boolean;
  className?: string;
};

const BackToDashboardButton: React.FC<BackToDashboardButtonProps> = ({
  isDirty = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleBack = () => {
    if (isDirty) {
      setOpen(true);
      return;
    }
    navigate('/principal');
  };

  return (
    <>
      <button
        type="button"
        onClick={handleBack}
        className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 ${className}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/principal')}>
              Leave page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BackToDashboardButton;
