const { isArray } = require('util')

const {shellSync, shell} = require('execa')

const isGenerator = (fn) => fn.constructor.name === 'GeneratorFunction'
const isAsync = (fn) => fn.constructor.name === 'AsyncFunction'

const process = async (cmd, options = {}) => {
    if (isArray(cmd)) {
        return await Promise.all(cmd.map(c => shell(c, options)))
    }
    return shellSync(cmd, options)
}

// @TODO
// handle multiline command verbose
// stream cmd output
const framework = (options) => async (fn, ...args) => {
    if (!isGenerator(fn)) {
        const cmd = await fn(...args)

        if (options.verbose) console.log(`➜ ${cmd}`)

        if (isArray(cmd)) {
            const res = await process(cmd, {env: options.env})
            if (options.output) res.map(r => console.log(`• ${r.stdout}`))
        } else {
            const res = await process(cmd, {env: options.env})
            if (options.output) console.log(`• ${res.stdout}`)
        }

        return 0
    }

    const it = fn(...args)

    let next = it.next()

    while (next.done === false) {
        console.log(`\n`)

        if (options.verbose) console.log(`➜ ${next.value}`)

        if (isArray(next.value)) {
            const res = await process(next.value, {env: options.env})
            const out = res.map(r => r.stdout)
            if (options.output) out.map(o => console.log(`• ${o}`))
            next = it.next(out)
        } else {
            const res = await process(next.value, {env: options.env})
            if (options.output) console.log(`• ${res.stdout}`)
            next = it.next(res.stdout)
        }
    }
    // last iteration
    next.value && console.log(shellSync(next.value).stdout)
}

module.exports = {
    framework
}
