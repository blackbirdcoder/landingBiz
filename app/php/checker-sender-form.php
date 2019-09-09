<?php
//------------------------------------------------------------//
//--CHECKER-SENDER-FORM  landing-business.hw--//
//------------------------------------------------------------//

//var
$name = '';
$error = false;
$directory = '../clients/';
$fileClients = $directory.'people-clients.txt';
$failureTitle = '<p class="notice__title notice__title_warning">Dear user</p>';

if(isset($_POST['send'])) {

    $time_date = date("Y-m-d H:i:s");

    $name = trim($_POST['name']);
    $phone = trim($_POST['phone']);
    $company = trim($_POST['company']);
}  

    if($name == "" || preg_match("/[0-9\.+$^)(><\?\]\[\}\{\*\&\;\:\~\/\=\#\%\@\№\!\"]/u", $name)) {
            $error = true;
            $failureText = '<p class="notice__txt notice__txt_warning">The name is incorrect! Please send the application again!</p>';
    }
    elseif(strlen($name) < 2) {
            $error = true;
            $failureText = '<p class="notice__txt notice__txt_warning">Short name! Please send the application again!</p>';
    }
    elseif($phone == "" || preg_match("/[^0-9\s-\+ \( \)]/", $phone)) {
            $error = true;
            $failureText = '<p class="notice__txt notice__txt_warning">The phone number is incorrect! Please send the application again!</p>';
    }
    elseif(strlen($phone) <= 6) {
            $error = true;
            $failureText = '<p class="notice__txt notice__txt_warning">Short phone number! Please send the application again!</p>';
    }
    elseif(preg_match("/[0-9\.+$^)(><\?\]\[\}\{\*\;\:\~\/\=\#\%\@\№\!\"]/u", $company)) {
            $error = true;
            $failureText = '<p class="notice__txt notice__txt_warning">The company name is incorrect! Please send the application again!</p>';
    }
    elseif(strlen($company) < 2){
            $error = true;
            $failureText = '<p class="notice__txt notice__txt_warning">Short company name! Please send the application again!</p>';
    }
    else{

        if(!file_exists($directory)) {
            mkdir($directory, 0777); 
        }    
       
        file_put_contents($fileClients, "$time_date $name $phone $company\n", FILE_APPEND);

        mail('technoninja@localhost', 'Новый клиент', "$time_date $name $phone $company", "Content-Type: text/html; charset=UTF-8\r\n");

        $successfulTitle = '<p class="notice__title"><b>' . $name . '</b></p>';
        $successfulText  = '<p class="notice__txt">Your application for a free consultation is accepted. Our managers will contact you shortly.</p>
                    <p class="notice__txt">Thank you,&nbsp;<b>' . $name . '</b>, for choosing us!</p>';
    }      

if(!$error) {
    $noticeTitle = $successfulTitle;
    $noticeText = $successfulText;
}

if($error == true) {
    $noticeTitle = $failureTitle;
    $noticeText = $failureText;
}

header('Refresh: 16; ../../index.html?#application');
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
<body style="background:#1287bf;" class="page">
    <div style="background:#ffffff;" class="container"> 
        <header class="header">
            <div style="color:#454545;" class="logo">
                <img src="pic/logo-biz-cap.svg" alt="Our company logo" class="logo__pic">
                <h2 class="logo__heading">Business</h2>
                <p class="Logo__txt">Tagline goes here</p>
            </div>
        </header>
        <main style="color:#454545;" class="notice">
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
