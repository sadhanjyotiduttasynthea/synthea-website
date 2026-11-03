<?php
/**
 * Synthea website — contact form backend (PHP, for Hostinger PHP/HTML hosting).
 *
 * GET  /api/contact.php  → {"attachmentsEnabled": bool, "configured": bool}
 * POST /api/contact.php  → multipart form submission, JSON response:
 *        {"ok": true, "message": "..."}  or
 *        {"ok": false, "message": "...", "fieldErrors": {...}}
 *
 * Mirrors the validation in src/lib/contact-schema.ts. Secrets are read from a
 * PHP config file that is never committed to git and never served to browsers
 * (see contact-config.example.php and docs/DEPLOYMENT.md).
 *
 * Compatible with PHP 7.4+.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const MIN_FILL_TIME_MS = 3000;
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 900;
const MAX_ATTACHMENT_BYTES = 8388608; // 8 MB

/* ------------------------------------------------------------------------- */
/* Configuration                                                              */
/* ------------------------------------------------------------------------- */

function load_config(): array
{
    $defaults = [
        'to_email' => 'sadhan-jyoti.dutta@syntheatech.com',
        // Without a config file the form sends with PHP mail() from Synthea's own
        // mailbox, which works on Hostinger PHP hosting with no password.
        'from_email' => 'sadhan-jyoti.dutta@syntheatech.com',
        'from_name' => 'Synthea Website',
        'transport' => 'mail', // "smtp" (recommended, needs a mailbox password) or "mail"
        'smtp_host' => 'smtp.hostinger.com',
        'smtp_port' => 465,
        'smtp_secure' => 'ssl', // "ssl" (port 465) or "tls" (STARTTLS, port 587)
        'smtp_user' => '',
        'smtp_pass' => '',
        'attachments_enabled' => false,
        'site_url' => 'https://syntheatech.com',
    ];
    // 1) Preferred: outside public_html (…/domains/syntheatech.com/synthea-contact-config.php)
    // 2) Fallback: next to this script (access to it is denied by api/.htaccess)
    $candidates = [
        dirname(__DIR__, 2) . '/synthea-contact-config.php',
        __DIR__ . '/contact-config.php',
    ];
    $config = $defaults;
    foreach ($candidates as $file) {
        if (is_file($file)) {
            $cfg = include $file;
            if (is_array($cfg)) {
                $config = array_merge($defaults, $cfg);
                break;
            }
        }
    }
    // SMTP selected but no usable password (e.g. the template placeholder) → use mail().
    $pass = (string) $config['smtp_pass'];
    if ($config['transport'] === 'smtp' && ($config['smtp_user'] === '' || $pass === '' || strpos($pass, 'PUT-THE-') === 0)) {
        $config['transport'] = 'mail';
    }
    return $config;
}

/** Send with PHP mail(); retries without the -f envelope option if the host rejects it. */
function php_mail(array $config, string $to, string $subject, string $body, array $headers): bool
{
    $h = implode("\r\n", $headers);
    $from = header_safe((string) $config['from_email']);
    if (@mail($to, $subject, $body, $h, '-f' . $from)) {
        return true;
    }
    return @mail($to, $subject, $body, $h);
}

function is_configured(array $c): bool
{
    if ($c['from_email'] === '' || $c['to_email'] === '') {
        return false;
    }
    if ($c['transport'] === 'mail') {
        return true;
    }
    return $c['smtp_host'] !== '' && $c['smtp_user'] !== '' && $c['smtp_pass'] !== '';
}

function respond(int $status, array $body, array $headers = []): void
{
    http_response_code($status);
    foreach ($headers as $h) {
        header($h);
    }
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$config = load_config();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    respond(200, [
        'attachmentsEnabled' => (bool) $config['attachments_enabled'],
        'configured' => is_configured($config),
    ]);
}
if ($method !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Method not allowed.'], ['Allow: GET, POST']);
}

/* ------------------------------------------------------------------------- */
/* Request checks: origin, size, rate limit                                   */
/* ------------------------------------------------------------------------- */

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    $siteHost = parse_url((string) $config['site_url'], PHP_URL_HOST);
    $ok = $originHost && (
        strcasecmp($originHost, (string) $host) === 0 ||
        strcasecmp($originHost, (string) $siteHost) === 0 ||
        strcasecmp($originHost, 'www.' . $siteHost) === 0
    );
    if (!$ok) {
        respond(403, ['ok' => false, 'message' => 'This request could not be verified.']);
    }
}

