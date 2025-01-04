# Server Management
Currently there is only a prod instance of the synapse server live. It is deployed to a machine that we have on DigitalOcean using an ansible script. The script takes a plain linux box and sets it up to run the synapse server. [This is the original ansible script.](https://github.com/spantaleev/matrix-docker-ansible-deploy) We have a fork of this repo under the quiri-io organization.

# Domain name
The domain name (quiri.io) is owned by Nigel and is under his personal email.
I used Google Domains to set up the matrix.quiri.io and element.quiri.io domains and have them pointing to the DigitalOcean droplet
https://www.youtube.com/watch?v=YfAcvLuFMZI
As per [the DNS Setup instructions](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-dns.md) from the ansible script

The base domain is pointing to the vercel-hosted landing page. [We need to set up vercel to serve the `.wellknown` files.](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-base-domain-serving.md#serving-a-more-complicated-website-at-the-base-domain)

# [Configuring the Ansible Playbook](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook.md#configuring-the-ansible-playbook)
- the `vars.yml` is in bitwarden under `ansible vars.yml`
- the `hosts` file is in bitwarden under `ansible hosts file`
    - set `ansible_host` to the IP of the DigitalOcean droplet

# [Setting up Droplet to be sshed into using SSH Key](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/)
Needed to set up the [droplet with the key ahead of time](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/to-account/)
I had to destroy the droplet and recreate it with the SSH key option
I named my ssh key locally to id_rsa_matrix_quiri, and stored a passphrase for it in Bitwarden
- the private/public key are also in bitwarden
    - you will need to create the files manually and paste the contents in and then use the chmod commands that are attached to them to set their permissions appropriately


# Running the ansible script
- [Use the docker option.](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/ansible.md#using-ansible-via-docker)
- You will need to change the mapping to the id_rsa file if you gave it a non-standard name like I did
- [Before running, make sure that the matrix_nginx_proxy_base_domain_serving_enabled: true is set and the domain record is set appropriately](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-base-domain-serving.md)
- [Finally running the ansible script](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/installing.md)
    - the script will ask for the password for the private key. You can find it in bitwarden as a custom field under `id_rsa_matrix_quiri private key`

Register first admin user manually
https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/registering-users.md

[Then set up the synapse admin](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-synapse-admin.md)
And create other users there

# Upgrading Synapse
- [follow these docs](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/maintenance-upgrading-services.md)
    - I had to upgrade because the flutter SDK was not compatible with the server version
        - I may have to upgrade the postgres database as well because it was a major version bump...


# Notes on potentially deploying a custom docker image in the future
- We are developing on top of synapse and thus need to be deploying our version of synapse rather than the one distributed on dockerhub
- Since we are using DigitalOcean for the server right now, we will also use [the digital ocean private container registry](https://www.digitalocean.com/products/container-registry)
- New images are pushed to [the registry from local](https://docs.digitalocean.com/products/container-registry/how-to/use-registry-docker-kubernetes/)
- The ansible scripts need to be updated to accept login details and then pull from the private registry

- Looks like you can build from a git repo… but then you would need to have the ssh key… probably just do the docker login separately and pull from the private repo
    - The docker image that is pulled for synapse is set here `roles/matrix-synapse/defaults/main.yml`
- The actual pull happens here roles/matrix-synapse/tasks/synapse/setup_install.yml
    - There is a way to have matrix built from a repository BUT it looks like it will need to be a public repo. And it needs to use the same versioning that the official repo does
- Looks like the way forward is to add a new option that pulls from a provided registry URL after logging in to the private repo (if the repo is private)
