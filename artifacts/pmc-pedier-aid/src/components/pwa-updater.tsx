import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export function PWAUpdater() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    if (needRefresh) {
      toast({
        title: "Update Available",
        description: "A new clinical version is available. Refresh now to update.",
        action: (
          <Button 
            variant="default" 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => updateServiceWorker(true)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Update Now
          </Button>
        ),
        duration: 0, // Persistent until acted upon
      });
    }

    if (offlineReady) {
      toast({
        title: "App Ready Offline",
        description: "Clinical guidelines are now available for offline use.",
        duration: 3000,
      });
    }
  }, [needRefresh, offlineReady, updateServiceWorker]);

  return null; // This component handles side-effects only
}
