<?php 
//-----------------------------------------------------------------//
//---Script CHECKER-SENDER-FORM for the site landing-business.hw---//
//-----------------------------------------------------------------//

//Variables
$email = '';
$error = false;
$directory = '../clients/';
$fileClients = $directory.'email-clients.txt';
$failureTitle = '<p class="notice__title notice__title_warning">Dear user</p>';

if(isset($_POST['send-email'])) {
    $time_date = date("Y-m-d H:i:s");
    $email = trim($_POST['email']);
}

if(preg_match("/[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]{1,64}@[a-zA-Z0-9-]{1,64}[\.][a-zA-z]{2,}[\.]{0,1}[a-zA-z]{0,}$/u", $email)){

    if(!file_exists($directory)) {
        mkdir($directory, 0777);
    }

    file_put_contents($fileClients, "$time_date $email\n", FILE_APPEND);

    mail('technoninja@localhost', 'Новый подписчик', "$time_date $email", "Content-Type: text/html; charset=UTF-8\r\n");

    $successfulTitle = '<p class="notice__title"><b>' . $email . '</b></p>';
    $successfulText  = '<p class="notice__txt">Your application for news has been accepted. You will receive the latest news on your email.</p>
    <p class="notice__txt">Thank you for choosing us!</p>';

    if(!$error) {
        $noticeTitle = $successfulTitle;
        $noticeText = $successfulText;
    }
    
} else {

    $error = true;

    $failureText = '<p class="notice__txt notice__txt_warning">The email address is incorrect! Please send the application again!</p>';

    if($error == true) {
        $noticeTitle = $failureTitle;
        $noticeText = $failureText;
    }

}

header('Refresh: 16; ../../index.html?#contact');
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" href="../img/favicon/favicon.ico">
        <link rel="stylesheet" href="css/notice.css">
        <title>Landing Business</title>
        <style>
        </style>
    </head>
<body style="background:#2a2a2a;" class="page">
    <div style="background:#515151;" class="container"> 
        <header class="header">
            <div style="color:#ffffff;" class="logo">
                <img src="pic/logo-biz-cap.svg" alt="Our company logo" class="logo__pic">
                <h2 class="logo__heading">Business</h2>
                <p class="Logo__txt">Tagline goes here</p>
            </div>
        </header>
        <main style="color:#ffffff;" class="notice">
            <?php
            echo $noticeTitle; 
            echo $noticeText;
            ?>
        </main>
        <div class="box-btn">
            <a href="../../index.html?#application" class="btn">Back</a>
        </div>
    </div>
</body>