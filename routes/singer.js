const express = require('express')
const axios = require('axios')
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

// 歌手列表
apiRoutes.get('/singerList', function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const page = req.query.page || 0
  const data = Object.assign({}, common, {
    data: {
      comm: {ct: 24, cv: 10000},
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: {
            area: Number(req.query.area) || -100,
            sex: Number(req.query.sex) || -100,
            genre: Number(req.query.genre) || -100,
            index: Number(req.query.index) || -100,
            sin: Number(page) * 80,
            cur_page: Number(page) + 1
        }
      }
    }
  })
  
  axios.get(url, {
    params: data
  }).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.error(e)
  })
})

// 歌手详情
apiRoutes.get('/singerDetail', function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = {
    data: {
      "comm": {"ct": 24, "cv": 0},
      "singer": {
        "method": "get_singer_detail_info",
        "param": {"sort": 5, "singermid": req.query.id, "sin": 0, "num": 1},
        "module": "music.web_singer_info_svr"
      }
    }
  }
  axios.get(url, {
    params: data
  }).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.error(e)
  })
})

// 歌手专辑
apiRoutes.get('/singerAlbum', function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, common, {
    data: {
      "comm": {
        "ct": 24,
        "cv": 0
      },
      "singerAlbum": {
        "method": "get_singer_album",
        "param": {
          "singermid": `${req.query.id}`,
          "order": "time",
          "begin": 0,
          "num": 1000,
          "exstatus": 1
        },
        "module": "music.web_singer_info_svr"
      }
    }
  })
  
  axios.get(url, {
    params: data
  }).then((response) => {
    res.json(response.data)
  }).catch(e => {
    console.error(e)
  })
})

// 歌手mv
apiRoutes.get('/singerMv', function (req, res) {
  const page = req.query.page || 0
  const pageSize = req.query.pageSize || 12
  const url = 'https://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg'
  const data = Object.assign({}, common, {
    cid: 205360581,
    singermid: req.query.id,
    order: 'listen',
    begin: page * pageSize,
    num: pageSize
  })
  axios.get(url, {
    params: data
  }).then(response => res.json(response.data))
})

module.exports = apiRoutes
