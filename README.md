# K8s-Fundamental

## Architecture

<summary>Kubernetes Architecture</summary>
<details>
  <img width="1200" height="672" alt="image" src="https://github.com/user-attachments/assets/abfc0859-f36f-4fb4-9312-84b7e4e4d8b2" />
  <img width="1197" height="672" alt="image" src="https://github.com/user-attachments/assets/c8ea1174-a22e-4ab2-986d-cad652be71c0" />
  <img width="1200" height="675" alt="image" src="https://github.com/user-attachments/assets/b8264ca3-9225-4787-b1ba-af1778c30ac0" />
  <img width="1197" height="674" alt="image" src="https://github.com/user-attachments/assets/2ec1facc-cf8f-4fb8-9acf-767d9c605f21" />
  <img width="1199" height="672" alt="image" src="https://github.com/user-attachments/assets/1545a0bb-4060-4256-9514-0e2be493f341" />
  <img width="1200" height="669" alt="image" src="https://github.com/user-attachments/assets/f4895bba-d2af-4000-85af-dbb5e417e8f2" />
  <img width="1196" height="672" alt="image" src="https://github.com/user-attachments/assets/08297c68-9248-4a85-885a-7ebb7c3becba" />
  <img width="1198" height="674" alt="image" src="https://github.com/user-attachments/assets/fe299b8a-e725-4314-88dc-60ec6027dd80" />
  <img width="1196" height="677" alt="image" src="https://github.com/user-attachments/assets/e0d4982f-3310-4344-9150-4e0e05940c3e" />

  # Kubernetes Architecture Deep Dive

## Overview

Kubernetes is a container orchestration platform that manages containerized applications across a cluster of machines. Its architecture is designed for high availability, scalability, and flexibility. The architecture of Kubernetes can be broken down into two main components: the **Control Plane** and **Nodes**. The Control Plane manages the overall cluster and the nodes run the containerized applications.

## Kubernetes Control Plane

The **Control Plane** is responsible for the global control and management of the Kubernetes cluster. It makes global decisions about the cluster, such as scheduling, managing the lifecycle of applications, and responding to failures. The Control Plane consists of several components that interact with each other:

### Key Components of the Control Plane

#### 1. **API Server (kube-apiserver)**
   - The API Server is the central component of the Kubernetes control plane and serves as the gateway to the cluster. It exposes the Kubernetes API, which is used by all the other components and users to communicate with the cluster.
   - It is responsible for validating and processing REST API requests and ensuring they are correctly processed and stored in the cluster's state.
   - The API Server interacts with other control plane components like the **Scheduler**, **Controller Manager**, and **etcd** to store and retrieve the cluster state.
   
   **Key Responsibilities:**
   - Accepts and processes API requests from users, services, and other components.
   - Manages communication between clients (kubectl, applications) and the Kubernetes system.
   - Scales with horizontal pod autoscaling (more API server instances to handle traffic).

#### 2. **Controller Manager (kube-controller-manager)**
   - The Controller Manager runs various controllers that handle routine tasks in the Kubernetes cluster.
   - Controllers are responsible for ensuring the desired state of the cluster is achieved. For example, a replication controller ensures that the desired number of replicas for a pod are running.
   
   **Common Controllers:**
   - **ReplicaSet Controller**: Ensures the correct number of replicas for a given pod are running.
   - **Deployment Controller**: Manages rolling updates and ensures the desired state of the application deployment.
   - **Node Controller**: Responsible for managing node lifecycle events like adding or removing nodes.
   
   **Key Responsibilities:**
   - Ensures that the desired state of the cluster is maintained.
   - Reacts to events like pod failures, node failures, or application updates and takes corrective actions.

#### 3. **Scheduler (kube-scheduler)**
   - The Kubernetes Scheduler is responsible for assigning newly created pods to specific nodes in the cluster based on resource availability and constraints.
   - It evaluates which node would be the best fit for a given pod, considering factors like CPU, memory, and custom node selectors.

   **Key Responsibilities:**
   - Chooses nodes for new pods based on resource availability.
   - Takes into account node constraints (e.g., hardware type, availability zones) and pod-specific requirements (e.g., affinity, taints).
   
#### 4. **etcd**
   - **etcd** is a distributed key-value store that serves as the persistent storage for the entire cluster's state. It stores all cluster data, including configurations, secrets, and the desired state of the cluster.
   - It is highly available and ensures that cluster data is replicated across all nodes in the cluster.

   **Key Responsibilities:**
   - Stores the configuration data and the state of the cluster.
   - Enables consistent state across the cluster in case of node failure.
   - Ensures that Kubernetes components can synchronize their state.

## Nodes in Kubernetes

The **Node** is a physical or virtual machine that runs applications and workloads in the Kubernetes cluster. Every node in a Kubernetes cluster contains the necessary components to run pods and provide the computational resources needed for workloads.

