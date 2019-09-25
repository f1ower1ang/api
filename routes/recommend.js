const express = require('express')
const axios = require('axios')
const apiRoutes = express.Router()

const COMMON = {
  g_tk: 1326720455,
  loginUin: 0,
  hostUin: 0,
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'yqq.json',
  needNewCode: 0
}

apiRoutes.get('/recMv', (req, res) => {
  const url = 'https://c.y.qq.com/mv/fcgi-bin/getmv_by_tag'
  const data = Object.assign({}, COMMON, {
    cmd: 'shoubo',
    lan: 'all',
    outCharset: 'GB2312'
  })
  axios.get(url, {
    params: data
  }).then(response => res.json(response.data))
})

apiRoutes.get('/recDisc', (req, res) => {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, COMMON, {
    data: {
      "comm": {"ct": 24},
      "recomPlaylist": {
        "method": "get_hot_recommend",
        "param": {"async": 1, "cmd": 2},
        "module": "playlist.HotRecommendServer"
      }
    }
  })
  axios.get(url, {
    params: data
  }).then(response => res.json(response.data))
})

apiRoutes.get('/recAlbum', (req, res) => {
  const pageSize = req.query.pageSize || 12
  const page = req.query.page || 0
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, COMMON, {
    data: {
      "comm": {"ct": 24},
      "new_album": {
        "module": "newalbum.NewAlbumServer",
        "method": "get_new_album_info",
        "param": {"area": 1, "sin": pageSize * page, "num": pageSize}
      }
    }
  })
  axios.get(url, {
    params: data
  }).then(response => res.json(response.data))
})

module.exports = apiRoutes
