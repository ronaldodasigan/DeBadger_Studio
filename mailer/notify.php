<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');

$expectedSecret = getenv('SUPABASE_WEBHOOK_SECRET') ?: '';
$receivedSecret = $_SERVER['HTTP_X_WEBHOOK_SECRET'] ?? '';
if ($expectedSecret === '' || !hash_equals($expectedSecret, $receivedSecret)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true);
$event = strtoupper((string)($payload['type'] ?? $payload['eventType'] ?? 'UPDATE'));
$order = $payload['record'] ?? $payload['new_record'] ?? $payload['data'] ?? null;
$order = is_array($order['data'] ?? null) ? $order['data'] : $order;

if (!is_array($order) || empty($order['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Order payload is missing']);
    exit;
}

$customer = $order['customer'] ?? [];
$customerEmail = filter_var((string)($customer['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$ownerEmail = filter_var((string)(getenv('OWNER_EMAIL') ?: ''), FILTER_VALIDATE_EMAIL);
$recipients = [];

if ($event === 'INSERT' && $ownerEmail) {
    $recipients[] = [$ownerEmail, 'PinMirror owner'];
}
if ($event !== 'INSERT' && $customerEmail) {
    $recipients[] = [$customerEmail, (string)($customer['name'] ?? 'Customer')];
}

if (!$recipients) {
    echo json_encode(['sent' => 0, 'reason' => 'No recipient configured']);
    exit;
}

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST') ?: '';
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USERNAME') ?: '';
    $mail->Password = getenv('SMTP_PASSWORD') ?: '';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = (int)(getenv('SMTP_PORT') ?: 587);
    $mail->setFrom(getenv('MAIL_FROM') ?: $mail->Username, getenv('MAIL_FROM_NAME') ?: 'PinMirror Studio');
    $mail->isHTML(true);
    $mail->Subject = $event === 'INSERT' ? 'New PinMirror order ' . $order['id'] : 'Order update ' . $order['id'];
    $mail->Body = sprintf(
        '<h2>%s</h2><p>Order <strong>%s</strong></p><p>Customer: %s</p><p>Status: %s</p><p>Total: ₱%s</p>',
        htmlspecialchars($event === 'INSERT' ? 'New order received' : 'Your order was updated', ENT_QUOTES, 'UTF-8'),
        htmlspecialchars((string)$order['id'], ENT_QUOTES, 'UTF-8'),
        htmlspecialchars((string)($customer['name'] ?? ''), ENT_QUOTES, 'UTF-8'),
        htmlspecialchars((string)($order['stage'] ?? 'Processing'), ENT_QUOTES, 'UTF-8'),
        htmlspecialchars(number_format((float)($order['total'] ?? 0), 2), ENT_QUOTES, 'UTF-8')
    );

    foreach ($recipients as [$email, $name]) {
        $mail->clearAddresses();
        $mail->addAddress($email, $name);
        $mail->send();
    }

    echo json_encode(['sent' => count($recipients)]);
} catch (Exception $exception) {
    http_response_code(500);
    echo json_encode(['error' => 'Email delivery failed']);
}