### Key Components of a Node

#### 1. **kubelet**
   - The kubelet is an agent that runs on every node in the cluster. It is responsible for ensuring that containers are running in pods and reporting their status to the Control Plane.
   - It interacts with the container runtime (like Docker or containerd) to manage the containers.

   **Key Responsibilities:**
   - Ensures that the containers defined in the pod specs are running.
   - Reports the health and status of the pods to the API server.
   - Handles pod lifecycle events (starting, stopping, restarting).

#### 2. **Container Runtime**
   - The container runtime is the software responsible for running containers on the node. It is typically either **Docker**, **containerd**, or **CRI-O**.
   - The runtime pulls images, starts containers, and manages container lifecycle operations.

   **Key Responsibilities:**
   - Running containers based on the pod definition.
   - Handling container creation, monitoring, and lifecycle events.
   
#### 3. **kube-proxy**
   - The kube-proxy is responsible for managing network traffic between services and ensuring that network rules are applied properly on the node. It handles services and load balancing for traffic directed to pods.

   **Key Responsibilities:**
   - Maintains network rules for pod communication.
   - Implements service abstraction for load balancing and routing.
   - Routes traffic to the correct pod IPs based on service definitions.

## Interaction Between Control Plane and Nodes

- The **Control Plane** makes high-level decisions about the cluster (e.g., which pod should run on which node), while **Nodes** are where the actual workloads are executed.
- The **API Server** communicates with the **kubelet** on each node to ensure that containers are running as expected.
- The **Scheduler** assigns new pods to nodes based on available resources, and the **Controller Manager** continuously ensures that the desired state (e.g., number of replicas) is maintained by interacting with the API server.

## High-Level Architecture Diagram
<img width="1205" height="678" alt="image" src="https://github.com/user-attachments/assets/9769d079-8a64-4a30-a04e-1a780849fbaa" />
# Deep Dive into Kubernetes Workflow: Step-by-Step Explanation

## Overview

This document explains the flow of interactions in Kubernetes when a client sends a request to create or manage resources (such as Pods) in the cluster. The components involved include the **API Server**, **etcd**, **Scheduler**, **Kubelet**, **Container Runtime**, and **Kube-Proxy**.

## Step-by-Step Breakdown of Kubernetes Architecture

### **Step 1: Client Sends a Request to the API Server**

- **Client Interaction**: A client (such as `kubectl`, another service, or an application) sends an API request to the **API Server** to perform an operation. This could be creating a pod, scaling a deployment, updating a configuration, etc.
  
    - **Example**: `kubectl apply -f mypod.yaml`
    - The request contains data like the desired state of the system, such as the definition of a pod, deployment, or service.

- **API Server's Role**: The **API Server** is the gateway to the Kubernetes cluster. It exposes the **Kubernetes API**, listens for incoming REST API calls, validates the requests, and processes them.
    - If the request is valid, the **API Server** checks for authorization (who is making the request) and authentication (valid user/service).
    - If the request passes security checks, the API Server accepts the request and moves to the next step.

---

### **Step 2: API Server Writes to `etcd`**

- **etcd Interaction**: Once the request is validated, the API Server needs to persist the data (e.g., the desired state of the cluster) to the **etcd** distributed key-value store.
    - **etcd** serves as the source of truth for Kubernetes. It stores all configuration data, cluster state, secrets, deployments, pods, and other resources.
    
    - **Write to etcd**: The API Server writes the incoming data (e.g., a new Pod definition) to **etcd**. The write operation in **etcd** is a critical part of maintaining consistency in the cluster. **etcd** stores the state in the form of key-value pairs, with each key representing a particular resource or object (like a Pod, Service, or Deployment).
    
    - **Replication in etcd**: Since **etcd** is a distributed system (multi-node), it ensures that the data is replicated across multiple **etcd** nodes for high availability and consistency. This means that if one **etcd** node fails, the data is still available from the others.

    - **Final State in etcd**: The cluster state in **etcd** is eventually consistent. Any component that needs the current state (such as the **Scheduler** or **Controller Manager**) queries **etcd** to get the most recent version of the cluster's desired state.

---

### **Step 3: API Server Returns Response to Client**

- **Response to Client**: After writing the data to **etcd**, the **API Server** sends a response back to the client to confirm the action. If the request was successful, the response contains the status of the operation (e.g., "Pod created successfully").
  
    - If there were any issues (e.g., validation errors), the API Server would return an error response with a relevant message.

- **API Server is Central Hub**: The API Server acts as the hub that interacts with all other components (etcd, Scheduler, Controller Manager, Kubelet, etc.), allowing users and services to interact with the Kubernetes system.

---

### **Step 4: Scheduler Watches for New Workloads (e.g., Pods)**

