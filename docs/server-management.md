# Server Management

# Domain name
The domain name (quiri.io) is owned by Nigel and is under his personal email.
I used Google Domains to set up the matrix.quiri.io and element.quiri.io domains and have them pointing to the DigitalOcean droplet
https://www.youtube.com/watch?v=YfAcvLuFMZI
As per the DNS Setup instructions from the ansible script

# Configuring the Ansible Playbook
Secrets/passwords are in Bitwarden

# Setting up Droplet to be sshed into using SSH Key
Needed to set up the droplet with the key ahead of time
I had to destroy the droplet and recreate it with the SSH key option
I named my ssh key locally to id_rsa_matrix_quiri, and stored a passphrase for it in Bitwarden


# Running the ansible script
Use the docker option
You will need to change the mapping to the id_rsa file if you gave it a non-standard name like I did
Before running, make sure that the matrix_nginx_proxy_base_domain_serving_enabled: true is set and the domain record is set appropriately
Finally running the ansible script

Register first admin user manually
https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/registering-users.md

Then set up the synapse admin
And create other users there


# Deploying a custom docker image
We are developing on top of synapse and thus need to be deploying our version of synapse rather than the one distributed on dockerhub
Since we are using DigitalOcean for the server right now, we will also use the digital ocean private container registry
New images are pushed to the registry from local
The ansible scripts need to be updated to accept login details and then pull from the private registry

Looks like you can build from a git repo… but then you would need to have the ssh key… probably just do the docker login separately and pull from the private repo
The docker image that is pulled for synapse is set here `roles/matrix-synapse/defaults/main.yml`
The actual pull happens here roles/matrix-synapse/tasks/synapse/setup_install.yml
There is a way to have matrix built from a repository BUT it looks like it will need to be a public repo. And it needs to use the same versioning that the official repo does
Looks like the way forward is to add a new option that pulls from a provided registry URL after logging in to the private repo (if the repo is private)
