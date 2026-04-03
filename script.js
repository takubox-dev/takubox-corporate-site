// ヘッダースクロール
window.addEventListener('scroll', function() {
  document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 10);
});

// モバイルナビ
document.getElementById('nav-toggle').addEventListener('click', function() {
  var nav = document.getElementById('nav');
  var header = document.querySelector('.header');
  nav.classList.toggle('active');
  header.classList.toggle('nav-open');
});

document.querySelectorAll('#nav a').forEach(function(link) {
  link.addEventListener('click', function() {
    document.getElementById('nav').classList.remove('active');
    document.querySelector('.header').classList.remove('nav-open');
  });
});

// 手書きアニメーション
(function() {
  var lines = document.querySelectorAll('[data-handwrite]');
  if (!lines.length) return;
  var delay = 800; // 開始までの待ち時間(ms)
  var charInterval = 80; // 1文字あたりの間隔(ms)

  lines.forEach(function(line) {
    var text = line.textContent;
    line.textContent = '';
    var chars = text.split('');
    chars.forEach(function(char) {
      var span = document.createElement('span');
      span.textContent = char;
      line.appendChild(span);
    });

    var spans = line.querySelectorAll('span');
    spans.forEach(function(span, i) {
      setTimeout(function() {
        span.style.animation = 'penReveal 0.3s ease forwards';
        // ラメエフェクト
        span.style.position = 'relative';
        var count = 5 + Math.floor(Math.random() * 5);
        for (var p = 0; p < count; p++) {
          (function(idx) {
            setTimeout(function() {
              var particle = document.createElement('div');
              particle.className = 'glitter-particle';
              var dx = (Math.random() - 0.5) * 30;
              var dy = (Math.random() - 0.5) * 30 - 10;
              particle.style.setProperty('--dx', dx + 'px');
              particle.style.setProperty('--dy', dy + 'px');
              particle.style.left = (Math.random() * 100) + '%';
              particle.style.top = (Math.random() * 100) + '%';
              var size = 2 + Math.random() * 3;
              particle.style.width = size + 'px';
              particle.style.height = size + 'px';
              span.appendChild(particle);
              setTimeout(function() { particle.remove(); }, 800);
            }, idx * 40);
          })(p);
        }
      }, delay + i * charInterval);
    });

    delay += chars.length * charInterval + 300; // 次の行の前に少し間を空ける
  });
})();

// Fixed CTA bar (top / product pages)
(function() {
  var cta = document.getElementById('siteFixedCta');
  if (!cta) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      cta.classList.add('visible');
    } else {
      cta.classList.remove('visible');
    }
  });
})();

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