$length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($length > MAX_ATTACHMENT_BYTES + 524288) {
    respond(413, ['ok' => false, 'message' => 'The submission is too large. Attachments are limited to 8 MB.']);
}

function client_ip(): string
{
    // Hostinger passes the visitor IP in REMOTE_ADDR (or via the CDN header).
    foreach (['HTTP_CF_CONNECTING_IP', 'REMOTE_ADDR'] as $k) {
        if (!empty($_SERVER[$k])) {
            return (string) $_SERVER[$k];
        }
    }
    return 'unknown';
}

/** File-based sliding window. IPs are stored hashed and expire automatically. */
function rate_limited(string $ip): int
{
    $dir = dirname(__DIR__, 2) . '/synthea-rate-limit';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        $dir = sys_get_temp_dir() . '/synthea-rate-limit';
        @mkdir($dir, 0700, true);
    }
    $file = $dir . '/' . hash('sha256', 'synthea|' . $ip) . '.json';
    $now = time();
    $fh = @fopen($file, 'c+');
    if (!$fh) {
        return 0; // fail open rather than block real visitors
    }
    flock($fh, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($fh), true);
    $hits = is_array($hits) ? array_values(array_filter($hits, function ($t) use ($now) {
        return is_int($t) && $now - $t < RATE_WINDOW_SECONDS;
    })) : [];
    $retry = 0;
    if (count($hits) >= RATE_LIMIT) {
        $retry = RATE_WINDOW_SECONDS - ($now - $hits[0]);
    } else {
        $hits[] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);

    // Occasionally remove stale files
    if (mt_rand(1, 50) === 1) {
        foreach ((array) glob($dir . '/*.json') as $f) {
            if (is_string($f) && $now - (int) @filemtime($f) > RATE_WINDOW_SECONDS) {
                @unlink($f);
            }
        }
    }
    return $retry;
}

$retry = rate_limited(client_ip());
if ($retry > 0) {
    respond(
        429,
        ['ok' => false, 'message' => 'Too many submissions. Please wait a few minutes before trying again.'],
        ['Retry-After: ' . $retry]
    );
}

/* ------------------------------------------------------------------------- */
/* Spam protection: honeypot + minimum fill time (silent fake success)        */
/* ------------------------------------------------------------------------- */

$honeypot = trim((string) ($_POST['website'] ?? ''));
$startedAt = (int) ($_POST['startedAt'] ?? 0);
$nowMs = (int) round(microtime(true) * 1000);
if ($honeypot !== '' || $startedAt <= 0 || $nowMs - $startedAt < MIN_FILL_TIME_MS) {
    respond(200, ['ok' => true, 'message' => 'Thank you. Your message has been received.']);
}

/* ------------------------------------------------------------------------- */
/* Validation (mirrors src/lib/contact-schema.ts)                             */
/* ------------------------------------------------------------------------- */

$inquiryTypes = [
    'rent' => 'Rent one of our products',
    'engineering-design' => 'Engineering design help',
    'robotics' => 'Custom robotics development',
    'automation' => 'Industrial automation',
    'simulation' => 'Simulation & analysis',
    'prototype' => 'Prototyping & validation',
    'research' => 'R&D collaboration',
    'other' => 'Something else',
];
$products = [
    'chocolate-printer' => '3D chocolate printer',
    'icecream-robot' => 'Robotic ice-cream delivery machine',
    'cookie-automation' => 'Cookie automation machine',
    'delivery-robot-restaurant' => 'Delivery robot — restaurants',
    'delivery-robot-cruise' => 'Delivery robot — cruise ships',
    'delivery-robot-events' => 'Delivery robot — hotels & events',
    'not-sure' => 'Not sure yet — advise me',
];
$designFocus = [
    'machine-design' => 'Machine design',
    'product-design' => 'Mechanical product design',
    'cad-drawings' => '3D CAD models & technical drawings',
    'redesign' => 'Improve or redesign an existing machine',
    'feasibility' => 'Concept & feasibility study',
    'other' => 'Other',
];
$budgets = [
    '5k-10k' => '€5,000–€10,000',
    '10k-25k' => '€10,000–€25,000',
    '25k-50k' => '€25,000–€50,000',
    'over-50k' => 'Above €50,000',
    'not-defined' => 'Not defined yet',
];
$rentalPeriods = [
    '6-months' => '6 months (minimum)',
    '12-months' => '12 months',
    'over-12-months' => 'More than 12 months',
];
$timelines = [
    'asap' => 'As soon as possible',
    '1-3-months' => 'Within 1–3 months',
    '3-6-months' => 'Within 3–6 months',
    '6-months-plus' => 'More than 6 months',
    'exploring' => 'Exploring options',
];

