<?php
// Database connection parameters
$host = 'localhost';
$db = 'staple';
$user = 'erin';
$pass = 'staple';

// Email plugins
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Email parameters
$mail = new PHPMailer(true);
$to = 'buchananlab@gmail.com';
$subject = 'STAPLE Notifications';
$from = 'staple.helpdesk@gmail.com';
$fromName = 'STAPLE Help Desk';

// Create a new PDO instance
try {
    $dsn = "pgsql:host=$host;dbname=$db";
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit();
}

// Query to get today's notifications
$query = '
SELECT *
FROM "Notification"
WHERE date_trunc(\'day\', "createdAt") = CURRENT_DATE';

try {
  $stmt = $pdo->prepare($query);
  $stmt->execute();
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Prepare email content
  $message = "Today's Notifications:\n\n";
  if (empty($results)) {
      $message .= "No notifications for today.";
  } else {
      foreach ($results as $row) {
          foreach ($row as $key => $value) {
              $message .= "$key: $value\n";
          }
          $message .= "\n";
      }
  }

  // Configure PHPMailer
  $mail->isSMTP();
  $mail->Host = 'smtp.gmail.com'; // Set your SMTP server
  $mail->SMTPAuth = true;
  $mail->Username = 'staple.helpdesk'; // SMTP username
  $mail->Password = 'zvph ndps cxls vorz'; // SMTP password
  $mail->SMTPSecure = 'tls'; // Enable TLS encryption
  $mail->Port = 587; // TCP port to connect to

  // Recipients
  $mail->setFrom($from, $fromName);
  $mail->addAddress($to);

  // Content
  $mail->isHTML(false);
  $mail->Subject = $subject;
  $mail->Body    = $message;

  // Send the email
  $mail->send();
  echo 'Email sent successfully.';
} catch (PDOException $e) {
  echo 'Query failed: ' . $e->getMessage();
} catch (Exception $e) {
  echo 'Mailer Error: ' . $mail->ErrorInfo;
}

?>
