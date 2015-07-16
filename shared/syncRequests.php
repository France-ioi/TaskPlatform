<?php

function getSyncRequests ($params)
{
	global $viewModels;
   	
	if (isset($params['idSubmission']))
	{
		$viewModelsUsed = $viewModels['byIdSubmission'];
	}
	else if (isset($params['timeRecentSubmissions']))
	{
		$viewModelsUsed = $viewModels['byTimeSubmission'];
	}
	else
	{
      echo 'undefined param';
		error_log('Undefined param');
      return;
	}
   	
	foreach ($viewModelsUsed as $tableName => $viewModel) 
   {
      //$genViewModel = createViewModelFromTable($tableName);
      $requests[$tableName] = array(
         "modelName" => $tableName,
         "model" => $viewModel,
         "fields" => getViewModelFieldsList($viewModel),
         "filters"  => array()
      );
   }
   
   if (isset($params['idSubmission']))
   {
      $idSubmission = $params['idSubmission'];
	
      $requests["tm_source_codes"]["filters"]["idSubmission"] = $idSubmission;
      //$requests["tm_tasks_subtasks"]["filters"]["idSubmission"] = $idSubmission;
      //$requests["tm_tasks_tests"]["filters"]["idSubmission"] = $idSubmission;

      $requests["tm_submissions"]["filters"]["recordID"] = $idSubmission;
      $requests["tm_submissions_subtasks"]["filters"]["idSubmission"] = $idSubmission;
      $requests["tm_submissions_tests"]["filters"]["idSubmission"] = $idSubmission;
   }
   else if (isset($params['timeRecentSubmissions']))
   {
      $requests["tm_submissions"]["filters"]["timeRecentSubmissions"] = $params["timeRecentSubmissions"];
      $requests["tm_source_codes"]["filters"]["timeRecentSubmissions"] = $params["timeRecentSubmissions"];
      $requests["tm_submissions_tests"]["filters"]["timeRecentSubmissions"] = $params["timeRecentSubmissions"];
      $requests["tm_submissions_subtasks"]["filters"]["timeRecentSubmissions"] = $params["timeRecentSubmissions"];
   }
   
   return $requests;

}

/*function getSyncRequests($params) {
   global $viewModels;
   //$requests = syncGetTablesRequests();

   if (isset($params["idSubmission"])) {
      $idSubmission = $params["idSubmission"];      
   } else {
      $idSubmission = 0;
   }

   foreach ($viewModels as $tableName => $viewModel) {
      //$genViewModel = createViewModelFromTable($tableName);
      $requests[$tableName] = array(
         "modelName" => $tableName,
         "model" => $viewModel,
         "fields" => getViewModelFieldsList($viewModel),
         "filters"  => array()
      );
   }
   unset($requests["tm_tasks_tests"]);
   unset($requests['tm_tasks_subtasks']);
   unset($requests['tm_source_codes']);
   unset($requests['tm_tasks']);

   if ($idSubmission != 0)
   {
      $requests["tm_source_codes"]["filters"]["idSubmission"] = $idSubmission;
      //$requests["tm_tasks_subtasks"]["filters"]["idSubmission"] = $idSubmission;
      //$requests["tm_tasks_tests"]["filters"]["idSubmission"] = $idSubmission;

      $requests["tm_submissions"]["filters"]["recordID"] = $idSubmission;
      $requests["tm_submissions_subtasks"]["filters"]["idSubmission"] = $idSubmission;
      $requests["tm_submissions_tests"]["filters"]["idSubmission"] = $idSubmission;
   }
   
   if (isset($params["timeRecentSubmissions"]))
   {
      unset($requests['tm_source_codes']);
      unset($requests['tm_submissions_subtasks']);
      unset($requests['tm_submissions_tests']);
      $requests["tm_submissions"]["filters"]["timeRecentSubmissions"] = $params["timeRecentSubmissions"];
   }
//   error_log(json_encode($requests));
   return $requests;
}*/

?>
