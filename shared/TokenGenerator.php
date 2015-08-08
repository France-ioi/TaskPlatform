<?php
/* Copyright (c) 2013 Association France-ioi, MIT License http://opensource.org/licenses/MIT */

require_once(dirname(__FILE__)."/../vendor/autoload.php");

/**
 * Generates task token
 */
class TokenGenerator
{
   private $keyName;
   private $key;
   
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
   }
   /**
    * JWS encryption function // TODO: use spomky-labs/jose-service
    */
   private function encodeJWS($params)
   {
      $params['date'] = date('d-m-Y'),
      $jose = SpomkyLabs\Service\Jose::getInstance();
      $jose->getConfiguration->set('Algorithms', array('RS512'));
      $jose->getKeyManager()->addKeyFromValues($this->keyName, $this->key);
      $jws = $jose->sign(
         $params,
         array(
             "alg" => "RS512",
             "kid" => $this->keyName,
         )
      );
      return $jws;
   }

   public function encodeJWE($params, $useKey2 = false)
   {
      if ($useKey2) {
        $key = $this->key2;
        $keyName = $this->key2Name;
      } else {
        $key = $this->key;
        $keyName = $this->keyName;
      }
      $params['date'] = date('d-m-Y'),
      $jose = SpomkyLabs\Service\Jose::getInstance();
      $jose->getConfiguration()->set('Compression', array('DEF'));
      $jose->getConfiguration()->set('Algorithms', array(
          'A256CBC-HS512',
          'RSA-OAEP-256',
      ));
      $jose->getKeyManager()->addRSAKeyFromOpenSSLResource($keyName, $key);
      $jwe = $jose->encrypt($this->keyName, $params, array(
          'alg' => 'RSA-OAEP-256',
          'enc' => 'A256CBC-HS512',
          'kid' => $keyName,
          'aud' => $keyName,
          'iss' => $keyName,
          'zip' => 'DEF',
      ));
      return $jwe;
   }

   // JWE token signed with key2, containing JWS token signed with key
   public function encodeJWES($params)
   {
      $jws = $this->encodeJWS($params);
      $jwe = $this->encodeJWE($jws, true);
   }
}
