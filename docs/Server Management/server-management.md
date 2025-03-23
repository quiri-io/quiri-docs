## Server Management
Currently there is only a staging instance of the synapse server live. It is deployed to a machine that we have on DigitalOcean using an ansible script. The script takes a plain linux box and sets it up to run the synapse server. [This is the original ansible script.](https://github.com/spantaleev/matrix-docker-ansible-deploy) We have a fork of this repo under the quiri-io organization to hold our configurations.

## Setting up the DigitalOcean droplet
### [Configure an SSH key to be associated with the droplet](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/to-account/)
I named my ssh key locally to id_rsa_matrix_quiri, and stored a passphrase for it in Bitwarden
- the private/public key are also in bitwarden
    - you will need to create the files manually and paste the contents in and then use the chmod commands that are attached to them to set their permissions appropriately
### Create the droplet using terraform
See the [quiri-infra repo](https://github.com/quiri-io/quiri-infra) for the terraform code and how to deploy it.
A successful `terraform apply` will output the public IP of the droplet required to run the ansible playbook to install matrix on the droplet.

## DNS Configuration
The registrar for `quiri.io` is google `Cloud Domains` (in my **personal** GCP account under the `quiri-domain` project).
The DNS records are managed in GCP `Cloud DNS` (in my **quiri.io** GCP account under the `quiri-domain` project). The `matrix.quiri.io` and `element.quiri.io` domains are pointing to the DigitalOcean droplet
as per the [DNS Setup instructions](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-dns.md) from the ansible script

The base domain is pointing to the vercel-hosted landing page. This complicates the setup because the `.well-known` files need to be hosted at the base domain. One option is to [add redirects into Vercel.](https://vercel.com/docs/edge-network/redirects#vercel-functions)
[There are other options as well.](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-base-domain-serving.md#serving-a-more-complicated-website-at-the-base-domain) For now it seems that this may not have an impact on us as we are not federating with any other matrix servers and may be able to work around the lack of a `.well-known` client file on the base domain.
### Troubleshooting
When installing matrix on the server before the DNS was configured, traefik would use the default certificate for SSL which browsers do not trust. Traefik does some magic where they create a LetsEncrypt cert (or other cert depending on how you configure it) when you make a request to it. It seems that there are some requests being made to the droplet (crawlers?) that are causing traefik to use the default cert. Once the DNS record is propagated and the droplet is associated with `matrix.quiri.io` it seems that it continues to use the default traefik cert. Re-running the ansible script at this time appears to clear out the certs and resolve the issue. One way to avoid this is to wait for the matrix installation to be complete before pointing the DNS to it. This is not an ideal deployment process.

## SendGrid as SMTP relay
### Set up SendGrid
- create a SendGrid account
- create a sender called `noreply@quiri.io`
- associate `noreply@quiri.io` alternative email with my quiri email in Google Admin console
- [authenticate the domain](https://www.twilio.com/docs/sendgrid/ui/account-and-settings/how-to-set-up-domain-authentication) by adding some DNS records (to improve deliverability)
### Configure matrix to use the Sendgrid
- [create sendgrid API key](https://app.sendgrid.com/settings/api_keys) with send permissions
- refer to the [playbook docs](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-email.md#relaying-email-through-another-smtp-server) for what to set in the `vars.yml`

## [Configuring the Ansible Playbook](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook.md#configuring-the-ansible-playbook)
- the `vars.yml` file configures a number of ansible script behaviours but is also used to generate the `homeserver.yaml`
    - see [the example `vars.yml`](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/6b87d1aa7d24ce99578a252317670c80e4891be2/examples/vars.yml) provided by the ansible playbook owners
    - to map settings from the development `homeserver.yaml` to the deployed `homeserver.yaml` find the associated ansible variable in the [`homeserver.yaml.j2` template](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/f0cc5da229a83526b35690cad628552b59dae563/roles/custom/matrix-synapse/templates/synapse/homeserver.yaml.j2) and set it in the `vars.yml`
    - the most recent `vars.yml` is in bitwarden under `ansible vars.yml`
- the `hosts` file is in bitwarden under `ansible hosts file`
    - set `ansible_host` to the public IP of the DigitalOcean droplet

## Running the ansible script
- [I used the "run ansible in docker from your local machine" option](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/ansible.md#running-ansible-in-a-container-on-another-computer-not-the-matrix-server)
- this is the command I used to start the container and get to the shell prompt:
    - ```
    docker run -it --rm \
        -w /work \
        -v `pwd`:/work \
        -v $HOME/.ssh/id_rsa_matrix_quiri:/root/.ssh/id_rsa:ro \
        -v $HOME/.ssh/id_ed25519:/root/.ssh/id_ed25519:ro \
        --entrypoint=/bin/sh \
        docker.io/devture/ansible:2.18.1-r0-0
    ```
    - I changed the mapping to the id_rsa file because I gave it a non-standard name
    - I also mapped my github ssh key to the container so that I could run the `just update` successfully
- [Then follow the instructions to run the ansible script in the container](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/installing.md)
    - the script will ask for the password for the private key. You can find it in bitwarden as a custom field under `id_rsa_matrix_quiri private key`

## Set up admin user
- [register first admin user manually](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/registering-users.md)
- [then set up the synapse admin](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-synapse-admin.md)
    - and create other users there

## Upgrading Synapse
- [there are specific steps to follow when upgrading](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/master/docs/maintenance-upgrading-services.md)


## Notes on potentially deploying a custom matrix docker image in the future using the same script
- We are developing on top of synapse and thus need to be deploying our version of synapse rather than the one distributed on dockerhub
- Since we are using DigitalOcean for the server right now, we will also use [the digital ocean private container registry](https://www.digitalocean.com/products/container-registry)
- New images are pushed to [the registry from local](https://docs.digitalocean.com/products/container-registry/how-to/use-registry-docker-kubernetes/)
- The ansible scripts need to be updated to accept login details and then pull from the private registry

- Looks like you can build from a git repo… but then you would need to have the ssh key… probably just do the docker login separately and pull from the private repo
    - The docker image that is pulled for synapse is set here `roles/matrix-synapse/defaults/main.yml`
- The actual pull happens here roles/matrix-synapse/tasks/synapse/setup_install.yml
    - There is a way to have matrix built from a repository BUT it looks like it will need to be a public repo. And it needs to use the same versioning that the official repo does
- Looks like the way forward is to add a new option that pulls from a provided registry URL after logging in to the private repo (if the repo is private)
