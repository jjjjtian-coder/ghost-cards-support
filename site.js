(function () {
  'use strict';
  const supported = ['zh-Hans', 'en'];
  const requested = new URLSearchParams(location.search).get('lang');
  const preferences = navigator.languages || [navigator.language || 'en'];
  const preferred = preferences.find(value => /^zh(?:-|$)|^en(?:-|$)/i.test(value)) || 'en';
  let language = supported.includes(requested) ? requested : (/^zh/i.test(preferred) ? 'zh-Hans' : 'en');
  function apply(next) {
    language = next;
    document.documentElement.dataset.language = next;
    document.documentElement.lang = next;
    document.querySelectorAll('[data-set-language]').forEach(link => {
      link.setAttribute('aria-current', String(link.dataset.setLanguage === next));
    });
    document.querySelectorAll('[data-page-link]').forEach(link => {
      const target = link.dataset.pageLink;
      link.setAttribute('href', target + '?lang=' + encodeURIComponent(next));
    });
    const page = document.body.dataset.page;
    document.title = next === 'zh-Hans' ? '抽鬼牌 · ' + (page === 'privacy' ? '隐私政策' : '支持')
      : 'Ghost Cards — ' + (page === 'privacy' ? 'Privacy Policy' : 'Support');
  }
  apply(language);
  document.querySelectorAll('[data-set-language]').forEach(link => link.addEventListener('click', function(event) {
    event.preventDefault();
    apply(link.dataset.setLanguage);
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    url.hash = '';
    history.replaceState(null, '', url);
  }));
}());
