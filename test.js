const bar = (x) => x + 1

function *foo(x) {
    res = bar(x)
    console.log('res', res)
    const future = yield res
    console.log('future', future)
    return future +1

    // yield y = yield x+1
    // console.log(y)
    // console.log(x)
    // var y = 2 * (yield (x + 1));
    // console.log(x, y)
    // var z = yield (y / 3);
    // return (x + y + z);
}

var it = foo(1);

let i = it.next()
console.log(it.next(i.value))
console.log('i',i.value)
// console.log(it.next(3))

