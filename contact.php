<?php
// TAKUBOX LP 申込みフォーム処理

// 許可するリファラ
$allowed_host = 'takubox.co.jp';

// POST以外は拒否
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// 入力値の取得とサニタイズ
$name    = isset($_POST['name'])    ? trim(strip_tags($_POST['name']))    : '';
$email   = isset($_POST['email'])   ? trim(strip_tags($_POST['email']))   : '';
$tel     = isset($_POST['tel'])     ? trim(strip_tags($_POST['tel']))     : '';
$grade   = isset($_POST['grade'])   ? trim(strip_tags($_POST['grade']))   : '';
$plan    = isset($_POST['plan'])    ? trim(strip_tags($_POST['plan']))    : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// バリデーション
$errors = [];
if ($name === '')  $errors[] = 'お名前を入力してください。';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = '正しいメールアドレスを入力してください。';
if ($tel === '')   $errors[] = '電話番号を入力してください。';
if ($grade === '') $errors[] = 'お子さまの学年を選択してください。';
if ($plan === '')  $errors[] = 'ご希望のプランを選択してください。';

if (!empty($errors)) {
    // エラー時はLPに戻す
    $error_msg = urlencode(implode('\n', $errors));
    header("Location: lp.html?status=error&msg={$error_msg}#apply");
    exit;
}

// メール送信
$to = 'info@takubox.co.jp';
$subject = '【TAKUBOX LP】新規お申し込み';

$body = "TAKUBOXランディングページからお申し込みがありました。\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$body .= "■ お名前\n{$name}\n\n";
$body .= "■ メールアドレス\n{$email}\n\n";
$body .= "■ 電話番号\n{$tel}\n\n";
$body .= "■ お子さまの学年\n{$grade}\n\n";
$body .= "■ ご希望のプラン\n{$plan}\n\n";
if ($message !== '') {
    $body .= "■ ご質問・ご要望\n{$message}\n\n";
}
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "送信日時: " . date('Y-m-d H:i:s') . "\n";
$body .= "送信元IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

$headers  = "From: TAKUBOX LP <info@takubox.co.jp>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$result = mb_send_mail($to, $subject, $body, $headers);

if ($result) {
    header("Location: lp.html?status=success#apply");
} else {
    header("Location: lp.html?status=error&msg=" . urlencode('送信に失敗しました。お手数ですがinfo@takubox.co.jpまで直接ご連絡ください。') . "#apply");
}
exit;