function field(string $key): string
{
    $v = $_POST[$key] ?? '';
    return is_string($v) ? trim($v) : '';
}

function len(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

$data = [
    'inquiryType' => field('inquiryType'),
    'product' => field('product'),
    'designFocus' => field('designFocus'),
    'rentalPeriod' => field('rentalPeriod'),
    'rentalDates' => field('rentalDates'),
    'location' => field('location'),
    'fullName' => field('fullName'),
    'email' => field('email'),
    'company' => field('company'),
    'phone' => field('phone'),
    'budget' => field('budget'),
    'timeline' => field('timeline'),
    'message' => field('message'),
    'consent' => field('consent') === 'true',
];

$errors = [];
if (!isset($inquiryTypes[$data['inquiryType']])) {
    $errors['inquiryType'] = 'Please choose what you are looking for.';
}
$isRent = $data['inquiryType'] === 'rent';
$isDesign = $data['inquiryType'] === 'engineering-design';
if ($isRent && !isset($products[$data['product']])) {
    $errors['product'] = 'Please choose which product you would like to rent.';
}
if ($isRent && !isset($rentalPeriods[$data['rentalPeriod']])) {
    $errors['rentalPeriod'] = 'Please choose a rental period (minimum 6 months).';
}
if ($isDesign && $data['designFocus'] !== '' && !isset($designFocus[$data['designFocus']])) {
    $errors['designFocus'] = 'Please choose a valid option.';
}
foreach (['rentalDates', 'location'] as $k) {
    if (len($data[$k]) > 200) {
        $errors[$k] = 'Please keep this under 200 characters.';
    }
}
if (len($data['fullName']) < 2) {
    $errors['fullName'] = 'Please enter your full name.';
} elseif (len($data['fullName']) > 120) {
    $errors['fullName'] = 'Please keep your name under 120 characters.';
}
if (len($data['email']) > 254 || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address.';
}
if (len($data['company']) > 160) {
    $errors['company'] = 'Please keep this under 160 characters.';
}
if (len($data['phone']) > 40) {
    $errors['phone'] = 'Please enter a shorter phone number.';
} elseif ($data['phone'] !== '' && !preg_match('/^[+()\d\s.\-]*$/', $data['phone'])) {
    $errors['phone'] = 'Use digits, spaces and + ( ) - . only.';
}
if ($data['budget'] !== '' && !isset($budgets[$data['budget']])) {
    $errors['budget'] = 'Please choose a valid option.';
}
if ($data['timeline'] !== '' && !isset($timelines[$data['timeline']])) {
    $errors['timeline'] = 'Please choose a valid option.';
}
if (len($data['message']) < 20) {
    $errors['message'] = 'Please tell us a little more (at least 20 characters).';
} elseif (len($data['message']) > 5000) {
    $errors['message'] = 'Please keep the description under 5,000 characters.';
}
if (!$data['consent']) {
    $errors['consent'] = 'Please confirm you agree to the processing of your data.';
}
if ($errors) {
    respond(422, ['ok' => false, 'message' => 'Please correct the highlighted fields.', 'fieldErrors' => $errors]);
}

/* ------------------------------------------------------------------------- */
/* Attachment (optional)                                                      */
/* ------------------------------------------------------------------------- */

$attachment = null;
if (isset($_FILES['attachment']) && is_array($_FILES['attachment']) && ($_FILES['attachment']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $f = $_FILES['attachment'];
    $fail = function (string $msg, string $field) {
        respond(422, ['ok' => false, 'message' => $msg, 'fieldErrors' => ['attachment' => $field]]);
    };
    if (!$config['attachments_enabled']) {
        $fail('File attachments are not enabled.', 'Attachments are not enabled.');
    }
    if ((int) $f['error'] === UPLOAD_ERR_INI_SIZE || (int) $f['error'] === UPLOAD_ERR_FORM_SIZE || (int) $f['size'] > MAX_ATTACHMENT_BYTES) {
        $fail('The attachment is too large.', 'Files are limited to 8 MB.');
    }
    if ((int) $f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file((string) $f['tmp_name'])) {
        $fail('The attachment could not be uploaded.', 'The upload failed. Please try again.');
    }
    $name = (string) $f['name'];
    $ext = strtolower((string) pathinfo($name, PATHINFO_EXTENSION));
    $allowed = ['pdf', 'png', 'jpg', 'jpeg', 'step', 'stp', 'stl', 'dxf', 'zip', 'docx', 'xlsx'];
    if (!in_array($ext, $allowed, true)) {
        $fail('Unsupported file type.', 'This file type is not supported.');
    }
    $content = (string) file_get_contents((string) $f['tmp_name']);
    $sig = substr($content, 0, 8);
    $signatures = [
        'pdf' => "%PDF",
        'png' => "\x89PNG",
        'jpg' => "\xFF\xD8\xFF",
        'jpeg' => "\xFF\xD8\xFF",
        'zip' => "PK",
        'docx' => "PK",
        'xlsx' => "PK",
    ];
    if (isset($signatures[$ext]) && strpos($sig, $signatures[$ext]) !== 0) {
        $fail('The attachment could not be verified.', 'The file content does not match its type.');
    }
    $safe = preg_replace('/[^\w.\- ]+/', '_', $name);
    $safe = substr((string) $safe, -120) ?: 'attachment';
    // Held in memory and forwarded by email only; PHP deletes the temp file after the request.
    $attachment = ['name' => $safe, 'content' => $content, 'type' => 'application/octet-stream'];
}

if (!is_configured($config)) {
    error_log('[contact] Email delivery is not configured.');
    respond(503, [
        'ok' => false,
        'message' => 'Our contact form is temporarily unavailable. Please email us directly at ' . $config['to_email'] . '.',
    ]);
}

/* ------------------------------------------------------------------------- */
/* Compose                                                                    */
/* ------------------------------------------------------------------------- */

$requestLabel = $inquiryTypes[$data['inquiryType']];
if ($isRent) {
    $requestLabel = 'Rental — ' . $products[$data['product']];
} elseif ($isRent && !isset($rentalPeriods[$data['rentalPeriod']])) {
    $errors['rentalPeriod'] = 'Please choose a rental period (minimum 6 months).';
}
if ($isDesign && $data['designFocus'] !== '') {
    $requestLabel = 'Engineering design — ' . $designFocus[$data['designFocus']];
}

$rows = [
    'Request' => $requestLabel,
    'Name' => $data['fullName'],
    'Email' => $data['email'],
    'Company' => $data['company'] !== '' ? $data['company'] : '—',
    'Phone' => $data['phone'] !== '' ? $data['phone'] : '—',
    'Rental period' => $isRent ? $rentalPeriods[$data['rentalPeriod']] : '—',
    'Preferred start' => $isRent && $data['rentalDates'] !== '' ? $data['rentalDates'] : '—',
    'Location / venue' => $isRent && $data['location'] !== '' ? $data['location'] : '—',
    'Budget' => $data['budget'] !== '' ? $budgets[$data['budget']] : '—',
    'Timeline' => $data['timeline'] !== '' ? $timelines[$data['timeline']] : '—',
    'Attachment' => $attachment ? $attachment['name'] : '—',
    'Consent' => 'Given via website form',
    'Received' => gmdate('Y-m-d\TH:i:s\Z'),
];

$text = '';
foreach ($rows as $k => $v) {
    $text .= "$k: $v\n";
}
$text .= "\nProject description:\n" . $data['message'] . "\n";

$e = function (string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
};
$html = '<!doctype html><html><body style="font-family:Arial,sans-serif;color:#111">'
    . '<h2 style="margin:0 0 16px">New website request — SYNTHEA</h2>'
    . '<table cellpadding="6" style="border-collapse:collapse;font-size:14px">';
foreach ($rows as $k => $v) {
    $html .= '<tr><td style="color:#6B7280;border-bottom:1px solid #E5E7EB">' . $e($k)
        . '</td><td style="border-bottom:1px solid #E5E7EB">' . $e($v) . '</td></tr>';
}
$html .= '</table><h3 style="margin:24px 0 8px">Project description</h3>'
    . '<p style="white-space:pre-wrap;font-size:14px;line-height:1.6">' . $e($data['message']) . '</p></body></html>';

$subjectName = substr(preg_replace('/[\r\n]+/', ' ', $data['fullName']), 0, 80);
$subject = '[Website] ' . $requestLabel . ' — ' . $subjectName;

/* ------------------------------------------------------------------------- */
/* MIME + delivery                                                            */
/* ------------------------------------------------------------------------- */

function header_safe(string $s): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $s));
}

