# Sample Transport Tracking

## Server Installation
### Credentials
The app/ directory should contain a `secrets.js` file with the following contents:

    'use strict';

    const ODK_PASSWORD = 'my_password';  // ODK Aggregate password
    exports.ODK_PASSWORD = ODK_PASSWORD;

This ODK_PASSWORD should provide the user detailed in `config.js` with full access to the ODK Aggregate server.

### Instructions
First, use rsync (or some other method) to move the `secrets.js` file to the home directory of the server's administrator account.

    rsync -avz -e "ssh -i PRIVATE_KEY_PATH" --progress app/secrets.js \
    USERNAME@HOSTNAME:~;

Execute `bootstrap.sh` on the server over SSH to complete installation.

    ssh -i PRIVATE_KEY_PATH USERNAME@HOSTNAME 'bash -s' < bootstrap.sh

A new system user and group, `strack`, owns all app files (`/srv/www/sample-tracking/`) and logs (`/var/log/sample-tracking/`), and is used to execute the application on the server.

## Change Deployment
The deploy script pulls the latest changes from the `master` branch of this repo, and restarts the application.

    ssh -i PRIVATE_KEY_PATH USERNAME@HOSTNAME 'bash -s' < deploy.sh
