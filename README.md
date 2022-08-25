# K8s-Fundamental

## Overview
- OS: Mac (Catinal)

## Prerequisite
- minikube `brew install minikube`
- kubtectl `brew install kubectl`


## Open minikube dashboard
- `minikube dashboard`

## Command line

### Minikube
- start minikube =>  `minikube start --driver=hyperkit`
- check status of minikube => `minikube status`
- check ip of minikube => `minikube ip`


### Kubtectl
- check infor of kubutectl => `kubtectl cluster-info`
- get all nodes => `kubectl get nodes`
- get pods => `kubtectl get pods`
- get namespace => `kubectl get namespace`
- delete pod => `kubectl delete pod [name_pod]`


## Create Single Pod
- create pod => `kubectl run [name] --image=[name_of_image]`
- ex: `kubectl run nginx --image=nginx`

- check pod => `kubectl get pods`
- get describe => `kubectl describe pod [name_of_pod]`
- ex: `kubectl describe pod nginx`
- debug `kubectl logs [name_of_pod]`

- check hostname `hostname`
- check ip of hostname `hostname -i`

- check ip of pods `kubectl get pods -o wide`


## Create temporary alias in this process
- `alias [key]="[command]"`
- ex: alias="kubectl"



## Create Deployment
- `kubectl create deployment [name_deployment] --image=[name_image]`
- get deployment `kubectl get deployment`
- describe deployment `kubectl describe deployment [name]`
- scale => `kubectl scale deployment [name_deployment] --replicas=[number]`
- delete deployment `kubectl delete [name-deployment]`


## Expose Service
- `kubectl expose deployment [name_deployment] --port=[external_port] --target-post=[container_port]`
- ex: kubectl expose deployment nginx-depl --port=8080 --target-port=80
- delete service `kubectl delete [name-service]`



# DEMO

## Prerequisite
- have account docker hub
- build image `docker build -t [name-image] .`
- login to docker `docker login`
