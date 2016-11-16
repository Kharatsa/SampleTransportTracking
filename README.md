# Sample Transport Tracking (STT)

## Production Deploy

### CloudFormation stack deployment
This repo provides an [AWS CloudFormation](https://aws.amazon.com/cloudformation/) 
template in the `deploy/` directory. The template defines the resources
necessary for the full STT application stack. Once the stack resources are
deployed, some additional setup scripts are required to complete the
bootstrap process.

The resources covered by the stack template are:
* EC2 instance, *Ubuntu 16.04.1 LTS (Xenial Xerus)*
* RDS instance, *MySQL 5.7*
* Elastic IP address

#### Setup parameters

* Database
    * **DBUser**: The MySQL username the STT application and ODK should use
      when connecting to the database server. This user will be granted all
      access on the `stt` and `odk_stt` databases.
    * **DBPassword**: The password for the **DBUser**.
* Application
    * **STTUser**: The initial account username to create when deploying the
      STT application. This user will be flagged as an administrator.
    * **STTPassword**: The password for the **STTUser**.
* ODK
    * **ODKUser**: The username in ODK Aggregate the STT application should use
      for all submissions. This ODK Aggregate user will need at least *Data
        Collector* permissions.
    * **ODKPassword**: The password for the **ODKUser**.
* **TLDomain**: The top-level hostname shared between the STT application and
  ODK components. The application will be accessible at either `TLDomain` or
  `www.TLDomain`, while ODK will be accessible at `odk.TLDomain`.

### DNS Configuration

While the CloudFormation stack does include a static Elastic IP address, but 
does not automatically manage DNS configuration. Separately configure your
domain name to point at the EC2 server's IP address.

| Record Type | Name          | Value         | 
| ----------- | ------------- | ------------- |
| A           |               | *Elastic IP*  |
| CNAME       | www           | *TL_HOSTNAME* |
| CNAME       | odk           | *TL_HOSTNAME* |


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
### Backups
Here is some documentation.  [http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html]
### Restore
Here is how to restore to a point in time.
[http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html]

