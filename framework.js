const { isArray } = require('util')

const {shellSync, shell} = require('execa')
const {Client} = require('ssh2')

const isGenerator = (fn) => fn.constructor.name === 'GeneratorFunction'
const isAsync = (fn) => fn.constructor.name === 'AsyncFunction'
const isEmpty = (cmd) => !cmd.length
const cleanStr = (str) => str.replace(/  +/g, ' ')

const processCmd = async (cmd, options = {}) => {
    if (isArray(cmd)) {
        return await Promise.all(cmd.map(async(c) => {
            if (options.ssh) {
                const res = await options.ssh(c)

                return {
                    stdout: res,
                    stderr: '',
                    code: 0,
                    failed: false,
                    signal: null,
                    cmd: c,
                    timedOut: false
                }
            }

            if (typeof c.next === 'function') {
                let next = c.next()
                let res
                while (next.done === false) {
                    if (isEmpty(next.value)) {
                        next = c.next('')
                        continue
                    }

                    console.log(`\n`)

                    console.log(`➜ ${next.value}`)

                    if (isArray(next.value)) {
                        res = await processCmd(next.value, {env: options.env, ssh: options.ssh})
                        const out = res.map(r => r.stdout)
                        if (options.output) out.map(o => console.log(`• ${o}`))
                        next = c.next(out)
                    } else {
                        res = await processCmd(next.value, {env: options.env, ssh: options.ssh})
                        if (res.stdout) console.log(`• ${res.stdout}`)
                        next = c.next(res.stdout)
                    }
                }
                // last iteration
                if (next.value) {
                    res = await shell(next.value)
                    console.log(res.stdout)
                }

                return res
            } else {
                const res = await shell(c, options)
                return res
            }
        }))
    }

    if (options.ssh) {
        const res = await options.ssh(cmd)

        return {
            stdout: res,
            stderr: '',
            code: 0,
            failed: false,
            signal: null,
            cmd,
            timedOut: false
        }
    }

    return await shell(cmd, options)
}

const handleSSH = (host, port, username, privateKey) => async (cmd) => {
    return new Promise((resolve, reject) => {
        const conn = new Client()

        conn.on('ready', function() {
            conn.exec(cmd, function(err, stream) {
                if (err) throw err;

                stream
                    .on('close', function(code, signal) {
                        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                        conn.end();
                    })
                    .on('data', function(data) {
                        // console.log(`${data}`)
                        return resolve(data)
                    })
                    .stderr.on('data', function(data) {
                        // console.error(data);
                        throw data
                    })
            })
        }).connect({
            host,
            port,
            username,
            privateKey
        })
    })
}

// @TODO
// handle multiline command verbose
// stream cmd output
const framework = (options) => async (fn, ...args) => {
    const ssh = options.ssh && handleSSH('35.198.126.29', 22, 'romainprignon', require('fs').readFileSync('/home/romainprignon/.ssh/google_compute_engine'))

    if (!isGenerator(fn)) {
        const cmd = await fn(...args)

        if (isEmpty(cmd)) return 0

        if (options.verbose) console.log(`➜ ${cmd}`)

        if (isArray(cmd)) {
            const res = await processCmd(cmd, {env: options.env, ssh})
            if (options.output) res.map(r => console.log(`• ${r.stdout}`))
        } else {
            const res = processCmd(cmd, {env: options.env, ssh})
            if (options.output && res.stdout) console.log(`• ${res.stdout}`)
            // if (options.output && res) res.pipe(process.stdout)
        }

        return 0
    }

    const it = fn(...args)

    let next = it.next()

    while (next.done === false) {
        if (isEmpty(next.value)) {
            next = it.next('')
            continue
        }

        console.log(`\n`)

        if (options.verbose) {
            console.log(cleanStr(`➜ ${next.value}`))
        }

        if (isArray(next.value)) {
            const res = await processCmd(next.value, {env: options.env, ssh})
            const out = res.map(r => r.stdout)
            if (options.output) out.map(o => console.log(`Array(•) ${o}`))
            next = it.next(out)
        } else {
            const res = await processCmd(next.value, {env: options.env, ssh})
            if (options.output && res.stdout) console.log(`• ${res.stdout}`)
            // if (options.output && res) res.pipe(process.stdout)
            next = it.next(res.stdout)
        }
    }
    // last iteration
    if (next.value) {
        const lastCmd = await shell(next.value)
        // const lastCmd = await shell(next.value).stdout
        console.log(lastCmd.stdout)
        // if (options.output && lastCmd) lastCmd.pipe(process.stdout)
    }
}

const pipe = (f1, ...fns) =>
    (...args) =>
        fns.reduce(
            (res, fn) => `${res} | ${fn()}`,
            f1.apply(null,args)
        )

module.exports = {
    framework,
    pipe
}
