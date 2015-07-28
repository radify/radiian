[ ![Codeship Status for radify/radiian](https://codeship.com/projects/b48eb730-0eb6-0133-f4b7-6a87ab38c290/status?branch=master)](https://codeship.com/projects/91776)

# radiian

## Radify Immutable Infrastructure for Ansible

### What is radiian? 
radiaan sets up a skeleton Ansible playbook with immutable infrastructure on Amazon AWS. It does so by deploying a very 
basic static website to EC2 immutably, complete with:
* Security Group
* Load Balancer
* EC2 Node(s)

### What is immutable infrastructure? 
"Immutable infrastructure, or an immutable deployment, is where infrastructure never changes - it is completely replaced
when a deployment happens. Immutable infrastructure is an attempt to control the amount and location of state in a system. 
Instead of the historical pattern of having a group of servers and maintaining them over time, immutable infrastructure 
creates new servers on every deploy. You install your application on them, add them to the load balancer, and then remove 
and destroy the old nodes. You can achieve rapid results by having a custom base box, which you provision in advance, so
that only your code needs to be deployed" (Gavin Davies).

Please read [_Reducing Infrustration_](http://radify.io/blog/reducing-infrustration/) to learn about immutable 
infrastructure in far greater details. 

We also recommend these additional articles to learn more. 
* [Painless Immutable Infrastructure with Ansible and AWS](http://radify.io/blog/painless-immutable-infrastructure-with-ansible-and-aws/)
* [Immutable Demo Nodes](http://radify.io/blog/immutable-demo-nodes/)
* [Forward-Only Deployments](http://radify.io/blog/forward-only-deployments/)

### Prerequisites
You should already have set up the following:

* Virtual Private Cloud (VPC)
* Load balancer
* Security group
* A domain in route 53 

### Install
`npm install -g radiian`

### Setup

In your project folder, run `radiian init`. Radiaan will then ask you a series of questions to setup your Ansible configuration.

When finished, your project will have an ansible folder with all of the necessary playbooks in it. The output will read:
`Your playbook has been created in the directory ./ansible`

You can then run it with:
```
cd ansible
./provision.sh
```

### Semantic Versioning
Radiian, like npm, uses [semantic versioning.](http://semver.org/) Versions tags are found in `git`, `package.json`, and `cli.js -V`.
To keep them all synchronized, we do *not* use `git tag` directly. Rather, we run `npm version x.y.z`, which updates the
version number both in `package.json` and in `git`. (In fact, it adds a new `tag` commit automatically.) Because `cli.js`
receives its version number from `package.json`, there is never a need to update its versioning.

## License

radiian is released under the [MIT License](http://www.opensource.org/licenses/MIT).
