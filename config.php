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
      "private_key" => "the private key to generate grader tokens",
      "public_key" => "the corresponding public key (to give to platforms)"
   ),
   "graderqueue" => (object) array(
      "url" => "complete/url/to/api.php",
      "own_name" => "tasks.pem.dev",
      "own_private_key" => "the private key to communicate graderqueue",
      "own_public_key" => "the corresponding public key",
      "name" => "graderqueue.pem.dev",
      "public_key" => "the public key of the graderqueue"
   ),
   "sync" => (object) array(
      "server" => "",
      "params" => (object) array(  ),
      "useTransaction" => true,
      "maxChanges" => 20000,
   ),
   "testMode" => (object) array(
      "idUser" => "1",
      "platformName" => "must correspond to a name field of tm_platforms",
      "bAccessSolutions" => "0",
      "nbHintsGiven" => "0",
      "task_sTextId" => "FranceIOI/Tests/test_2",
      "active" => true
   ),
   "shared" => (object) array(
      "transloadit" => (object) array(
         "key" => "XXX",
         "template_id" => "XXX"
      )
   )
);

if (is_readable(__DIR__.'/config_local.php')) {
   include_once __DIR__.'/config_local.php';
}
