<?php
//Запускаю сессию
session_start();
//Беру имя пользователя из сессии и ложу в переменную
//Для дальнейшего вывода на экран
$name = $_SESSION['name'];
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="../../img/favicon/favicon.ico">
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
        .notice__txt {
            margin: 0;
            font-size: 1.3em;
            line-height: 150%;
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
            <p class="notice__title"><b><?php echo $name;?></b></p>
            <p class="notice__txt">Your application for a free consultation is accepted. Our managers will contact you shortly.</p>
            <p class="notice__txt">Thank you,&nbsp;<b><?php echo $name;?></b>, for choosing us!</p>
        </main>
        <div class="box-btn">
            <a href="../../index.html?#application" class="btn">Back</a>
        </div>
    </div>
</body>
<?php   //echo "Я работаю! Все хорошо!";
        //header('Refresh: 16; ../../index.html?#application');
?>     