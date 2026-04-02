// ヘッダースクロール
window.addEventListener('scroll', function() {
  document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 10);
});

// モバイルナビ
document.getElementById('nav-toggle').addEventListener('click', function() {
  document.getElementById('nav').classList.toggle('active');
});

document.querySelectorAll('#nav a').forEach(function(link) {
  link.addEventListener('click', function() {
    document.getElementById('nav').classList.remove('active');
  });
});

// スクロールフェードイン
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product-hero, .product-features, .feature, .about-block, .topic-item, .company-table-wrapper, .contact-block').forEach(function(el) {
  el.classList.add('fade-up');
  observer.observe(el);
});
