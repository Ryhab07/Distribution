import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function DeleteModal({ msg, onDelete, onCancel }) {
  return (
    <Dialog open={true} onOpenChange={() => {}} >
      {/* Modal */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>{msg}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Retour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteModal;