- **Scheduler's Role**: After a new pod definition has been written to **etcd**, the **Scheduler** starts watching for unscheduled pods that need to be assigned to a node.

    - The **Scheduler** runs as a background process and listens to the **API Server** for changes. It queries the **API Server** for new unscheduled pods and looks for available nodes to run the pod.
  
    - **Pod Scheduling Decision**: The **Scheduler** takes into account various factors like:
      - Available resources (CPU, memory, etc.)
      - Node Affinity (preferred nodes based on labels)
      - Taints and Tolerations (allowing/disallowing certain nodes to run the pod)
      - Pod Affinity/Anti-Affinity (ensuring that pods are scheduled together or apart)

- **Scheduler's Action**: Once the **Scheduler** selects an appropriate node, it updates the pod's definition in **etcd** with the **node** name (where the pod will be scheduled).
    - This update in **etcd** triggers further actions in the system (i.e., Kubelet on the selected node will be notified).

---

### **Step 5: Kubelet Watches the API Server**

- **Kubelet’s Role**: Each **Node** in Kubernetes runs a **kubelet** (a.k.a. agent). The **kubelet** is responsible for ensuring that containers in the pods are running properly on the node. It watches the **API Server** for changes and receives the updated pod specifications that include the node where the pod should run.

    - **Kubelet Watches API Server**: The **kubelet** watches for updates in **etcd** (via the **API Server**) that indicate it has a pod to run on its node.
    - It is constantly polling the **API Server** for new pod assignments (based on the pod’s `nodeName`) and changes in the pod status (e.g., transitioning from Pending to Running).

---

### **Step 6: Kubelet Pulls Container Image and Starts the Pod**

- **Container Runtime**: The **kubelet** then instructs the **container runtime** (e.g., Docker, containerd) to pull the necessary container images from a registry (e.g., Docker Hub or a private registry).
  
    - If the container image is already cached on the node, the **container runtime** will skip pulling the image.
    - The container runtime then starts the container based on the pod's specification (e.g., CPU, memory limits, environment variables).

- **Pod Starts**: Once the container runtime successfully starts the container, the **kubelet** reports the status back to the **API Server** (via `kube-apiserver`). The pod’s status transitions from **Pending** to **Running** in **etcd**, and the cluster’s state is updated.

    - The **API Server** updates the **etcd** store with the pod’s running state.
    - The **Controller Manager** might be involved if this pod is part of a Deployment, ReplicaSet, or StatefulSet, ensuring the desired number of replicas are running.

---

### **Step 7: Kubelet and Kube-Proxy Manage Pod Networking**

- **Kubelet's Role**: The **kubelet** configures and ensures that the container inside the pod is running correctly and has the necessary networking configurations (e.g., assigning IPs).
  
- **Kube-Proxy's Role**: Once the pod is running, the **kube-proxy** on the node ensures that the pod is part of the networking mesh. It creates necessary network routes so that the pod can communicate with other pods in the cluster.

    - **Service Discovery**: If the pod is part of a service, the **kube-proxy** sets up the required iptables rules to ensure that requests to the service are correctly routed to the pod.

---

### **Step 8: Continuous Monitoring and Feedback**

- The **Controller Manager** monitors the state of the system to ensure it meets the desired state. If a pod fails, is terminated, or crashes, the **Controller Manager** will trigger the creation of a new pod (e.g., using a ReplicaSet or Deployment).
  
- The **kubelet** continuously monitors the pod and container health, reporting back to the **API Server** if a pod is unhealthy or needs to be restarted.

---

## Summary of Flow:

1. **Client** sends a request to the **API Server** (e.g., create pod).
2. The **API Server** validates and processes the request, then writes the data to **etcd**.
3. The **API Server** responds to the client with confirmation.
4. The **Scheduler** detects new pods in need of scheduling and assigns them to available nodes.
5. The **Kubelet** on the chosen node watches the **API Server** for pod assignments, then pulls container images and starts the containers.
6. **Kube-Proxy** configures networking for the pod to ensure it can communicate with other parts of the system.
7. The system continuously monitors the health of pods, ensures the desired state is maintained, and updates **etcd** as necessary.

---

This flow outlines how Kubernetes manages a request from start to finish, ensuring scalability, reliability, and high availability across a distributed environment. Each component plays a critical role in managing workloads, ensuring state consistency, and coordinating actions across the cluster.


</details>

## Overview
- OS: Mac (Catinal)

## Link
- [K8s](https://www.youtube.com/watch?v=d6WC5n9G_sM)

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
- delete all `kubectl delete all --all`

## User file Yaml
- `kubectl apply -f [name]` || `[name] can be deployment, servce`

# DEMO

## Prerequisite
- have account docker hub
- build image `docker build -t [name-image] .`
- login to docker `docker login`


## Rolling Update
- st1: change image, re-build and push it to docker-hub
- st2: update image in deployment `kubectl set image deployment [name-deployment] [name-pod]=[new-image]`
- checking status of update => `kubectl rollout status deploy [name-deployment]`
