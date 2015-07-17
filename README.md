# France-ioi Task Platform

## Installation

Copy `config_local_template.php` to `config_local.php` and fill it.

Visit `dbv/index.php` (login/password in `dbv/config.php`) and apply schema and revisions.

Run

    php commonFramework/modelsManager/triggers.php

If you want to log requests, create a `logs` directory, giving write access to the user php runs as.

## Testing

Fill tm_platform with a platform with id `1`.

Run `php submission-manager/tests/tests.php` to load some data.


## TODO

- use text_id instead of idTask in token (!)
- clean editor code
- use sync for editor too?
- compile js and tpls from submission-manager with gulp, and include it with bower
