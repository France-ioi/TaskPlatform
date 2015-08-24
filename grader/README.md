# Grader documentation

## Score computations

Score computation is not really obvious, especially since tasks may have subtasks, and subtasks can have different tests with different scores.

The score range is \[0-100\].

The SQL fields on which score computation for a task is based are:

- `tm_tasks_subtasks.iPointsMax`: maximum points per subtask, the sum per task must be 100
- `tm_tasks.iTestsMinSuccessScore`: minimal score to mark a test as successfull (TODO: move field to `tm_tasks_tests.minSuccessScore` ?)
- `tm_submissions.iMinSuccessScore`: minimal score to mark a submission successful. The value is retrieved at each submission through platform.getTaskParams()

The different SQL fields filled by the grading functions:

- `tm_submissions_tests.iScore`: score of a test, given by the grader directly
- `tm_submissions_tests.iErrorCode`: TODO
- `tm_submissions_subtasks.iScore` is set as the min of (score of a test multiplied by (`tm_tasks_subtasks.iPointsMax`/100)) for all tests associated with the subtask
- `tm_submissions_subtasks.bSuccess`: 1 if `tm_submissions_subtasks.iScore == tm_tasks_subtasks.iPointsMax`, meaning that all tests associated with the subtask had a score of 100/100
- `tm_submissions.iScore` is:
   - if the task has not subtask, the mean value of the `tm_submission_tests.iScore` associated with the task
   - else, the sum of `tm_submissions_subtasks.iScore`
- `tm_submissions.bSuccess`: 1 if `tm_submissions.iScore >= tm_submissions.iMinSuccessScore`
- `tm_submissions.nbTestsPassed`: sum of the tests with `tm_submissions_tests.iScore >= tm_tasks.iTestsMinSuccessScore` (TODO: not relevant in case of subtasks, remove from the base?)

Error codes:
- TODO
