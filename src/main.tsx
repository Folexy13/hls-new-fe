import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
    .catch(() => undefined);
}

if ('caches' in window) {
  caches.keys()
    .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    .catch(() => undefined);
}

createRoot(document.getElementById("root")!).render(<App />);
