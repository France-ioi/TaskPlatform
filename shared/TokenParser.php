<?php
/* Copyright (c) 2013 Association France-ioi, MIT License http://opensource.org/licenses/MIT */

require_once(dirname(__FILE__)."/../vendor/autoload.php");

/**
 * Generates task token
 */
class TokenParser
{

   private $key;
   private $keyName;
   
   private $key2;
   private $key2Name;
   
   // for just jws or just jwe, use key, for jws then jwe, key is for jws, key2 for jwe
   function __construct($key, $keyName, $keyType, $key2 = null, $key2Name = null, $key2Type = null) {
      if ($keyType == 'private') {
         $this->key = openssl_pkey_get_private($key);
      } else {
         $this->key = openssl_pkey_get_public($key);
      }
      $this->keyName = $keyName;
      if ($key2) {
         if ($key2Type == 'private') {
            $this->key2 = openssl_pkey_get_private($key2);
         } else {
            $this->key2 = openssl_pkey_get_public($key2);
         }
         $this->key2Name = $key2Name;
      }
      $jose = SpomkyLabs\Service\Jose::getInstance();
      $jose->getConfiguration()->set('Compression', array('DEF'));
      $jose->getConfiguration()->set('Algorithms', array(
         'A256CBC-HS512',
         'RSA-OAEP-256',
         'RS512'
      ));
      $jose->getKeyManager()->addRSAKeyFromOpenSSLResource($this->keyName, $this->key);
      if ($this->key2Name) {
         $jose->getKeyManager()->addRSAKeyFromOpenSSLResource($this->key2Name, $this->key2);
      }
      $this->jose = $jose;
   }

   /**
    * Decode JWS tokens
    */
   public function decodeJWS($tokenString)
   {
      $result = $this->jose->load($tokenString);
      $params = $result->getPayload();
      $datetime = new DateTime();
      $datetime->modify('+1 day');
      $tomorrow = $datetime->format('d-m-Y');
      if (!isset($params['date'])) {
         if (!$params) {
            throw new Exception('Token cannot be decrypted, please check your SSL keys');
         }
         else {
            throw new Exception('Invalid Task token, unable to decrypt: '.json_encode($params).'; current: '.date('d-m-Y'));
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
      $result = $this->jose->load($tokenString);
      return $result->getPayload();
   }

   // JWE token signed with key2, containing JWS token signed with key
   public function decodeJWES($tokenString)
   {
      $jws = $this->decodeJWE($tokenString);
      return $this->decodeJWS($jws);
   }

}
