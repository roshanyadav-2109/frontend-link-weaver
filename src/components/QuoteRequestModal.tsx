
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuoteRequestForm } from './QuoteRequestForm';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onClose();
    navigate('/auth/client');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Request a Quote</DialogTitle>
        </DialogHeader>
        
        {isAuthenticated ? (
          <QuoteRequestForm 
            productId={productId} 
            productName={productName} 
            onSuccess={onClose} 
            userId={user?.id}
          />
        ) : (
          <div className="py-4 sm:py-6 text-center px-2">
            <p className="mb-4 sm:mb-6 text-gray-600 text-sm sm:text-base">
              You need to be logged in to request a quote. Please sign in or create an account to continue.
            </p>
            <Button onClick={handleLoginRedirect} className="bg-brand-blue w-full sm:w-auto">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
