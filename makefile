.DEFAULT_GOAL: help
.SILENT: help prevent create-dev create-prod active-dev active-prod start-devstart-prod provision reset kill info info-full stats ssh swarm-init swarm-join
.PHONY: help

# todo
# phony, api key en config, projectname env var,
#info: docker node
#create-local, create-google,... ?
#passer les command en  revu pour make info
#network

project_name=pharmakon-machine
project_name_dev=$(project_name)-dev
project_name_prod=$(project_name)-prod

node_communication_port=2377

help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-10s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

prevent: ## display current active machine before exec cmd
	echo "machine => $(GREEN_COLOR)$(shell docker-machine active)$(NO_COLOR)"

create-dev: ## create dev machine
	docker-machine create $(project_name_dev) \
		--driver=virtualbox \
		--virtualbox-memory=1024 \
    	--virtualbox-disk-size=10000 \
    	--virtualbox-share-folder=$pwd \
		$(args)

create-prod: ## create prod machine
	docker-machine create $(project_name_prod) \
		--driver=google \
    	--google-project=rp-171015 \
    	--google-zone=europe-west3-b \
    	--google-machine-type=n1-standard-1 \
    	--google-machine-image=https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images/family/ubuntu-1604-lts \
    	--google-disk-size=10 \
    	--google-tags=docker,machine,pharmakon \
		$(args)

create-google: ## create a google cloud machine
	docker-machine create $(machine) \
		--driver=google \
    	--google-project=rp-171015 \
    	--google-zone=europe-west3-b \
    	--google-machine-type=n1-standard-1 \
    	--google-machine-image=https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images/family/ubuntu-1604-lts \
    	--google-disk-size=10 \
    	--google-tags=docker,machine,$(machine) $(args)
	gcloud compute firewall-rules create machine-$(machine)--tcp-in--2377 --allow tcp:2377 --target-tags=machine,$(machine) --source-ranges=0.0.0.0/0
	gcloud compute firewall-rules create machine-$(machine)--udp-in--4789 --allow udp:4789 --target-tags=machine,$(machine) --source-ranges=0.0.0.0/0
	gcloud compute firewall-rules create machine-$(machine)--udp-in--7946 --allow udp:7946 --target-tags=machine,$(machine) --source-ranges=0.0.0.0/0
	gcloud compute firewall-rules create machine-$(machine)--tcp-in--7946 --allow tcp:7946 --target-tags=machine,$(machine) --source-ranges=0.0.0.0/0
	gcloud compute addresses create $(machine) --addresses $(shell docker-machine ip $(machine))

active-dev: ## display command to activate dev machine
	docker-machine env $(project_name_dev) $(args)

active-prod: ## display command to activate prod machine
	GOOGLE_APPLICATION_CREDENTIALS=$(HOME)/keys/romainprignon/gcloud/api_key.json \
	docker-machine env $(project_name_prod) $(args)

start-dev: ## start dev machine
	docker-machine start  $(args) $(project_name_dev)

start-prod: ## start prod machine
	docker-machine start  $(args) $(project_name_prod)

provision: prevent ## run provisionning on current active machine
	docker-machine ssh $(shell docker-machine active) sudo apt install iotop

reset: ## display command to activate local machine
	docker-machine env -u

stop: prevent ## stop current active machine
	docker-machine stop $(shell docker-machine active)

rm: prevent ## remove current active machine
	docker-machine rm $(shell docker-machine active)

info: prevent ## summarize info on current active machine
	echo ================================================== && \
	docker-machine ls | grep $(shell docker-machine active) && \
	echo ================================================== && \
	docker network ls                                       && \
	echo ================================================== && \
	docker volume ls                                        && \
	echo ================================================== && \
	docker system df                                        && \
	echo ================================================== && \
	docker-machine config $(shell docker-machine active)    && \
	echo ================================================== && \
	docker ps

info-full: prevent ## full info on current active machine
	docker system info

stats: prevent ## list containers of current active machine
	docker stats $(args)

ssh: prevent ## ssh into current active machine
	docker-machine ssh $(shell docker-machine active) $(args)

swarm-init: ## join cluster (ex: make swarm-init manager=<the_manager>)
	docker-machine ssh $(manager) sudo docker swarm init --advertise-addr $(shell docker-machine ip $(manager))

swarm-join: ## join cluster (ex: make swarm-join manager=<the_manager> worker=<the_worker> token=<the_token>)
	docker-machine ssh $(worker) \
	sudo docker swarm join $(shell docker-machine ip $(manager)):$(node_communication_port) \
		--token $(token)

swarm-uptime:
	docker node ls | cut -c 31-55 | grep -v HOSTNAME | xargs -I"SERVER" sh -c "echo SERVER; docker-machine ssh SERVER uptime"

swarm-memory:
	docker node ls | cut -c 31-55 | grep -v HOSTNAME | xargs -I"SERVER" sh -c "echo SERVER; docker-machine ssh SERVER free -m"

swarm-stats:
	docker node ls | cut -c 31-55 | grep -v HOSTNAME | xargs -I"SERVER" sh -c "echo SERVER; docker-machine ssh SERVER docker stats --no-stream"

GREEN_COLOR = \033[0;32m
NO_COLOR = \033[m
