# France-ioi Task Platform

## Requirements

You need [bower](https://bower.io) and [composer](https://getcomposer.org).

## Installation

Clone the repository and the submodules (`git submodule init && git submodule update`).

Run `bower install` and `composer install`.

Copy `config_local_template.php` to `config_local.php` and fill it.

Visit `dbv/index.php` (login/password in `dbv/config.php`, don't forget to change them or block access to dbv) and apply schema and revisions.

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

- show hints
- return metadata
- show/hide language-specific parts
- show limits
- submit with own tests
