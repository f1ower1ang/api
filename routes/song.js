const express = require('express')
const axios = require('axios')
const apiRoutes = express.Router()
const {Base64} = require('js-base64')

const common = {
  g_tk: 1752430561,
  loginUin: 1711018063,
  hostUin: 0,
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'yqq.json',
  needNewCode: 0
}

// 专辑歌曲
apiRoutes.get('/albumSong', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'
  const data = Object.assign({}, common, {
    ct: 24,
    albummid: req.query.id,
    song_begin: 0,
    song_num: 100,
  })
  axios.get(url, {
    headers: {
      referer: `https://y.qq.com/n/yqq/album/${req.query.id}.html`,
      host: 'y.qq.com'
    },
    params: data
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.error(e)
  })
})

// 歌单歌曲
apiRoutes.get('/discSong', function (req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const data = Object.assign({}, common, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid: req.query.id
  })
  axios.get(url, {
    params: data,
    headers: {
      referer: `https://y.qq.com/n/yqq/playlist`,
      host: 'y.qq.com'
    }
  }).then((response) => {
    res.json(response.data)
  }).catch(e => {
    console.error(e)
  })
})

// 排行榜歌曲
apiRoutes.get('/rankSong', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, common, {
    page: 'detail',
    platform: 'h5',
    needNewCode: 1,
    topid: req.query.id,
    tpl: 3,
    type: 'top',
    uin: 0,
    '_': Date.now()
  })

  axios.get(url, {
    params: data
  }).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.error('error')
  })
})

// 歌手歌曲
apiRoutes.get('/singerSong', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const page = req.query.page || 0
  const pageSize = req.query.pageSize || 30
  const data = Object.assign({}, common, {
    platform: 'yqq',
    singermid: req.query.id,
    order: 'listen',
    begin: page * pageSize,
    num: pageSize,
    songstatus: 1
  })
  return axios.get(url, {
    params: data
  }).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.error(e)
  })
})

// 歌词
apiRoutes.get('/lyric', function (req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  const data = Object.assign({}, common, {
    platform: 'yqq.json',
    songmid: req.query.id,
    needNewCode: 0,
    loginUin: 0,
    hostUin: 0,
    pcachetime: +new Date()
  })
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/player.html',
      host: 'y.qq.com'
    },
    params: data
  }).then(response => {
    response.data.lyric = Base64.decode(response.data.lyric)
    res.json(response.data.lyric)
  }).catch(e => {
    console.error(e)
  })
})

// 网易云播放链接
apiRoutes.get('/ntUrl', function (req, res) {
  const url = 'http://encounter-music.cn:8080/song/url'
  axios.get(url, {
    params: req.query
  }).then(response => {
    res.redirect(response.data.data[0].url)
  }).catch(e => {
    console.error(e)
  })
})

// 网易云歌曲专辑图片
apiRoutes.get('/ntImg', function (req, res) {
  const url = 'http://encounter-music.cn:8080/song/detail'
  axios.get(url, {
    params: {
      ids: req.query.id
    }
  }).then(response => res.redirect(response.data.songs[0].al.picUrl))
})

// QQ音乐url
apiRoutes.get('/qqUrl', function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, common, {
    "-": "getplaysongvkey4031499984478728",
    data: {
      "req": {
        "module": "CDN.SrfCdnDispatchServer",
        "method": "GetCdnDispatch",
        "param": {"guid": "7888328321", "calltype": 0, "userip": ""}
      },
      "req_0": {
        "module": "vkey.GetVkeyServer",
        "method": "CgiGetVkey",
        "param": {
          "guid": "7888328321",
          "songmid": [req.query.id],
          "songtype": [0],
          "uin": "1711018063",
          "loginflag": 1,
          "platform": "20"
        }
      },
      "comm": {"uin": 1711018063, "format": "json", "ct": 24, "cv": 0}
    }
  })
  axios.get(url, {
    params: data
  }).then(response => {
    res.json(response.data)
    // const data = response.data['req_0'].data
    // res.redirect(`${data['sip'][0]}${data.midurlinfo[0].purl}`)
  }).catch(e => {
    console.log(e)
  })
})

// 重定向音乐URL
apiRoutes.get('/qqRedirect', function (req, res) {
  const url = 'http://api.qq.jsososo.com/song/url'
  axios.get(url, {
    params: {
      id: req.query.id
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'
    }
  }).then(response => {
    res.redirect(response.data.data)
  })
})

module.exports = apiRoutes
