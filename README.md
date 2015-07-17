# France-ioi Task Platform

## Installation

Copy `config_local_template.php` to `config_local.php` and fill it.

Visit `dbv/index.php` (login/password in `dbv/config.php`) and apply schema and revisions.

Run

    php commonFramework/modelsManager/triggers.php

If you want to log requests, create a `logs` directory, giving write access to the user php runs as.

## Testing

Make sure config is in test mode (see config.php).

Run `php shared/insertTestsSubmission.php` to load some data.

Then

    task.html?sPlatform=http%253A%252F%252Falgorea.pem.dev

Should lead to a decently working task with no need for token (useful to test outside a platform).

## TODO

- use text_id instead of idTask in token (!)
- clean editor code
- use sync for editor too?
- compile js and tpls from submission-manager with gulp, and include it with bower
- proper editor integration
- show submission according to reloadAnswer;
