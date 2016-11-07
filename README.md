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

## Setting up a new environment

### Cloudformation
There is a cloudformation-prod.json file in the repo root.  This is a cloudformation template.  All you need to do is login to AWS and go to the cloudformation service.  You will then create a new stack and give it this file.  When you create the stack it will ask you for all the credentials for this new deployment.  So beforehand you must create username and password for the db, STT, and ODK.  After this template is run and the stack is created there will be an ec2 instance, RDS mysql db, and security groups to go along.

### Login and setup
Now we must ssh into the ec2 instance.  You'll find it under the ec2 list of instances, it will be called STT server.  Once you've logged in run these commands.
```
git clone https://github.com/Kharatsa/SampleTransportTracking.git
cd SampleTransportTracking/
sudo ./server-setup.sh
./db-setup.sh
```

### Create ODK username and password

### All done!
That's it!  You will have to point your dns domain to the new server EIP and the site should be running. 

## DB
We are using RDS for our db, so they manage backups.  Currently we just have automated backups which will back up the db everyday and keep the last 7 days.  So if there is ever an issue you can always restore to a point in time.  If you would ever like to move the db to another region or for any other reason you'll need to create a snapshot and restore from that snap shot.  You can find out how to do that here.[http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html]
### backups
Here is some documentation.  [http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html]
### restore
Here is how to restore to a point in time.
[http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html]

