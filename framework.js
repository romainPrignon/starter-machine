const {shellSync} = require('execa')

const isGenerator = (fn) => fn.constructor.name === 'GeneratorFunction'

const process = (cmd, options = {}) => shellSync(cmd, options)

// @TODO
// handle multiline command verbose
// handle yield await all
// stream cmd output
const framework = (options) => (genFunc, ...args) => {
    if (!isGenerator(genFunc)) {
        const cmd = genFunc(...args)

        if (options.verbose) console.log(`➜ ${cmd}`)

        const res = process(cmd, {env: options.env})

        if (options.output) console.log(`• ${res.stdout}`)

        return 0
    }

    const it = genFunc(...args)

    let next = it.next()

    while (next.done === false) {
        console.log(`\n`)

        if (options.verbose) console.log(`➜ ${next.value}`)

        const res = process(next.value, {env: options.env})

        if (options.output) console.log(`• ${res.stdout}`)

        next = it.next(res.stdout)
    }
    // last iteration
    next.value && console.log(shellSync(next.value).stdout)
}

module.exports = {
    framework
}
