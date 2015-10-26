# Sample Transport Tracking

## Server Installation
### Credentials
The app/ directory should contain a `secrets.js` file with the following contents:

    'use strict';

    const ODK_PASSWORD = 'my_password';  // ODK Aggregate password
    exports.ODK_PASSWORD = ODK_PASSWORD;

This ODK_PASSWORD should provide the user detailed in `config.js` with full access to the ODK Aggregate server.

### Instructions
First, use rsync (or some other method) to move the `secrets.js` file to the home directory of the server's administrator account. This account will execute the Sample Tracking app, and must have sudo access.

    rsync -avz -e "ssh -i PRIVATE_KEY_PATH" --progress app/secrets.js \
    USERNAME@HOSTNAME:~;

Execute `bootstrap.sh` on the server over SSH to complete installation.

    ssh -i PRIVATE_KEY_PATH USERNAME@HOSTNAME 'bash -s' < bootstrap.sh

This setup script should launch the Sample Tracking app.