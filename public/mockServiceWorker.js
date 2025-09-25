// Placeholder service worker file to prevent 404s in environments
// where MSW's generated worker is not present. This file is intentionally
// minimal and does not implement any fetch interception logic.
// If you need full MSW features, run: npx msw init public/ --save
self.addEventListener('install', () => self.skipWaiting && self.skipWaiting())
self.addEventListener('activate', (event) => {
  if (self.clients && self.clients.claim) {
    event.waitUntil(self.clients.claim())
  }
})


