#!/usr/bin/env python3
"""Phase 9: Add service workers for offline support to all 488 apps."""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

SW_JS = '''// Service Worker — Workshop-DIY
const CACHE_NAME = 'workshop-diy-v1';
const ASSETS = ['./', 'index.html', 'script.js', 'style.css', 'manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
'''

SW_REGISTER = """
// Service Worker Registration (skip on file://)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}
"""

created = 0

for app_dir in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*'))):
    if not os.path.isdir(app_dir):
        continue
    if not os.path.exists(os.path.join(app_dir, 'index.html')):
        continue

    # Create sw.js
    sw_path = os.path.join(app_dir, 'sw.js')
    if not os.path.exists(sw_path):
        with open(sw_path, 'w', encoding='utf-8') as f:
            f.write(SW_JS)

    # Add registration to script.js
    script_path = os.path.join(app_dir, 'script.js')
    if os.path.exists(script_path):
        with open(script_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'serviceWorker' not in content:
            content += SW_REGISTER
            with open(script_path, 'w', encoding='utf-8') as f:
                f.write(content)

    created += 1

print(f"✓ Added service workers to {created} apps")
