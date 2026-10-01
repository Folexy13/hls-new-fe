import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { authService } from '@/services/authService';
import { useStore } from '@/store/useStore';
import { getApiErrorMessage } from '@/utils/apiError';
import { tokenManager } from '@/utils/tokenManager';

type DeleteAccountPanelProps = {
  roleLabel: string;
  note?: string;
  className?: string;
};

const DeleteAccountPanel: React.FC<DeleteAccountPanelProps> = ({ roleLabel, note, className = '' }) => {
  const logout = useStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setConfirmation('');
  };

  const closeDialog = () => {
    if (isDeleting) return;
    setOpen(false);
    resetForm();
  };

  const deleteDisabled = isDeleting || !currentPassword || confirmation !== 'DELETE';

  const handleDelete = async () => {
    if (deleteDisabled) return;

    setIsDeleting(true);
    try {
      await authService.deleteAccount({ currentPassword, confirmation });
      toast.success('Your account has been deleted.');
      tokenManager.clearTokens();
      logout();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete account'));
      setIsDeleting(false);
    }
  };

  return (
    <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-red-950">Delete Account</h3>
            <p className="mt-1 text-sm text-red-800">
              Permanently delete this {roleLabel} account and remove access to its dashboard.
            </p>
            <p className="mt-1 text-sm text-red-800">
              {note || 'Payment and transaction records will be retained for history.'}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={() => setOpen(true)}
          className="shrink-0"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : closeDialog())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action is permanent. Payment and transaction records may be retained for history.
              Enter your current password and type DELETE to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="delete-account-password">Current Password</Label>
              <Input
                id="delete-account-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                disabled={isDeleting}
                autoComplete="current-password"
              />
            </div>
            <div>
              <Label htmlFor="delete-account-confirmation">Type DELETE</Label>
              <Input
                id="delete-account-confirmation"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                disabled={isDeleting}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isDeleting}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteDisabled}>
              {isDeleting && <LoadingSpinner className="mr-2" />}
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteAccountPanel;
