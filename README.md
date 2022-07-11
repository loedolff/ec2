
AWS API reference documentation https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_Operations.html

To use the scripts in this project, create a .secrets directory and create
the file .secrets/aws.env and populate it with these secrets:

todo: replace this with yaml. why not.
```
# todo: say where to get these
AWS_ACCESS_KEY_ID=<your AWS access key id>
AWS_SECRET_ACCESS_KEY=<your AWS secret access key>
AWS_REGION=<aws region>

# todo: say how to get these
vpc.public.subnet.id=<the target public VPC subnet id for new instances>
vpc.security.group=<the VPC security group> // is this maybe not needed? i should check
ssh.key.name=<your ssh key name>
```

Edit config.yaml to suit your needs.

todo: 
* write a script to terminate the intance and delete the instance name
from the ssh config file.