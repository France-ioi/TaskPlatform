<?php

class FIOITaskEditorAjax extends FIOIEditorAjax {

   public static function decodeToken($sToken, $pc_key) {
      global $config;
      $tokenParser = new TokenParser($pc_key);
      try {
         $params = $tokenParser->decodeToken($sToken);
      } catch (Exception $e) {
         if ($config->testMode->active) {
            $params = array('idUser' => $config->testMode->idUser, 'idPlatform' => $config->testMode->idPlatform, 'idTask' => $config->testMode->idTask);
         } else {
            echo json_encode(array('bSuccess' => false, 'sError' => $e->getMessage()));
            exit;
         }
      }
      return $params;
   }

}
