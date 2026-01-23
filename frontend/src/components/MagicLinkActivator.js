import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import PremiumManager from '../utils/premiumManager';

const MagicLinkActivator = () => {
  const [searchParams] = useSearchParams();

  const handleMagicLink = useCallback(() => {
    const activationCode = searchParams.get('activate');
    
    if (activationCode) {
      const result = PremiumManager.activateMagicLink(activationCode);
      
      if (result.success) {
        // Show success toast
        toast.success('✅ Lifetime Premium Activated Successfully!', {
          description: 'Enjoy all premium features forever!',
          duration: 5000
        });
        
        // Remove the secret code from URL immediately for security
        window.history.replaceState({}, document.title, '/');
        
        // Force page reload to update premium state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    handleMagicLink();
  }, [handleMagicLink]);

  return null;
};

export default MagicLinkActivator;
