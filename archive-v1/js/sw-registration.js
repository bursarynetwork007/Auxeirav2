function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('[SW] Registration successful with scope: ', registration.scope);
        })
        .catch(function(error) {
          console.log('[SW] Registration failed: ', error);
          
          if (error.message.includes('404')) {
            console.log('[SW] Service worker file not found. Check file exists.');
          } else if (error.message.includes('403')) {
            console.log('[SW] Access denied. Check file permissions.');
          }
        });
    });
  }
}

// Check if sw.js exists before registering
function checkServiceWorkerExists() {
  fetch('/sw.js', { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        registerServiceWorker();
      } else {
        console.log('[SW] Service worker file not accessible');
      }
    })
    .catch(error => {
      console.log('[SW] Cannot check service worker file');
    });
}

document.addEventListener('DOMContentLoaded', function() {
  checkServiceWorkerExists();
});
