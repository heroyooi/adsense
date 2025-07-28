let isInterstitialAdActive = false;

function getRedirectUrl() {
  return window.redirectTarget || 'https://www.megagong.net';
}

function isInterstitialAd(el) {
  return (
    el &&
    ((el.tagName === 'IFRAME' && el.src.includes('google')) ||
      (el.classList && el.classList.contains('adsbygoogle-interstitial')))
  );
}

function isBlurBackground(el) {
  return el && el.classList && el.classList.contains('blur-background');
}

function isAdsenseAd(el) {
  if (el && el.tagName === 'INS' && el.src?.includes('pub-')) {
    return true;
  }
  if (
    el &&
    el.tagName === 'IFRAME' &&
    el.getAttribute('src')?.includes('google')
  ) {
    return true;
  }
  return false;
}

function addClickCount() {
  let count = parseInt(localStorage.getItem('adsenseClickCount') || '0');

  if (count <= 2) {
    count++;
    localStorage.setItem('adsenseClickCount', count.toString());
  }

  if (count > 2) {
    const confirmResult = confirm(
      `애드센스 연속 클릭 3회 진행하셨기에 무효트래픽 공격으로 간주하여 IP 추적 진행합니다. 
악의적인 광고 클릭 멈추시겠습니까?`
    );

    // 사용자가 확인하지 않으면 특정 페이지로 리다이렉트
    if (!confirmResult) {
      const redirectTarget = getRedirectUrl();
      setTimeout(() => {
        window.location.href = redirectTarget;
      }, 100);
    }

    // 클릭 카운트 초기화
    localStorage.setItem('adsenseClickCount', '0');
  }
}

window.addEventListener('focus', () => {
  const el = document.activeElement;
  isInterstitialAdActive = isInterstitialAd(el);
});

window.addEventListener('blur', () => {
  const el = document.activeElement;

  if (isInterstitialAdActive || isBlurBackground(el)) return;

  if (isAdsenseAd(el)) {
    if (!window.location.href.includes('#google_vignette')) {
      addClickCount();
    }

    setTimeout(() => el.blur(), 1);
  }
});
