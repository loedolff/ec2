import dotenv from 'dotenv';
import { EC2, config } from 'AWS-sdk';
import fs from 'fs'
import YAML from 'yaml'

const appConfigFile = fs.readFileSync('config.yaml', 'utf8');
const appConfig = YAML.parse(appConfigFile);

dotenv.config({ path: '.secrets/aws.env' })
config.update({});
const ec2 = new EC2({apiVersion: '2016-11-15'});
const instanceName = appConfig.instance.name;

const createInstance = () => {
    const instanceParams = {
        SubnetId: process.env['vpc.public.subnet.id'],
        SecurityGroupIds: [
            process.env['vpc.security.group']
        ],
        ImageId: 'ami-098e42ae54c764c35',
        InstanceType: 't3a.micro',
        KeyName:  process.env['ssh.key.name'],
        MinCount: 1,
        MaxCount: 1,
        BlockDeviceMappings: [{
            DeviceName: '/dev/xvda',
            Ebs: {
                VolumeType: 'gp3',
                // todo: check if it's 8 gb. maybe enforce it.
            }
        }]
    };

    const instancePromise = ec2.runInstances(instanceParams).promise();

    // Handle promise's fulfilled/rejected states
    instancePromise.then(
        function (data) {
            console.log(data);
            var instanceId = data.Instances[0].InstanceId;
            console.log("Created instance", instanceId)
            // Add tags to the instance
            const tagParams = {
                Resources: [instanceId], Tags: [
                    {
                        Key: 'Name',
                        Value: instanceName
                    }
                ]
            };
            // Create a promise on an EC2 service object
            var tagPromise = new EC2({apiVersion: '2016-11-15'}).createTags(tagParams).promise();
            // Handle promise's fulfilled/rejected states
            tagPromise.then(
                function (data) {
                    console.log("Instance tagged");
                }).catch(
                function (err) {
                    console.error(err, err.stack);
                });
        }).catch(
        function (err) {
            console.error(err, err.stack);
        });
}

function describeInstance(callback: (err,data)=>void) {
    const instance = {
        Filters: [
            {
                Name: 'tag:Name',
                Values: [instanceName]
            }
        ]
    }
    return ec2.describeInstances(instance).send(callback);
}

describeInstance((err, data) => {
    if (err) {
        throw err;
    }
    if (data.Reservations.length == 0) {
        console.log("No instance named [" + instanceName + "] found. Creating it")
        createInstance();
    } else {
        console.log("Instance found");
        console.log(data.Reservations[0]);
    }
});

// configure security group to allow ssh ingress. actually, just document it in the readme.

// automatically edit ~/.ssh/config to add

// Host <name>
    // HostName <dns from the describe>
    // User ec2-user
    // IdentityFile ~/.ssh/<>.pem  <--- make this a config parameter

// sudo amazon-linux-extras install epel -y
// sudo yum install -y chromium

// install nvm

// curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
// source .bashrc
// nvm install --lts

// install software:
// sudo yum install git followed by git clone <git location>

// which needed

