const {framework} = require('./framework')

const GREEN_COLOR = '$(tput setaf 2)'
const NO_COLOR = '$(tput sgr0)'

const colorfull = (mine) => `echo with color mine ${GREEN_COLOR}${mine}${NO_COLOR} and ${GREEN_COLOR}$(${msg()})${NO_COLOR} and without $(${barMsg()})`

const msg = () => `echo $(${barMsg()})`

const barMsg = () => `echo bar`


const echoEnv = () => `echo $FOO`

function* testEnv() {
    yield `echo $PATH`
    yield echoEnv()
}


function* goDeeper() {
    yield `boo`
}

function* testError() {
    yield* goDeeper()
}


const containers = () => `docker ps`
const createContainer = (name) => `docker run -dit --name ${name} ubuntu /bin/bash`
const removeContainer = (name) => `docker stop ${name} && docker rm ${name}`
const dockerExec = (containerName, cmd, env) => `docker exec -t -e ${env} ${containerName} ${cmd}`

function* createAbstraction() {
    yield createContainer('foo')
    yield createContainer('bar')
}

function* removeAbstraction() {
    yield removeContainer('foo')
    yield removeContainer('bar')
}

function* createMultipleContainers() {
    yield* createAbstraction()
    yield containers()
    yield* removeAbstraction()
}

function* provision_dev_machine() {
    yield createContainer('dev_machine')
    //test if working
    yield removeContainer('dev_machine')
}

function* cd() {
    yield `cd /home/romainprignon/workspace && ls`
}

function* removeGoogleMachine(name) {
    yield `docker-machine rm -f ${name}`
    yield `gcloud compute firewall-rules delete machine-${name}--tcp-in--2377`
    yield `gcloud compute firewall-rules delete machine-${name}--udp-in--4789`
    yield `gcloud compute firewall-rules delete machine-${name}--udp-in--7946`
    yield `gcloud compute firewall-rules delete machine-${name}--tcp-in--7946`
}

function* createGoogleMachine(name) {
    yield `docker-machine create ${name} \
        --driver=google \
        --google-project=rp-171015 \
        --google-zone=europe-west3-b \
        --google-machine-type=n1-standard-1 \
        --google-machine-image=https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images/family/ubuntu-1604-lts \
        --google-disk-size=10 \
        --google-tags=machine,${name}`

    yield `gcloud compute firewall-rules create machine-${name}--tcp-in--2377 --allow tcp:2377 --target-tags=${name} --source-ranges=0.0.0.0/0`
    yield `gcloud compute firewall-rules create machine-${name}--udp-in--4789 --allow udp:4789 --target-tags=${name} --source-ranges=0.0.0.0/0`
    yield `gcloud compute firewall-rules create machine-${name}--udp-in--7946 --allow udp:7946 --target-tags=${name} --source-ranges=0.0.0.0/0`
    yield `gcloud compute firewall-rules create machine-${name}--tcp-in--7946 --allow tcp:7946 --target-tags=${name} --source-ranges=0.0.0.0/0`
}

function* createMachine(driver, name) {
    switch (driver) {
        case 'google': {
            yield* createGoogleMachine(name)

            return 0
        }
        default: {
            yield `echo "(createMachine) can't create machine"`

            return 1
        }
    }
}

function* swarmInit(manager) {
    yield `docker-machine ssh ${manager} sudo docker swarm init --advertise-addr $(docker-machine ip ${manager})`
}

function* swarmManagerJoin(rootManager, manager, managerToken) {
    yield `docker-machine ssh ${manager} \
        "sudo docker swarm join \
            --token ${managerToken} \
            $(docker-machine ip ${rootManager})"`
}

function* swarmWorkerJoin(rootManager, worker, workerToken) {
    yield `docker-machine ssh ${worker} \
	    "sudo docker swarm join \
	        --token ${workerToken} \
	        --listen-addr $(docker-machine ip ${worker}) \
	        --advertise-addr $(docker-machine ip ${worker}) \
	        $(docker-machine ip ${rootManager}):2377"`
}

const getManagerToken = (manager) => `docker-machine ssh ${manager} "sudo docker swarm join-token manager -q"`

const getWorkerToken = (manager) => `docker-machine ssh ${manager} "sudo docker swarm join-token worker -q"`

function* create() {
    yield* createMachine('google', 'stack-name--prod--mngr-1')
    yield* createMachine('google', 'stack-name--prod--mngr-2')
    yield* createMachine('google', 'stack-name--prod--wrkr-1')

    yield* swarmInit('stack-name--prod--mngr-1')
    const managerToken = yield getManagerToken('stack-name--prod--mngr-1')
    const workerToken = yield getWorkerToken('stack-name--prod--mngr-1')

    yield* swarmManagerJoin('stack-name--prod--mngr-1', 'stack-name--prod--mngr-2', managerToken)
    yield* swarmWorkerJoin('stack-name--prod--mngr-1', 'stack-name--prod--wrkr-1', workerToken)
}

function* remove() {
    yield* removeGoogleMachine('stack-name--prod--mngr-1')
    yield* removeGoogleMachine('stack-name--prod--mngr-2')
    yield* removeGoogleMachine('stack-name--prod--wrkr-1')
}

// ============= async ===============
const longEcho = async (params) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(`echo coucou ${params}`), 1000)
})

const asyncFn = async (params) => longEcho(params)

const asyncFn2 = (params) => [`echo ${params}`, `echo 2 ${params}`]
function* asyncGen(params) {
    const [res1, res2] = yield [`echo ${params}`, `echo 2 ${params}`] // const [res1, reS2] = yield [.....]
    console.log(res1, res2)
}

const main = () => {
//   framework({output: true, verbose: true})(colorfull, 'romain')
//   framework({output: true, verbose: true, env: {FOO: 'romain'}})(testEnv)
//   framework({output: true, verbose: true})(createMultipleContainers)
//   framework({output: true, verbose: true})(testError)
//   framework({output: true, verbose: true})(provision_dev_machine)
//   framework({output: true, verbose: true})(cd)
//   framework({output: true, verbose: true})(create)
//   framework({output: true, verbose: true})(remove)

  framework({output: true, verbose: true})(asyncFn, 'romain')
//   framework({output: true, verbose: true})(asyncFn2, 'romain')
//   framework({output: true, verbose: true})(asyncGen, 'romain')
}

main()
