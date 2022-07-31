let countDecimals = function (num) {
  let len = 0
  try {
    num = Number(num)
    let str = num.toString().toUpperCase()
    if (str.split('E').length === 2) { // scientific notation
      let isDecimal = false
      if (str.split('.').length === 2) {
        str = str.split('.')[1]
        if (parseInt(str.split('E')[0]) !== 0) {
          isDecimal = true
        }
      }
      let x = str.split('E')
      if (isDecimal) {
        len = x[0].length
      }
      len -= parseInt(x[1])
    } else if (str.split('.').length === 2) { // decimal
      if (parseInt(str.split('.')[1]) !== 0) {
        len = str.split('.')[1].length
      }
    }
  } catch (e) {
    throw e
  } finally {
    if (isNaN(len) || len < 0) {
      len = 0
    }
  }
  return len
}

let convertToInt = function (num) {
  num = Number(num)
  let newNum = num
  let times = countDecimals(num)
  let tempNum = num.toString().toUpperCase()
  if (tempNum.split('E').length === 2) {
    newNum = Math.round(num * Math.pow(10, times))
  } else {
    newNum = Number(tempNum.replace('.', ''))
  }
  return newNum
}

let getCorrectResult = function (type, num1, num2, result) {
  let tempResult = 0
  switch (type) {
    case 'add':
      tempResult = num1 + num2
      break
    case 'sub':
      tempResult = num1 - num2
      break
    case 'div':
      tempResult = num1 / num2
      break
    case 'mul':
      tempResult = num1 * num2
      break
  }
  if (Math.abs(result - tempResult) > 1) {
    return tempResult
  }
  return result
}
export default {
  // 加法
  accAdd (num1, num2) {
    num1 = Number(num1)
    num2 = Number(num2)
    let dec1, dec2, times
    try { dec1 = countDecimals(num1) + 1 } catch (e) { dec1 = 0 }
    try { dec2 = countDecimals(num2) + 1 } catch (e) { dec2 = 0 }
    times = Math.pow(10, Math.max(dec1, dec2))
    // let result = (num1 * times + num2 * times) / times
    let result = (this.accMul(num1, times) + this.accMul(num2, times)) / times
    return getCorrectResult('add', num1, num2, result)
    // return result
  },
  // 减法
  accSub (num1, num2) {
    num1 = Number(num1)
    num2 = Number(num2)
    let dec1, dec2, times
    try { dec1 = countDecimals(num1) + 1 } catch (e) { dec1 = 0 }
    try { dec2 = countDecimals(num2) + 1 } catch (e) { dec2 = 0 }
    times = Math.pow(10, Math.max(dec1, dec2))
    // let result = Number(((num1 * times - num2 * times) / times)
    let result = Number((this.accMul(num1, times) - this.accMul(num2, times)) / times)
    return getCorrectResult('sub', num1, num2, result)
    // return result
  },
  // 除法
  accDiv (num1, num2) {
    num1 = Number(num1)
    num2 = Number(num2)
    let t1 = 0
    let t2 = 0
    let dec1
    let dec2
    try { t1 = countDecimals(num1) } catch (e) {}
    try { t2 = countDecimals(num2) } catch (e) {}
    dec1 = convertToInt(num1)
    dec2 = convertToInt(num2)
    let result = this.accMul((dec1 / dec2), Math.pow(10, t2 - t1))
    return getCorrectResult('div', num1, num2, result)
    // return result
  },
  // 乘法
  accMul (num1, num2) {
    num1 = Number(num1)
    num2 = Number(num2)
    let times = 0
    let s1 = num1.toString()
    let s2 = num2.toString()
    try { times += countDecimals(s1) } catch (e) {}
    try { times += countDecimals(s2) } catch (e) {}
    let result = convertToInt(s1) * convertToInt(s2) / Math.pow(10, times)
    return getCorrectResult('mul', num1, num2, result)
    // return result
  }
}
