<?php
/* Copyright (c) 2013 Association France-ioi, MIT License http://opensource.org/licenses/MIT */

require_once(dirname(__FILE__)."/../vendor/autoload.php");

/**
 * Generates task token
 */
class TokenParser
{
   /**
    * Public or private key
    */
   private $key;
   
   function __construct($key, $keyName, $keyType) {
      if ($keyType == 'private') {
         $this->key = openssl_pkey_get_private($key);
      } else {
         $this->key = openssl_pkey_get_public($this->key);
      }
      $this->key = $key;
      $this->keyName = $keyName;
   }
   /**
    * Decode JWS tokens (TODO: use spomky-labs/jose-service)
    */
   public function decodeJWS($tokenString)
   {
      $jws  = Namshi\JOSE\JWS::load($tokenString);
      if ($jws->verify($this->key)) {
          $params = $jws->getPayload();
      }
      $datetime = new DateTime();
      $datetime->modify('+1 day');
      $tomorrow = $datetime->format('d-m-Y');
      if (!isset($params['date'])) {
         if (!$params) {
            throw new Exception('Token cannot be decrypted, please check your SSL keys');
         }
         else {
            throw new Exception('Invalid Task token, unable to decrypt: '.$params.'; current: '.date('d-m-Y'));
         }
      }
      else if ($params['date'] != date('d-m-Y') && $params['date'] != $tomorrow) {
         throw new Exception('API token expired');
      }
      
      return $params;
   }

   /**
    * Decode JWE tokens// TODO: test
    */
   public function decodeJWE($tokenString)
   {
      $jose = SpomkyLabs\Service\Jose::getInstance();
      $jose->getConfiguration()->set('Compression', array('DEF'));
      $jose->getConfiguration()->set('Algorithms', array(
          'A256CBC-HS512',
          'RSA-OAEP-256',
      ));
      $jose->getKeyManager()->addRSAKeyFromOpenSSLResource($this->keyName, $this->key);
      $result = $jose->load($jwe);
      return $result->getPayload();
   }

}
