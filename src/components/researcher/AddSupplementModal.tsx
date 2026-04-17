import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface AddSupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  packId: string;
  onAdd: (supplement: any) => void;
}

export function AddSupplementModal({
  isOpen,
  onClose,
  packId,
  onAdd,
}: AddSupplementModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name && description) {
      const newSupplement = {
        id: `sup-${Date.now()}`,
        name,
        description,
        category: packId,
        imageUrl: `https://placehold.co/100x100/6E59A5/FFFFFF?text=${encodeURIComponent(
          name.substring(0, 5)
        )}`,
      };

      onAdd(newSupplement);
      toast({
        title: "Supplement added",
        description: `${name} has been added to ${packId} pack.`,
      });

      setName("");
      setDescription("");
      onClose();
      return;
    }

    toast({
      title: "Error",
      description: "Please fill in all fields.",
      variant: "destructive",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Supplement</DialogTitle>
          <DialogDescription>
            Create a new supplement for the {packId} pack.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Supplement Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter supplement name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-researcher-primary hover:bg-researcher-secondary"
            >
              Add Supplement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

