
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuoteRequestForm } from './QuoteRequestForm';

type QuoteRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
};

export function QuoteRequestModal({ 
  isOpen, 
  onClose, 
  productId, 
  productName 
}: QuoteRequestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
        </DialogHeader>
        <QuoteRequestForm 
          productId={productId} 
          productName={productName} 
          onSuccess={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
}
