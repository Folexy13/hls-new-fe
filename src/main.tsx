import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const clearLegacyBrowserCaches = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(async (registration) => {
          await registration.update().catch(() => undefined);
          await registration.unregister();
        })
      );
    } catch {
      // Cache cleanup is best-effort; the app should still render if it fails.
    }
  }

  if ('caches' in window) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch {
      // Ignore browser cache API failures.
    }
  }
};

clearLegacyBrowserCaches().finally(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
