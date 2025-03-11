import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpDialogProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function HelpDialog({ title, description, children }: HelpDialogProps) {
  return (
    <Dialog>
      <Button variant="ghost" size="icon" className="rounded-full">
        <HelpCircle className="h-5 w-5" />
      </Button>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
