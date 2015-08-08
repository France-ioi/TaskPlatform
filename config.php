<?php

$config = (object) array(
   "db" => (object) array(
      "host" => "localhost",
      "database" => "franceioi",
      "user" => "",
      "password" => "",
      "logged" => false
   ),
   "platform" => (object) array(
      "name" => "tasks.pem.dev",
      "private_key" => "",
      "public_key" => ""
   ),
   "graderqueue" => (object) array(
      "keyname" => "graderqueue.pem.dev",
      "private_key" => "",
      "public_key" => ""
   ),
   "sync" => (object) array(
      "server" => "",
      "params" => (object) array(  ),
      "useTransaction" => true,
      "maxChanges" => 20000,
   ),
   "testMode" => (object) array(
      "idUser" => "1",
      "idPlatform" => "1",
      "idTask" => "FranceIOI/Tests/test_1",
      "active" => true
   )
);

if (is_readable(__DIR__.'/config_local.php')) {
   include_once __DIR__.'/config_local.php';
}