function encode_header(string $s): string
{
    return '=?UTF-8?B?' . base64_encode(header_safe($s)) . '?=';
}

/** Build headers + body for a multipart message. Returns [headers string, body string]. */
function build_mime(array $config, array $to, string $replyTo, string $subject, string $text, string $html, ?array $attachment): array
{
    $boundaryMixed = 'mix_' . bin2hex(random_bytes(12));
    $boundaryAlt = 'alt_' . bin2hex(random_bytes(12));
    $fromDomain = substr((string) strrchr($config['from_email'], '@'), 1) ?: 'localhost';

    $headers = [
        'From: ' . encode_header($config['from_name']) . ' <' . header_safe($config['from_email']) . '>',
        'Reply-To: <' . header_safe($replyTo) . '>',
        'MIME-Version: 1.0',
        'Date: ' . date(DATE_RFC2822),
        'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $fromDomain . '>',
        'X-Mailer: Synthea-Website',
        'Content-Type: multipart/mixed; boundary="' . $boundaryMixed . '"',
    ];

    $body = "--$boundaryMixed\r\n"
        . "Content-Type: multipart/alternative; boundary=\"$boundaryAlt\"\r\n\r\n"
        . "--$boundaryAlt\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text)) . "\r\n"
        . "--$boundaryAlt\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html)) . "\r\n"
        . "--$boundaryAlt--\r\n";
    if ($attachment) {
        $fname = header_safe($attachment['name']);
        $body .= "--$boundaryMixed\r\n"
            . 'Content-Type: ' . $attachment['type'] . '; name="' . $fname . "\"\r\n"
            . "Content-Transfer-Encoding: base64\r\n"
            . 'Content-Disposition: attachment; filename="' . $fname . "\"\r\n\r\n"
            . chunk_split(base64_encode($attachment['content'])) . "\r\n";
    }
    $body .= "--$boundaryMixed--\r\n";
    return [$headers, $body];
}

