<?php
/**
 * Contact form configuration — TEMPLATE.
 *
 * 1. Copy this file and name the copy:  synthea-contact-config.php
 * 2. Fill in the values below.
 * 3. Upload it with Hostinger File Manager to the folder ABOVE public_html:
 *        /home/<your-user>/domains/syntheatech.com/synthea-contact-config.php
 *    (next to the public_html folder — NOT inside it), so it can never be
 *    downloaded from the web and is not overwritten by deployments.
 *
 * Never commit the real file to GitHub.
 */
return [
    // Where inquiries are delivered (comma-separate several addresses)
    'to_email' => 'sadhan-jyoti.dutta@syntheatech.com',

    // Sender: a mailbox that exists in Hostinger → Emails (e.g. noreply@syntheatech.com)
    'from_email' => 'noreply@syntheatech.com',
    'from_name' => 'Synthea Website',

    // "smtp" (recommended) or "mail" (PHP mail(), no password needed, lower deliverability)
    'transport' => 'smtp',

    // Hostinger Email SMTP settings
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl', // "ssl" for 465, "tls" for 587
    'smtp_user' => 'noreply@syntheatech.com',
    'smtp_pass' => 'PUT-THE-MAILBOX-PASSWORD-HERE',

    // Accept one technical document (≤ 8 MB) per inquiry
    'attachments_enabled' => false,

    'site_url' => 'https://syntheatech.com',
];
