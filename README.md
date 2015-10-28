# Sample Transport Tracking (STT)

## ODK Aggregate server guidelines
### ODK Forms & Form Publishers
All sample tracking updates are captured in the ODK XForm format, and persisted to a paired ODK Aggregate server. Once data is stored on the ODK Aggregate server, the form data is passed along to the STT service by ODK Aggregate with the built-in **Publish** mechanism. The Sample Tracking Transport system is designed to receive data from ODK Aggregate's **Simple JSON Publisher**.
* [Aggregate Publishers Implementation Details](https://github.com/opendatakit/opendatakit/wiki/Aggregate-Publishers-Implementation-Details)
* [Open Data Kit - Data Transfer - Publishing](https://opendatakit.org/use/aggregate/data-transfer/#Publishing)

The required settings for each form's publisher are:

| Option           | Selection            |
| ---------------- | -------------------- |
| Publish to       | Z-ALPHA JSON Server  |
| Data to Publish  | BOTH Upload Existing & Stream New Submission Data |
| Url to publish to  | *[http://server-url/publish]* |
| Authorization token  | *[some secret token]* |
| Include Media as  | Links(URLs) to Media |

### Form fields
The STT server caches the server published from ODK Aggregate, for use in the STT dashboard. In order to be recognized and handled properly by the STT server, forms hosted on ODK Aggregate must include certain key fields.
* st_barcode
* lab_barcode

TODO: finish documenting

## Server Installation
### Credentials
The app/ directory should contain a `secrets.js` file with the following contents:

    'use strict';

    const ODK_PASSWORD = 'my_password';  // ODK Aggregate password
    exports.ODK_PASSWORD = ODK_PASSWORD;

    const odkPublisherToken = 'qwerty';
    exports.ODK_PUBLISHER_TOKEN = odkPublisherToken;

An example version of this file is provided in `app/example-secrets.js`. This ODK_PASSWORD should provide the user detailed in `config.js` with full access to the ODK Aggregate server.

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