<?php
//------------------------------------------------------------//
//--Скрипт CHECKER-SENDER-FORM для сайта landing-business.hw--//
//------------------------------------------------------------//

//Переменные
$name = '';
$error = false;
$directory = '../clients/';
$fileClients = $directory.'people-clients.txt';
$failureTitle = '<p class="notice__title notice__title_warning">Dear user</p>';
//Определяю send не NULL (то-есть нажата была кнопка "Submit") тогда...
if(isset($_POST['send'])) {
    //Записываю данные из массива в переменные. 
    //Делаю время в нужном формате, для удобства.
    //Время будет в текстовом файле показывать когда человек отправил данные
    $time_date = date("Y-m-d H:i:s");
    //Записываемые данные проходят через функцию которая убирает пробелы по краям текста. 
    $name = trim($_POST['name']);
    $phone = trim($_POST['phone']);
    $company = trim($_POST['company']);
}  
    //Обработка ошибок отправленных с формы.
    //Идут проверки на недопустимые символы и на короткие имена.
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
        //Проверяю есть каталог или нет и затем
        //создаю каталог для хранения файла клиенты
        if(!file_exists($directory)) {
            mkdir($directory, 0777); 
        }    
        //Данные которые не содержат ошибок, записываются в файл, а также отправляются на почту.
        //запись в файл...
        file_put_contents($fileClients, "$time_date $name $phone $company\n", FILE_APPEND);
        //данные на почту...
        mail('technoninja@localhost', 'Новый клиент', "$time_date $name $phone $company", "Content-Type: text/html; charset=UTF-8\r\n");
        //added up
        //Данные для выводя при успешно поданной заявки
        $successfulTitle = '<p class="notice__title"><b>' . $name . '</b></p>';
        $successfulText  = '<p class="notice__txt">Your application for a free consultation is accepted. Our managers will contact you shortly.</p>
                    <p class="notice__txt">Thank you,&nbsp;<b>' . $name . '</b>, for choosing us!</p>';
    }      
 //Если ошибок нет тогда уведомляю что пользователь записан.
if(!$error) {
    //added up
    $noticeTitle = $successfulTitle;
    $noticeText = $successfulText;
}
//Если ошибка есть то указываю в чём проблема.
if($error == true) {
    $noticeTitle = $failureTitle;
    $noticeText = $failureText;
}
//Через время возвращает назад к форме на сайт
header('Refresh: 16; ../../index.html?#application');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="../img/favicon/favicon.ico">
    <title>Landing Business</title>
    <style>
        .page {
            margin: 0;
            padding: 4% 4% 4% 4%;
            font-size: 16px;
            font-family: Arial, sans-serif;
            color: #454545;
            background: #1287bf;            
        }
        @media (max-width: 1045px) {
            .page {
                font-size: 14px;
            }
        }
        @media (max-width: 228px) {
            .page {
                font-size: 6vw;
            }
        }
        .container {
            max-width: 1024px;
            margin: auto;
            background: #ffffff;
        }
        .header {
            padding: 4% 3% 3% 3%;
        }
        .logo { 
            text-align: center;
        }
        .logo__pic {
            width: 120px;
            height: auto;
        }
        @media (max-width: 228px) {
            .logo__pic {
                width: 60%;
            }
        }
        .logo__heading {
            margin: 0;
            letter-spacing: 1px;
            font-size: 2.7em;
            
        }
        .Logo__txt {
            margin: 0;
            letter-spacing: 1px;
            font-size: 1.2em;
        }
        .notice {
            text-align: center;
            padding: 1% 3% 1% 3%;
        }
        .notice__title {
            margin: 0;
            padding: 0 0 1% 0;
            font-size: 1.5em;
        }
        .notice__title_warning {
            color: red;
        }
        .notice__txt {
            margin: 0;
            font-size: 1.3em;
            line-height: 150%;
        }
        .notice__txt_warning {
            color: red;
        }
        .box-btn {
            padding: 2% 0 4% 0;
            text-align: center;
        }
        @media (max-width: 596px) {
            .box-btn {
                padding: 6% 0 6% 0;
            }
        }
        .btn {
            display: inline-block;
            padding: 0 40px 0 40px; 
            height: 47px;
            line-height: 47px;
            border-radius: 5px;
            background: #e62f31;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 1.1em;
            font-weight: normal; 
            letter-spacing: 1px; 
            color: #ffffff;
            transition: 0.5s;
        }
        .btn:hover{
            background: #4CAF50;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        @media (max-width: 228px) {
            .btn{
                padding: 0 20% 0 20%; 
                height: 10%;
                line-height: 4vh;
            }
        }
        

    </style>
  </head>
<body class="page">
    <div class="container"> 
        <header class="header">
            <div class="logo">
                <img src="pic/logo-biz-cap.svg" alt="Our company logo" class="logo__pic">
                <h2 class="logo__heading">Business</h2>
                <p class="Logo__txt">Tagline goes here</p>
            </div>
        </header>
        <main class="notice">
            <!-- <p class="notice__title"><b></b></p> -->
            <?php
            echo $noticeTitle; 
            echo $noticeText;
            ?>
            <!-- <p class="notice__txt">Your application for a free consultation is accepted. Our managers will contact you shortly.</p>
            <p class="notice__txt">Thank you,&nbsp;<b></b>, for choosing us!</p> -->
        </main>
        <div class="box-btn">
            <a href="../../index.html?#application" class="btn">Back</a>
        </div>
    </div>
</body>
