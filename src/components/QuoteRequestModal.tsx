
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GenericQuoteForm from './GenericQuoteForm';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type QuoteRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
  isAdvanced?: boolean;
};

export function QuoteRequestModal({ 
  isOpen, 
  onClose, 
  productId, 
  productName,
  isAdvanced = false
}: QuoteRequestModalProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onClose();
    navigate('/auth/client');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
        </DialogHeader>
        
        {user ? (
          <GenericQuoteForm 
            isAdvanced={isAdvanced}
            productId={productId} 
            productName={productName} 
            onSuccess={onClose}
            onClose={onClose}
          />
        ) : (
          <div className="py-6 text-center">
            <p className="mb-6 text-gray-600">
              You need to be logged in to request a quote. Please sign in or create an account to continue.
            </p>
            <Button onClick={handleLoginRedirect} className="bg-brand-blue">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
