function throttle(fun:Function, delay: number) {
  let last: any, deferTimer: any
  return function (args: any) {
  // @ts-ignore
    let that:any = this
    let _args = arguments
    let now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fun.apply(that, _args)
      }, delay)
    }else {
      last = now
      fun.apply(that,_args)
    }
  }
}

export default {
  throttle
}
