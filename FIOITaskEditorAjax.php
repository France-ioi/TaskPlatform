<?php

class FIOITaskEditorAjax extends FIOIEditorAjax {

   public static function decodeToken($sToken, $pc_key) {
      $tokenParser = new TokenParser($pc_key);
      try {
         $params = $tokenParser->decodeToken($sToken);
      } catch (Exception $e) {
         echo json_encode(array('bSuccess' => false, 'sError' => $e->getMessage()));
         exit;
      }
      return $params;
   }

}
