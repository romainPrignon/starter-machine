const {shellSync} = require('execa')

// @TODO
// handle multiline command verbose
// handle yield await all
const framework = (options) => (genFunc, ...args) => {
    const it = genFunc(...args)

    let next = it.next()

    while (next.done === false) {
        console.log(`\n`)
        try {
            if (options.verbose) console.log(`➜ ${next.value}`)

            const res = shellSync(next.value)

            if (options.output) console.log(`• ${res.stdout}`)

            next = it.next(res.stdout)
        } catch (err) {
            const e = {cmd: err.cmd, code: err.code, msg: err.stderr}
            console.error(JSON.stringify(e))
            return 1
        }
    }
    // last iteration
    next.value && console.log(shellSync(next.value).stdout)
}

module.exports = {
    framework
}
