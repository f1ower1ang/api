const axios = require('axios')
const express = require('express')
const apiRoutes = express.Router()

const commonParam = {
  g_tk: 1326720455,
  loginUin: 0,
  hostUin: 0,
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  needNewCode: 0
}

apiRoutes.get('/mvInfo', (req, res) => {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, commonParam, {
    platform: 'yqq.json',
    data: {
      "comm": {"ct": 24, "cv": 4747474},
      "mvinfo": {
        "module": "video.VideoDataServer",
        "method": "get_video_info_batch",
        "param": {
          "vidlist": [req.query.id],
          "required": ["vid", "type", "sid", "cover_pic", "duration", "singers", "video_switch", "msg", "name", "desc", "playcnt", "pubdate", "isfav", "gmid"]
        }
      },
      "other": {
        "module": "video.VideoLogicServer",
        "method": "rec_video_byvid",
        "param": {
          "vid": req.query.id,
          "required": ["vid", "type", "sid", "cover_pic", "duration", "singers", "video_switch", "msg", "name", "desc", "playcnt", "pubdate", "isfav", "gmid", "uploader_headurl", "uploader_nick", "uploader_encuin", "uploader_uin", "uploader_hasfollow", "uploader_follower_num"],
          "support": 1
        }
      }
    }
  })
  
  axios.get(url, {
    params: data
  }).then(response => {
    res.json(response.data)
  })
})

apiRoutes.get('/qqMvUrl', (req, res) => {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const redirect = req.query.redirect || 1
  const br = ['240', '480', '720', '1080']
  const data = Object.assign({}, commonParam, {
    platform: 'yqq',
    outCharset: 'GB2312',
    data: {
      "getMvUrl": {
        "module": "gosrf.Stream.MvUrlProxy",
        "method": "GetMvUrls",
        "param": {"vids": [req.query.id], "request_typet": 10001}
      }
    }
  })
  axios.get(url, {
    params: data
  }).then(response => {
    const url = response.data.getMvUrl.data[req.query.id].mp4.map(item => {
      return item['freeflow_url'][0] || ''
    })
    url.splice(0, 1)
    if (redirect !== '0') {
      if (req.query.type) {
        res.redirect(url[br.indexOf(req.query.type)])
      } else {
        res.redirect(url.filter(mv => mv.length > 0).reverse()[0])
      }
    } else {
      res.json(response.data.getMvUrl.data[req.query.id])
    }
  })
})

apiRoutes.get('/ntMvUrl', (req, res) => {
  const url = 'http://encounter-music.cn:8080/mv/detail'
  axios.get(url, {
    params: {
      mvid: req.query.id
    }
  }).then(response => {
    const url = response.data.data.brs
    if (req.query.type) {
      res.redirect(url[req.query.type])
    } else {
      res.redirect(url['480'])
    }
  })
})

module.exports = apiRoutes