/** Minimal authenticated SMTP client (SSL on 465 or STARTTLS on 587). Throws on failure. */
function smtp_send(array $c, array $to, array $headers, string $subject, string $body): void
{
    $secure = strtolower((string) $c['smtp_secure']);
    $remote = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $c['smtp_host'] . ':' . (int) $c['smtp_port'];
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    $sock = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$sock) {
        throw new RuntimeException("SMTP connect failed: $errstr ($errno)");
    }
    stream_set_timeout($sock, 20);

    $read = function () use ($sock): string {
        $data = '';
        while (($line = fgets($sock, 1024)) !== false) {
            $data .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') {
                break;
            }
        }
        return $data;
    };
    $cmd = function (?string $line, array $expect) use ($sock, $read): string {
        if ($line !== null) {
            fwrite($sock, $line . "\r\n");
        }
        $resp = $read();
        $code = (int) substr($resp, 0, 3);
        if (!in_array($code, $expect, true)) {
            throw new RuntimeException('SMTP error after ' . ($line === null ? 'connect' : strtok((string) $line, ' ')) . ': ' . trim($resp));
        }
        return $resp;
    };

    $hostname = parse_url((string) $c['site_url'], PHP_URL_HOST) ?: 'localhost';
    $cmd(null, [220]);
    $cmd('EHLO ' . $hostname, [250]);
    if ($secure === 'tls') {
        $cmd('STARTTLS', [220]);
        if (!stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('SMTP STARTTLS failed');
        }
        $cmd('EHLO ' . $hostname, [250]);
    }
    $cmd('AUTH LOGIN', [334]);
    $cmd(base64_encode((string) $c['smtp_user']), [334]);
    $cmd(base64_encode((string) $c['smtp_pass']), [235]);
    $cmd('MAIL FROM:<' . header_safe($c['from_email']) . '>', [250]);
    foreach ($to as $rcpt) {
        $cmd('RCPT TO:<' . header_safe($rcpt) . '>', [250, 251]);
    }
    $cmd('DATA', [354]);
    $message = implode("\r\n", array_merge(
        $headers,
        ['To: ' . implode(', ', array_map('header_safe', $to)), 'Subject: ' . encode_header($subject)]
    )) . "\r\n\r\n" . $body;
    // Dot-stuffing (RFC 5321 §4.5.2)
    $message = preg_replace('/^\./m', '..', str_replace(["\r\n", "\n"], ["\n", "\r\n"], $message));
    fwrite($sock, $message . "\r\n.\r\n");
    $cmd(null, [250]);
    fwrite($sock, "QUIT\r\n");
    fclose($sock);
}

