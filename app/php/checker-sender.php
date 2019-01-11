<?php
//Скрипт CHECKER-SENDER для сайта landing-business.hw 
//Запускаю сессию если она не запущенна
if(session_status() == PHP_SESSION_NONE){
   session_start(); 
}
//Переменные
$error = false;
$successful = '<p class="notice__txt">Your application for a free consultation is accepted. Our managers will contact you shortly.</p>
<p class="notice__txt">Thank you,&nbsp;<b><?php echo $name;?></b>, for choosing us!</p>';
$_SESSION['successTxt'] = $successful;
//Удаляю предыдущие значения из сессии.
//unset($_SESSION['name']);
//unset($_SESSION['phone']);
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
    //Записываю в сессию имя из post
    $_SESSION['name'] = trim($_POST['name']);
    //Делаю чтобы данные которые ввели в форму не стерлись после отправки формы.
    //$_SESSION['name'] = $name;
    //$_SESSION['phone'] = $phone;
} 
    //Обработка ошибок в форме.
    //Идут проверки на недопустимые символы и на короткие имена.
    if($name == "" || preg_match("/[0-9\.+$^)(><\?\]\[\}\{\*\&\;\:\~\/\=\#\%\@\№\!\"]/u", $name)) {
            //$notice = "Укажите имя и фамилию!";
            $error = true;
    }
    elseif(strlen($name) < 2) {
            //$notice = "Короткое имя!";
            $error = true;
    }
    elseif($phone == "" || preg_match("/[^0-9\s-\+ \( \)]/", $phone)) {
            //$notice = "Укажите номер телефона!";
            $error = true;
    }
    elseif(strlen($phone) <= 6) {
            //$notice = "Короткий номер телефона!";
            $error = true;
    }
    //для поля компания
    elseif(preg_match("/[0-9\.+$^)(><\?\]\[\}\{\*\;\:\~\/\=\#\%\@\№\!\"]/u", $company)) {
            $error = true;
    }
    elseif(strlen($company) < 2){
            $error = true;
    }
    else{
     //Создаю паку для хранения файла клиенты
        mkdir("../clients", 0777);    
    //Данные которые не содержат ошибок, записываются в файл, а также отправляются на почту.
    //запись в файл...
        file_put_contents('../clients/people-clients.txt', "$time_date $name $phone $company\n", FILE_APPEND);
    //данные на почту...
        mail('technoninja@localhost', 'Новый клиент', "$time_date $name $phone $company", "Content-Type: text/html; charset=UTF-8\r\n");
    }      
 //Если ошибок нет тогда уведомляю что пользователь записан.
if (!$error) {
    //$notice = "<span style = color:#19c119;>Вы записаны!</span>";
//Удаляю значения из сессии.
    //unset($_SESSION['name']);
    //unset($_SESSION['phone']);
//перенаправление на страницу в нужную секцию 
    //header('Refresh: 0; ../index.html?#application');
    header('Refresh: 0; notice/notice.php');
}
//Если имя  пусто, то уведомления тоже пустое.    
// if($name == ""){
//     $notice = NULL;
// }
// //Если имя  пусто, а телефон нет, то...
// if($name == "" && $phone != ""){
//      $notice = "Укажите имя и фамилию!"; 
// }

?>
