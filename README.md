# Sample Transport Tracking (STT)

## Setup
A docker image for the STT application is hosted on Docker Hub at [kharatsa/strack](https://hub.docker.com/r/kharatsa/strack/).

The STT Docker container requires that certain environment variables be set on the host server prior to deployment. Usernames and password used to protect the Disa Labs submission API and ODK Collect submission API will also need to be created prior to usage (these should persist in the database across new deployments).

To create these STT app credentials, log in to a running STT docker container with an interactive shell.

    docker exec -it strack /bin/bash

Within this container, use the provided user maintenance command-line utility to add new users to the STT database.

    node app/maintenance/users.js NEW_USERNAME NEW_PASSWORD

## Change Deployment
To deploy the STT Docker container, run the `deploy.sh` script on the host server.

    ssh -i PRIVATE_KEY_PATH USERNAME@HOSTNAME 'bash -s' < deploy.sh
