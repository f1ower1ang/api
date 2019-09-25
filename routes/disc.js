const express = require('express')
const axios = require('axios')
const musicAPI = require('@suen/music-api')
const apiRoutes = express.Router()

const common = {
  g_tk: 1744808592,
  loginUin: 0,
  hostUin: 0,
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'yqq.json',
  needNewCode: 0
}

apiRoutes.get('/disCat', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg'
  axios.get(url, {
    params: common,
    headers: {
      referer: 'https://y.qq.com/portal/playlist.html',
      host: 'y.qq.com'
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.error(e)
  })
})

apiRoutes.get('/discList', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  const page = req.query.page || 0
  const pageSize = req.query.pageSize || 30
  const data = Object.assign({}, common, {
    categoryId: req.query.categoryId,
    sortId: 5,
    sin: page * pageSize,
    ein: (page + 1) * pageSize - 1,
  })
  axios.get(url, {
    params: data,
    headers: {
      referer: 'https://y.qq.com/portal/playlist.html',
      host: 'y.qq.com'
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.error(e)
  })
})

apiRoutes.get('/url', (req, res) => {
  musicAPI.qq.getSongUrl(req.query.id).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.log(e)
  })
})

module.exports = apiRoutes
