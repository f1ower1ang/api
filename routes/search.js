const express = require('express')
const axios = require('axios')
const apiRoutes = express.Router()

const COMMON = {
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'yqq.json',
  needNewCode: 0,
  g_tk: 1744808592,
  loginUin: 0,
  hostUin: 0,
}

// 搜索
apiRoutes.get('/search', function (req, res) {
  const key = req.query.type === 'playlist' ? 'client_music_search_songlist' : 'client_search_cp'
  const url = `https://c.y.qq.com/soso/fcgi-bin/${key}`
  const page = req.query.page || 0
  const pageSize = req.query.pageSize || 30
  const type = req.query.type || 'song'
  const common = Object.assign({}, COMMON, {
    remoteplace: `txt.yqq.${type}`
  })
  const album = {
    ct: 24,
    aggr: 0,
    catZhida: 1,
    lossless: 0,
    sem: 10,
    t: 8,
    p: page,
    n: pageSize,
    w: req.query.keywords
  }
  const song = {
    ct: 24,
    new_json: 1,
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida: 1,
    lossless: 0,
    flag_qc: 0,
    p: page,
    n: pageSize,
    w: req.query.keywords
  }
  const playlist = {
    flag_qc: 1,
    page_no: page,
    num_per_page: pageSize,
    query: req.query.keywords,
  }
  let data = {}
  if (type === 'song' || type === 'singer') {
    data = Object.assign({}, common, song)
  } else if (type === 'album') {
    data = Object.assign({}, common, album)
  } else if (type === 'playlist') {
    data = Object.assign({}, common, playlist)
  }
  axios.get(url, {
    params: data,
    headers: {
      referer: 'https://y.qq.com/portal/search.html',
      host: 'y.qq.com'
    }
  }).then((response) => {
    res.json(response.data)
  }).catch(e => {
    console.error(e)
  })
})

// 搜索mv
apiRoutes.get('/search/mv', function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
  const p = req.query.page || 1
  const n = req.query.pageSize || 12
  const data = Object.assign({}, COMMON, {
    remoteplace: 'txt.yqq.mv',
    aggr: 0,
    catZhida: 0,
    lossless: 0,
    sem: 1,
    t: 12,
    p,
    n,
    w: req.query.keyword,
  })
  axios.get(url, {
    params: data
  }).then(response => res.json(response.data))
})

module.exports = apiRoutes
