const express = require('express')
const axios = require('axios')
const apiRoutes = express.Router()

const common = {
  g_tk: 1326720455,
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0
}

function _pad(num, n = 2) { // 位数不够添0
  let len = num.toString().length
  if (len < n) {
    num = '0' + num
    len++
  }
  return num
}

// 排行榜列表
apiRoutes.get('/rankList', function (req, res) {
  const data = Object.assign({}, common, {
    platform: 'h5',
    needNewCode: 1
  })
  
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com/',
      host: 'm.y.qq.com'
    },
    params: data
  }).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.error(e)
  })
})

module.exports = apiRoutes