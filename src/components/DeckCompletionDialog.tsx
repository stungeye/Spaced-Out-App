import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeckCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deckName: string;
}

const DeckCompletionDialog = ({
  isOpen,
  onClose,
  deckName,
}: DeckCompletionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogDescription>
            You have successfully completed the <strong>{deckName}</strong>{" "}
            deck!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>All cards have been moved to the "Retired" pile. Great job!</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeckCompletionDialog;
