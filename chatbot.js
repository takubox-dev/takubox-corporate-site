(function() {
  var API_URL = 'https://inpt2ko4lb.execute-api.ap-northeast-1.amazonaws.com/chat';
  var sessionId = 'web_' + Date.now() + '_' + Math.random().toString(36).slice(2);

  // スタイル
  var style = document.createElement('style');
  style.textContent = `
    .cb-btn { position:fixed; bottom:24px; right:24px; width:60px; height:60px; border-radius:50%; background:#1a3a5c; color:#fff; border:none; cursor:pointer; font-size:28px; box-shadow:0 4px 16px rgba(0,0,0,0.2); z-index:9998; transition:transform 0.2s; }
    .cb-btn:hover { transform:scale(1.1); }
    .cb-box { position:fixed; bottom:96px; right:24px; width:360px; max-height:500px; background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.15); z-index:9999; display:none; flex-direction:column; overflow:hidden; font-family:'Noto Sans JP',sans-serif; }
    .cb-box.open { display:flex; }
    .cb-hdr { background:#1a3a5c; color:#fff; padding:16px; font-size:15px; font-weight:700; display:flex; justify-content:space-between; align-items:center; }
    .cb-hdr button { background:none; border:none; color:#fff; font-size:20px; cursor:pointer; }
    .cb-msgs { flex:1; overflow-y:auto; padding:16px; max-height:320px; }
    .cb-msg { margin-bottom:12px; font-size:14px; line-height:1.7; }
    .cb-msg.bot { background:#f0f2f5; padding:10px 14px; border-radius:12px 12px 12px 0; color:#333; }
    .cb-msg.user { background:#1a3a5c; color:#fff; padding:10px 14px; border-radius:12px 12px 0 12px; text-align:right; margin-left:40px; }
    .cb-msg.loading { color:#999; font-style:italic; }
    .cb-input { display:flex; border-top:1px solid #e8e8e8; padding:8px; }
    .cb-input input { flex:1; border:1px solid #ddd; border-radius:8px; padding:10px 12px; font-size:14px; font-family:'Noto Sans JP',sans-serif; outline:none; }
    .cb-input input:focus { border-color:#1a3a5c; }
    .cb-input button { background:#1a3a5c; color:#fff; border:none; border-radius:8px; padding:10px 16px; margin-left:8px; cursor:pointer; font-size:14px; font-weight:700; }
    .cb-input button:disabled { background:#ccc; cursor:default; }
    .cb-note { font-size:11px; color:#aaa; text-align:center; padding:4px 8px 8px; }
    @media(max-width:480px) { .cb-box { right:8px; left:8px; width:auto; bottom:80px; } }
  `;
  document.head.appendChild(style);

  // ボタン
  var btn = document.createElement('button');
  btn.className = 'cb-btn';
  btn.innerHTML = '💬';
  btn.setAttribute('aria-label', 'チャットを開く');
  document.body.appendChild(btn);

  // チャットボックス
  var box = document.createElement('div');
  box.className = 'cb-box';
  box.innerHTML = `
    <div class="cb-hdr"><span>TAKUBOX サポート</span><button class="cb-close">&times;</button></div>
    <div class="cb-msgs"><div class="cb-msg bot">こんにちは！TAKUBOXに関するご質問にお答えします。お気軽にどうぞ。</div></div>
    <div class="cb-input"><input type="text" placeholder="質問を入力..." maxlength="500"><button>送信</button></div>
    <div class="cb-note">※ AIによる自動応答です。正確な情報はinfo@takubox.co.jpへ</div>
  `;
  document.body.appendChild(box);

  var msgs = box.querySelector('.cb-msgs');
  var input = box.querySelector('.cb-input input');
  var sendBtn = box.querySelector('.cb-input button');

  btn.onclick = function() { box.classList.toggle('open'); if(box.classList.contains('open')) input.focus(); };
  box.querySelector('.cb-close').onclick = function() { box.classList.remove('open'); };

  function formatReply(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^- /gm, '・')
      .replace(/^#{1,3} /gm, '')
      .replace(/\n{3,}/g, '\n\n');
  }

  function addMsg(text, cls) {
    var d = document.createElement('div');
    d.className = 'cb-msg ' + cls;
    if (cls.includes('bot') && !cls.includes('loading')) {
      d.innerText = formatReply(text);
    } else {
      d.textContent = text;
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  async function send() {
    var msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    addMsg(msg, 'user');
    sendBtn.disabled = true;
    var loading = addMsg('回答を生成中...', 'bot loading');

    try {
      var res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, sessionId: sessionId, pageUrl: window.location.href })
      });
      var data = await res.json();
      msgs.removeChild(loading);
      if (data.sessionId) sessionId = data.sessionId;
      addMsg(data.reply || data.error || 'エラーが発生しました', 'bot');
    } catch(e) {
      msgs.removeChild(loading);
      addMsg('通信エラーが発生しました。しばらくしてからお試しください。', 'bot');
    }
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.onclick = send;
  input.onkeydown = function(e) { if(e.key === 'Enter') send(); };
})();