$to = array_values(array_filter(array_map('trim', explode(',', (string) $config['to_email']))));

try {
    [$headers, $body] = build_mime($config, $to, $data['email'], $subject, $text, $html, $attachment);
    if ($config['transport'] === 'mail') {
        $ok = php_mail($config, implode(', ', $to), encode_header($subject), $body, $headers);
        if (!$ok) {
            throw new RuntimeException('mail() returned false');
        }
    } else {
        smtp_send($config, $to, $headers, $subject, $body);
    }
} catch (Throwable $ex) {
    error_log('[contact] Email delivery failed: ' . $ex->getMessage());
    respond(502, [
        'ok' => false,
        'message' => 'We could not send your message right now. Please try again shortly or email ' . $config['to_email'] . '.',
    ]);
}

/* ------------------------------------------------------------------------- */
/* Automatic confirmation to the sender                                       */
/* ------------------------------------------------------------------------- */
// Fixed text only (no echo of the visitor's message), so the form cannot be
// abused to send arbitrary content to third parties.

$firstName = trim((string) strtok($data['fullName'], ' '));
$firstName = substr($firstName !== '' ? $firstName : $data['fullName'], 0, 60);
$confirmSubject = 'We received your request — Synthea Advanced Technologies';
$confirmText = "Dear $firstName,\n\n"
    . "Thank you for contacting Synthea Advanced Technologies.\n\n"
    . "We have received your request (" . $requestLabel . ") and will get back to you shortly.\n"
    . "If you need to add anything, simply reply to this email.\n\n"
    . "Kind regards,\n"
    . "Sadhan Jyoti Dutta, PhD\n"
    . "CEO, Synthea Advanced Technologies\n"
    . "La Pépinière Genopole, 4 Rue Pierre Fontaine, 91058 Évry-Courcouronnes, France\n"
    . "https://syntheatech.com\n\n"
    . "This is an automatic confirmation. If you did not submit this request, please ignore this email.\n";
$confirmHtml = '<!doctype html><html><body style="font-family:Arial,sans-serif;color:#111;line-height:1.6;font-size:15px">'
    . '<p>Dear ' . $e($firstName) . ',</p>'
    . '<p>Thank you for contacting <strong>Synthea Advanced Technologies</strong>.</p>'
    . '<p>We have received your request (<strong>' . $e($requestLabel) . '</strong>) and will get back to you shortly. '
    . 'If you need to add anything, simply reply to this email.</p>'
    . '<p>Kind regards,<br>Sadhan Jyoti Dutta, PhD<br>CEO, Synthea Advanced Technologies<br>'
    . '<span style="color:#646B78">La Pépinière Genopole, 4 Rue Pierre Fontaine, 91058 Évry-Courcouronnes, France</span><br>'
    . '<a href="https://syntheatech.com" style="color:#D71932">syntheatech.com</a></p>'
    . '<p style="color:#646B78;font-size:12px">This is an automatic confirmation. If you did not submit this request, please ignore this email.</p>'
    . '</body></html>';

$confirmed = false;
try {
    $replyToOwner = $to[0] ?? $config['from_email'];
    [$cHeaders, $cBody] = build_mime($config, [$data['email']], $replyToOwner, $confirmSubject, $confirmText, $confirmHtml, null);
    if ($config['transport'] === 'mail') {
        $confirmed = php_mail($config, $data['email'], encode_header($confirmSubject), $cBody, $cHeaders);
    } else {
        smtp_send($config, [$data['email']], $cHeaders, $confirmSubject, $cBody);
        $confirmed = true;
    }
} catch (Throwable $ex) {
    // The request itself was delivered; only the courtesy confirmation failed.
    error_log('[contact] Confirmation email failed: ' . $ex->getMessage());
}

respond(200, [
    'ok' => true,
    'message' => $confirmed
        ? 'Your request has been sent. A confirmation email is on its way to ' . $data['email'] . ' — we will get back to you shortly.'
        : 'Your request has been sent — we will get back to you shortly.',
]);
