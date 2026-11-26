/* FOR-e Calendar V2 PWA 1-3fc */
(() => {
  'use strict';
  const VERSION = '1-3fc';
  let installPrompt = null;
  let registration = null;
  let reloadOnControllerChange = false;
  let installButton = null;

  const standalone = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const ios = () => {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    return /iPad|iPhone|iPod/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };
  const android = () => /Android/i.test(navigator.userAgent || '');

  function showGuide() {
    document.querySelector('.for-e-pwa-guide-backdrop')?.remove();
    const layer = document.createElement('div');
    layer.className = 'for-e-pwa-guide-backdrop';
    layer.innerHTML = `
      <section class="for-e-pwa-guide-card" role="dialog" aria-modal="true" aria-labelledby="forEPwaGuideTitle">
        <button type="button" class="for-e-pwa-guide-close" aria-label="關閉">×</button>
        <div class="for-e-pwa-guide-mark">FOR-e</div>
        <h2 id="forEPwaGuideTitle">將 FOR-e 加入主畫面</h2>
        <p>安裝後可從手機主畫面直接開啟，以 APP 全螢幕方式使用。</p>
        ${ios() ? '<ol><li>請使用 Safari 開啟 FOR-e。</li><li>點選 Safari 的分享圖示。</li><li>選擇「加入主畫面」。</li><li>確認名稱 FOR-e，按「新增」。</li></ol>' : '<ol><li>使用 Chrome 或 Edge 開啟 FOR-e。</li><li>開啟瀏覽器選單，選擇「安裝應用程式」或「新增至主畫面」。</li><li>確認安裝 FOR-e。</li></ol>'}
        <p class="for-e-pwa-guide-note">PWA 仍保留 FOR-e 原本的「電腦版檢視／切回手機版」按鈕，不會鎖定版型。</p>
        <button type="button" class="for-e-pwa-guide-primary">知道了</button>
      </section>`;
    const close = () => layer.remove();
    layer.addEventListener('click', e => { if (e.target === layer) close(); });
    layer.querySelector('.for-e-pwa-guide-close').addEventListener('click', close);
    layer.querySelector('.for-e-pwa-guide-primary').addEventListener('click', close);
    document.body.appendChild(layer);
  }

  async function install() {
    if (!installPrompt) return showGuide();
    const prompt = installPrompt;
    installPrompt = null;
    try { await prompt.prompt(); await prompt.userChoice; }
    catch (error) { console.warn('FOR-e PWA install prompt:', error); }
    refreshButton();
  }

  function hostElement() {
    const desktop = document.body.classList.contains('force-desktop-mode');
    const mobile = matchMedia('(max-width: 768px)').matches;
    if (mobile && !desktop) return document.querySelector('.mobile-header');
    return document.querySelector('.topbar-actions') || document.querySelector('.mobile-header');
  }

  function refreshButton() {
    if (standalone()) {
      installButton?.remove();
      installButton = null;
      return;
    }
    if (!(installPrompt || ios() || android())) return;
    const host = hostElement();
    if (!host) return;
    if (!installButton) {
      installButton = document.createElement('button');
      installButton.type = 'button';
      installButton.id = 'forEPwaInstallBtn';
      installButton.className = 'for-e-pwa-install-btn';
      installButton.addEventListener('click', install);
    }
    const label = installPrompt ? '安裝 FOR-e' : (ios() ? '安裝教學' : '安裝方式');
    if (installButton.textContent !== label) installButton.textContent = label;
    if (installButton.parentElement !== host) {
      const before = host.querySelector('#desktopViewToggleBtn, #logoutBtn');
      host.insertBefore(installButton, before || null);
    }
  }

  function showUpdate(reg) {
    if (!reg?.waiting || !navigator.serviceWorker?.controller || document.querySelector('.for-e-pwa-update-toast')) return;
    const toast = document.createElement('div');
    toast.className = 'for-e-pwa-update-toast';
    toast.innerHTML = '<div class="for-e-pwa-update-copy"><strong>FOR-e 有新版可以更新</strong><span>請先儲存目前正在編輯的資料，再更新系統。</span></div><button type="button" class="for-e-pwa-update-action">儲存後更新</button><button type="button" class="for-e-pwa-update-dismiss" aria-label="稍後更新">×</button>';
    toast.querySelector('.for-e-pwa-update-dismiss').addEventListener('click', () => toast.remove());
    toast.querySelector('.for-e-pwa-update-action').addEventListener('click', () => {
      if (!reg.waiting) return;
      reloadOnControllerChange = true;
      reg.waiting.postMessage({type:'FOR_E_PWA_SKIP_WAITING'});
    });
    document.body.appendChild(toast);
  }

  async function registerWorker() {
    if (!('serviceWorker' in navigator) || (!isSecureContext && location.hostname !== 'localhost')) return;
    try {
      registration = await navigator.serviceWorker.register('/service-worker.js', {scope:'/', updateViaCache:'none'});
      if (registration.waiting && navigator.serviceWorker.controller) showUpdate(registration);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(registration);
        });
      });
      registration.update().catch(() => {});
    } catch (error) {
      console.warn('FOR-e PWA registration failed; web app remains available.', error);
    }
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    refreshButton();
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    installButton?.remove();
    installButton = null;
  });
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (reloadOnControllerChange) {
      reloadOnControllerChange = false;
      location.reload();
    }
  });

  const observer = new MutationObserver(refreshButton);
  function startObserver() {
    observer.observe(document.body, {childList:true, subtree:true});
    refreshButton();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startObserver, {once:true});
  else startObserver();
  window.addEventListener('resize', refreshButton, {passive:true});
  window.addEventListener('orientationchange', refreshButton, {passive:true});
  window.addEventListener('load', registerWorker, {once:true});
  window.FOR_E_PWA = Object.freeze({version:VERSION, isInstalled:standalone, refreshInstallButton:refreshButton});
})();
