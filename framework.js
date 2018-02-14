const {shellSync} = require('execa')

const GREEN_COLOR = '\033[0;32m'
const NO_COLOR = '\033[m'

const prevent = () => `echo "machine => ${GREEN_COLOR}$(${active()})${NO_COLOR}"`

const active = () => `echo $(${bar()})`

const bar = () => `echo "ben bar"`

function* superScript(arg) {
    // console.log('arg', arg)
    // console.log('prevent', prevent())
    let future = yield prevent()

    future = yield bar()

    yield `echo ${future}`

  return 0
}

const containers = () => `docker ps`

const createContainer = (name) => `docker run -dit --name ${name} ubuntu /bin/bash`
const removeContainer = (name) => `docker stop ${name} && docker rm ${name}`

function* createAbstraction() {
    yield createContainer('foo')
    yield createContainer('bar')
}

function* removeAbstraction() {
    yield removeContainer('foo')
    yield removeContainer('bar')
}

const dockerExec = (containerName, cmd, env) => `docker exec -e ${env} ${containerName} ${cmd}`

function* createMultipleContainers() {
    yield* createAbstraction()
    yield containers()
    yield* removeAbstraction()
}

function* goDeeper() {
    yield `boo`
}

function* testError() {
    yield* goDeeper()
}

function* provision_dev_machine() {
    yield createContainer('dev_machine')
    yield dockerExec('dev_machine', 'echo $FOO', 'FOO=bar')
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
        }
        default: {
            yield* `(createMachine) can't create machine`
        }
    }
}

function* swarmInit(manager) {
    yield `docker-machine ssh ${manager} sudo docker swarm init --advertise-addr $(docker-machine ip ${manager})`
}

function* swarmManagerJoin(manager, ManagerToken) {

}

function* swarmWorkerJoin(worker, WorkerToken) {

}

function* getManagerToken(manager) {
    yield `docker-machine ssh ${manager} "docker swarm join-token manager -q"`
}

function* getWorkerToken(manager) {
    yield `docker-machine ssh ${manager} "docker swarm join-token worker -q"`
}

function* create() {
    // yield* createMachine('google', 'stack-name--prod--mngr-1')
    yield* createMachine('google', 'stack-name--prod--mngr-2')
    yield* createMachine('google', 'stack-name--prod--wrkr-1')

    yield* swarmInit('stack-name--prod--mngr-1')
    const managerToken = yield* getManagerToken('stack-name--prod--mngr-1')
    const workerToken = yield* getWorkerToken('stack-name--prod--mngr-1')

    console.log('managerToken', managerToken)
}


const framework = (options) => (genFunc, ...args) => {
    const it = genFunc(...args)

    let next = it.next()

    while (next.done === false) {
        try {
            if (options.verbose) console.log(next.value)

            const res = shellSync(next.value)

            if (options.output) console.log(res.stdout)

            next = it.next(res.stdout)
        } catch (err) {
            const e = {cmd: err.cmd, code: err.code, msg: err.stderr}
            console.error(JSON.stringify(e))
            break
        }
    }
    // last iteration
    next.value && console.log(shellSync(next.value).stdout)
}

//TODO
//handle multiline command verbose
// handle yield await all

const main = () => {
//   framework({output: true})(createMultipleContainers)
//   framework({output: true})(testError)
//   framework({output: true, verbose: true})(provision_dev_machine)
  framework({output: true, verbose: true})(create)
}

main()
