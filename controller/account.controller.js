const fs = require('fs');
const jwt = require('jsonwebtoken');
const request = require('request');
const accounts = require('../model/accounts');
const marktables = require('../model/marktables');
const timetables = require('../model/timetables');
const notifications = require('../model/notifications');
const actions = require('./action');
const marknks = require('../model/marknk');
const tnu = require('sscores');
const NodeRSA = require('node-rsa');
const cheerio = require('cheerio');
const { database } = require('firebase-admin');
const { log } = require('console');
const quocte = require('../university/newIS')
const ngoaingu = require('../university/newSFL')
const congnghiep = require('../university/TNUT')
// const chilkat = require('@chilkat/ck-node12-win64');
// const chilkat = require('@chilkat/ck-node12-linux64');
const md5 = require('md5')
const keyPublic = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIBOgIBAAJBAMGGf41b5BmnBc+oRRyasFUgRPxMFcJeVxWYPv3bh5cv5hfPkJcm\n' +
    'nG4ZjoLIRThB6W4LW3N60zqXGb+UGkBlcFkCAwEAAQJAfWeOmCeHtCfLWDkOL+79\n' +
    'fOwgR+113DIN9GxnxVDQmGLMrldWN+G/O5i2jD82sfani/BshEm0yfT48WO3/ayy\n' +
    'AQIhAOr+wAurKc8OF665ijMq2yUc2B5fDaQBueblji/cHIWRAiEA0tLSS3eMr33o\n' +
    'KFWKiXMAnkCccAyBGD7CzWWnPhO4ukkCIFeggxBW1RJGmQIoYaZO1sTyCozYuQdt\n' +
    'NVsqQmkKVQBhAiBJjBCfETq8MjFeeNEWuE775lBs6n/SxHpTC2Z3youEOQIhAKOQ\n' +
    'yNUB6hfga/0DEGOhZyfbexoYHx0ognxy8TPz6bBP\n' +
    '-----END RSA PRIVATE KEY-----');

function CN_Diem(username, password){
    return new Promise(function (resolve, reject){
        var options = {
            'method': 'GET',
            'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=gioithieu',
            'headers': {
      
            }
          };
          request(options, function (error, response, html) {
              if(response){
                  let $ = cheerio.load(html)
                  let a = $('#__VIEWSTATE').attr('value')
                  let options2 = {
                      'method': 'POST',
                      'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                      'headers': {
                          "Host":'dkmh.tnut.edu.vn',
                          "Connection":'keep-alive',
                          "Upgrade-Insecure-Requests":'1',
                          "Origin":'http://dkmh.tnut.edu.vn',
                         "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                         "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                          "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                          "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                         "Accept-Encoding":'',
                          "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                      },
                      form: {
                          "__EVENTTARGET":'',
                          "__EVENTARGUMENT":'',
                          "__VIEWSTATE": a,
                          "__VIEWSTATEGENERATOR": 'CA0B0334',
                          "ctl00$ContentPlaceHolder1$ctl00$txtTaiKhoa":username,
                          "ctl00$ContentPlaceHolder1$ctl00$txtMatKhau":password,
                          "ctl00$ContentPlaceHolder1$ctl00$btnDangNhap":'Đăng Nhập'
                      }
                  }
                  request(options2, function(err,ress,html2){
                      if(ress){
                          let cookie = ress.headers['set-cookie']
                          cookie = cookie.toString()
                          let rs_cookie = cookie.replace("; path=/; HttpOnly", "")
                          setTimeout(function(){
                              let options3 = {
                                  'method': 'GET',
                                  'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                                  'headers': {
                                      "Host":'dkmh.tnut.edu.vn',
                                      "Connection":'keep-alive',
                                      "Upgrade-Insecure-Requests":'1',
                                     "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                      "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                      "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                                     "Accept-Encoding":'',
                                      "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                      "Cookie": rs_cookie
                                  },
                              }
                              request(options3, function(errr, rss, html3){
                                  if(rss){
                                      let options4 = {
                                          'method': 'GET',
                                          'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                          'headers': {
                                              "Host":'dkmh.tnut.edu.vn',
                                              "Connection":'keep-alive',
                                              "Upgrade-Insecure-Requests":'1',
                                             "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                              "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                              "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                                             "Accept-Encodidng":'',
                                              "Accept-Lanadguage":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                              "Cookie": rs_cookie
                                          },
                                      }
                                      request(options4, function(error, rsss, html4) {
                                          if(rsss){
                                              let $ = cheerio.load(html4)
                                              let b = $('#__VIEWSTATE').attr('value')
                                              let options5 = {
                                                  'method': 'POST',
                                                  'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                                  'headers': {
                                                      "Host":'dkmh.tnut.edu.vn',
                                                      "Connection":'keep-alive',
                                                      "Upgrade-Insecure-Requests":'1',
                                                      "Origin":'http://dkmh.tnut.edu.vn',
                                                     "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                                                     "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                                      "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                                      "Referer":'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                                     "Accept-Encoding":'',
                                                      "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                                      "Cookie": rs_cookie
                                                  },
                                                  form: {
                                                      "__EVENTTARGET":'ctl00$ContentPlaceHolder1$ctl00$lnkChangeview2',
                                                      "__EVENTARGUMENT":'',
                                                      "__VIEWSTATE": b,
                                                      "__VIEWSTATEGENERATOR": 'CA0B0334',
                                                      "ctl00$ContentPlaceHolder1$ctl00$txtChonHK":'',
                                                  }
                                              }
                                              request(options5, function(errors, results, html5){
                                                  let $ = cheerio.load(html5);
                                                  let data = []
                                                  let temp = []
                                                  $("#ctl00_ContentPlaceHolder1_ctl00_div1 > table > tbody > .row-diem > td > span").each(function(i,e){
                                                      let rs = $(e).text()
                                                      temp.push(rs);
                                                      if((i + 1) % 13 == 0){
                                                          data.push(temp)
                                                          temp = [];
                                                      }
                                                  })    
                                                  let obj
                                                  let result = []
                                                  for(let i = 0; i< data.length; i++){
                                                      obj = {
                                                          "temon": data[i][2],
                                                          "mamon": data[i][1],
                                                          "sotc": data[i][3],
                                                          "chuyencan": data[i][6].trim(),
                                                          "thi": "L1: "+ data[i][7].trim() +" L2: "+ data[i][8],
                                                          "tkhp": data[i][10].trim(),
                                                          "diemchu": data[i][12],
                                                      }
                                                      result.push(obj)
                                                  }
                                                  resolve(result)
                                              });
                                          }
                                      })
                                  }
                              })
                          }, 3000);
                        
                      }
                  });
              }else{
                  reject(error)
              }
          });
    })
}
function CN_diem_tb(username, password){
    return new Promise(function (resolve, reject){
        var options = {
            'method': 'GET',
            'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=gioithieu',
            'headers': {
      
            }
          };
          request(options, function (error, response, html) {
              if(response){
                  let $ = cheerio.load(html)
                  let a = $('#__VIEWSTATE').attr('value')
                  let options2 = {
                      'method': 'POST',
                      'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                      'headers': {
                          "Host":'dkmh.tnut.edu.vn',
                          "Connection":'keep-alive',
                          "Upgrade-Insecure-Requests":'1',
                          "Origin":'http://dkmh.tnut.edu.vn',
                         "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                         "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                          "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                          "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                         "Accept-Encoding":'',
                          "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                      },
                      form: {
                          "__EVENTTARGET":'',
                          "__EVENTARGUMENT":'',
                          "__VIEWSTATE": a,
                          "__VIEWSTATEGENERATOR": 'CA0B0334',
                          "ctl00$ContentPlaceHolder1$ctl00$txtTaiKhoa":username,
                          "ctl00$ContentPlaceHolder1$ctl00$txtMatKhau":password,
                          "ctl00$ContentPlaceHolder1$ctl00$btnDangNhap":'Đăng Nhập'
                      }
                  }
                  request(options2, function(err,ress,html2){
                      if(ress){
                          let cookie = ress.headers['set-cookie']
                          cookie = cookie.toString()
                          let rs_cookie = cookie.replace("; path=/; HttpOnly", "")
                          setTimeout(function(){
                              let options3 = {
                                  'method': 'GET',
                                  'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                                  'headers': {
                                      "Host":'dkmh.tnut.edu.vn',
                                      "Connection":'keep-alive',
                                      "Upgrade-Insecure-Requests":'1',
                                     "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                      "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                      "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                                     "Accept-Encoding":'',
                                      "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                      "Cookie": rs_cookie
                                  },
                              }
                              request(options3, function(errr, rss, html3){
                                  if(rss){
                                      let options4 = {
                                          'method': 'GET',
                                          'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                          'headers': {
                                              "Host":'dkmh.tnut.edu.vn',
                                              "Connection":'keep-alive',
                                              "Upgrade-Insecure-Requests":'1',
                                             "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                              "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                              "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                                             "Accept-Encodidng":'',
                                              "Accept-Lanadguage":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                              "Cookie": rs_cookie
                                          },
                                      }
                                      request(options4, function(error, rsss, html4) {
                                          if(rsss){
                                              let $ = cheerio.load(html4)
                                              let b = $('#__VIEWSTATE').attr('value')
                                              let options5 = {
                                                  'method': 'POST',
                                                  'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                                  'headers': {
                                                      "Host":'dkmh.tnut.edu.vn',
                                                      "Connection":'keep-alive',
                                                      "Upgrade-Insecure-Requests":'1',
                                                      "Origin":'http://dkmh.tnut.edu.vn',
                                                     "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                                                     "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                                      "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                                      "Referer":'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                                     "Accept-Encoding":'',
                                                      "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                                      "Cookie": rs_cookie
                                                  },
                                                  form: {
                                                      "__EVENTTARGET":'ctl00$ContentPlaceHolder1$ctl00$lnkChangeview2',
                                                      "__EVENTARGUMENT":'',
                                                      "__VIEWSTATE": b,
                                                      "__VIEWSTATEGENERATOR": 'CA0B0334',
                                                      "ctl00$ContentPlaceHolder1$ctl00$txtChonHK":'',
                                                  }
                                              }
                                              request(options5, function(errors, results, html5){
                                                  let $ = cheerio.load(html5);
                                                  let arr = []
                                                  let tem= []
                                                  $("#ctl00_ContentPlaceHolder1_ctl00_div1 > table > tbody > tr").each(function(index, element) {
                                                      let a = $(element).attr("class")
                                                      if(a == 'row-diemTK'){
                                                          $(element).find("td").find("span").each(function(i,e){
                                                              let rs = $(e).text()
                                                              if((i + 1) % 2 == 0){
                                                                  tem.push(rs);
                                                              }
                                                          })
                                                      }
                                                      if(a == 'title-hk-diem'){
                                                          if(tem.length> 0){
                                                              arr.push(tem)
                                                              tem = []
                                                          }
                                                      }
                                                  })
                                                  if(tem.length> 0){
                                                      arr.push(tem)
                                                  }
                                                  let obj
                                                  let result = []
                                                  for(let i = 0; i< arr.length; i++){
                                                      obj = {
                                                         "tongsotc": "",
                                                         "dtbc" : arr[i][1].trim(), 
                                                         "dtbcqd" : arr[i][2].trim(), 
                                                         "sotctuongduong" : arr[i][4], 
                                                         "stctln" : arr[i][4], 
                                                         "somonkhongdat": "",
                                                         "sotckhongdat": "",
                                                         "dtbxltn": "",
                                                         "dtbmontn": "",
                                                      }
                                                      if(i+1 == arr.length){
                                                          result.push(obj)
                                                      }
                                                  }
                                                  resolve(result)
                                              });
                                          }
                                      })
                                  }
                              })
                          }, 3000);
                        
                      }
                  });
              }else{
                  reject(error)
              }
          });
    }) 
}
function CN_lichhoc(username){
    return new Promise(function(resolve, reject){
        var options = {
            'method': 'GET',
            'url': `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
            'headers': {}
        };
        request(options, function (error, response, html) {
            if (error) {
                console.log(error);
            } else {
                let $ = cheerio.load(html)
                if($ !== null){
                    let viewstate = $("#__VIEWSTATE").attr("value")
                    let hocky = $("#ctl00_ContentPlaceHolder1_ctl00_ddlChonNHHK").find("option").attr("value")
                    let options2 = {
                        'method': 'POST',
                        'url':  `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
                        'headers': {
                            'Host': 'dkmh.tnut.edu.vn',
                            'Connection': 'keep-alive',
                            'Cache-Control': 'max-age=0',
                            'Upgrade-Insecure-Requests': '1',
                            'Origin': 'http://dkmh.tnut.edu.vn',
                            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary6YtOoJZmSx338VS7',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                            'Referer': `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
                            'Accept-Encoding': '',
                            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
                        },
                        form: {
                            "__EVENTTARGET": 'ctl00$ContentPlaceHolder1$ctl00$rad_ThuTiet',
                            "__EVENTARGUMENT": '',
                            "__LASTFOCUS": '',
                            "__VIEWSTATE": viewstate,
                            "__VIEWSTATEGENERATOR": 'CA0B0334',
                            "ctl00$ContentPlaceHolder1$ctl00$ddlChonNHHK": hocky,
                            "ctl00$ContentPlaceHolder1$ctl00$ddlLoai": '1',
                            "ctl00$ContentPlaceHolder1$ctl00$rad_ThuTiet": 'rad_ThuTiet',
                            "ctl00$ContentPlaceHolder1$ctl00$rad_MonHoc": 'rad_MonHoc'
                        }
                    }
                    request(options2, function (err, ress, html2) {
                        if (err) {
                            console.log(err);
                        } else {
                            let cookie = ress.headers['set-cookie']
                            cookie = cookie.toString()
                            let rs_cookie = cookie.replace("; path=/; HttpOnly", "")
                            let options3 = {
                                'method': 'GET',
                                'url':  `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
                                'headers': {
                                    'Host': 'dkmh.tnut.edu.vn',
                                    'Connection': 'keep-alive',
                                    'Cache-Control': 'max-age=0',
                                    'Upgrade-Insecure-Requests': '1',
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                    'Referer':  `http://dkmh.tnut.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=${username}`,
                                    'Accept-Encoding': '',
                                    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                    'Cookie': rs_cookie,
                                    'Content-Type': 'text/plain',
                                }
                            }
                            request(options3, function (er, rs, html3) {
                                if (er) {
                                    console.log(er);
                                } else {
        
                                    let obj, arr = [],
                                        temp = [],
                                        rs_lichhoc = [],
                                        rs, startTime1, endTime1
                                    let $ = cheerio.load(html3)
                                    let table = $("#ctl00_ContentPlaceHolder1_ctl00_pnlHeader > table > tbody > tr:nth-child(2) > td > div.grid-roll2 > table.body-table").each(function (i, e) {
                                        if (i > 0) {
                                            let td = $(e).find("tbody > tr > td").each(function (ind, ele) {
                                                rs = $(ele).text();
                                                if (ind == 13) {
                                                    let onmouseover = $(ele).find("div").attr("onmouseover")
                                                    var regex = /ddrivetiptuan\((.+?)\)/gm;
                                                    var match = regex.exec(onmouseover)[1];
                                                    startTime1 = match.substring(1, 11)
                                                    endTime1 = match.substring(13, 23)
                                                    rs = startTime1 + " " + endTime1
                                                }
                                                temp.push(rs);
                                                if ((ind + 1) % 15 == 0) {
                                                    arr.push(temp);
                                                    temp = []
                                                }
        
                                            })
                                        }
                                    })
                                    var TNUT_WDAY = {
                                        "CN": 0,
                                        "Hai": 1,
                                        "Ba": 2,
                                        "Tư": 3,
                                        "Năm": 4,
                                        "Sáu": 5,
                                        "Bảy": 6,
                                    };
                                    for (let i = 0; i < arr.length; i++) {
                                        let data = arr[i]
                                        let mamon = data[0]
                                        let hocphan = data[1];
                                        let day_thu = data[8];
                                        let tietbd = data[9];
                                        let sotiet = data[10];
                                        let diadiem = data[11];
                                        // let thoigian = "";
                                        obj = {
                                            loailich: "LichHoc",
                                            hocphan: hocphan,
                                            mamon: mamon,
                                            thoigian: "",
                                            tiethoc: tietbd,
                                            diadiem: diadiem ? diadiem : "",
                                            hinhthuc: "",
                                            giaovien: "",
                                            dot: "",
                                            sobaodanh: "",
                                            ghichu: "",
                                        }
                                        if (typeof sotiet !== "undefined" && parseInt(sotiet) > 1) {
                                            let arr_tiethoc = []
                                            let tiet = tietbd + "," + parseInt(parseInt(tietbd) + parseInt(sotiet) - 1)
                                            tiet = tiet.split(",")
                                            tiet[0] = parseInt(tiet[0])
                                            tiet[1] = parseInt(tiet[1])
                                            for(let j = tiet[0]; j <= tiet[1]; j++){
                                                arr_tiethoc.push(j)
                                            }
                                            obj.tiethoc = arr_tiethoc.toString()
                                            // obj.tiethoc = tietbd + "-" + parseInt(parseInt(tietbd) + parseInt(sotiet) - 1)
                                        }
                                        let thu = TNUT_WDAY[day_thu]
                                        let thoigian = data[13]
                                        thoigian = thoigian.split(" ")
                                        var startTime = moment(thoigian[0], "DD/MM/YYYY").toDate();
                                        var endTime = moment(thoigian[1], "DD/MM/YYYY").toDate();
                                        for (var pivot = startTime; pivot.getTime() <= endTime.getTime(); pivot.setDate(pivot.getDate() + 7)) {
                                            while (pivot.getDay() != thu) {
                                                pivot.setDate(pivot.getDate() + 1);
                                            }
                                            var date = new Date(pivot.setDate(pivot.getDate()));
                                            var year = date.getFullYear();
        
                                            var month = (1 + date.getMonth()).toString();
                                            month = month.length > 1 ? month : '0' + month;
        
                                            var day = date.getDate().toString();
                                            day = day.length > 1 ? day : '0' + day;
        
                                            var me = Object.assign({}, obj); // copy object
        
                                            me.thoigian = day + '/' + month + '/' + year;
        
                                            rs_lichhoc.push(me)
        
                                        }
        
                                    }
                                    resolve(rs_lichhoc)
                                }
                            })
                        }
                    })
                }else{
                    reject
                }
            }
        });
    })
}
function CN_lichthi(username){
    return new Promise(function (resolve, reject) {
        var options = {
            'method': 'GET',
            'url': `http://dkmh.tnut.edu.vn/Default.aspx?page=xemlichthi&id=${username}`,
            'headers': {
            }
        };
        request(options, async function (error, response, html) {
            if (response) {
                const $ = cheerio.load(html)
                let data = []
                let temp = []
                let a = $("#ctl00_ContentPlaceHolder1_ctl00_gvXem>tbody>tr>td").each(function (index, element) {
                    let rs = $(element).find("span")
                    let b = $(rs).text()
                    temp.push(b);
                    if ((index + 1) % 12 == 0) {
                        data.push(temp)
                        temp = [];
                    }
                })
                let obj;
                let result = []
                for (let i = 0; i < data.length; i++) {
                    let sotiet = data[i][8], tietbd = data[i][7]
                    obj = {
                        "loailich": "LichThi",
                        "hocphan": data[i][2],
                        "mamon": data[i][1],
                        "thoigian": data[i][6],
                        "diadiem": data[i][9],
                        "tiethoc": tietbd,
                        "ghichu": data[i][10]
                    }
                    if(typeof sotiet !== "undefined" && parseInt(sotiet) > 1){
                        let arr_tiethoc = []
                        let tiet = tietbd + "," + parseInt(parseInt(tietbd) + parseInt(sotiet) - 1)
                        tiet = tiet.split(",")
                        tiet[0] = parseInt(tiet[0])
                        tiet[1] = parseInt(tiet[1])
                        for(let j = tiet[0]; j <= tiet[1]; j++){
                            arr_tiethoc.push(j)
                        }
                        obj.tiethoc = arr_tiethoc.toString()
                        // obj.tiethoc = tietbd + "," + parseInt(parseInt(tietbd) + parseInt(sotiet) - 1)
                    }
                    result.push(obj)
                }
               resolve(result)
            }else{
                reject(error)
            }
        });
    })
}
function NN_lichhoc(username, password){
    return new Promise(function (resolve, reject){
        var options = {
            'method': 'POST',
            'url': 'https://api.dhdt.vn/account/login/check-smartname',
            'headers': {
                "accept":'application/json, text/plain, */*',
                "accept-encoding":'gzip',
                "user-agent":'okhttp/3.12.1',
                "connection":'Keep-Alive',
                "content-type":'application/json;charset=utf-8',
                "host":'api.dhdt.vn',
            },
            'form': {
                "smartname":username,
                "acc_type":'user'
            }
        };
        request(options, function (error, response) {
            if(response){
                let rs = JSON.parse(response.body);
                let id = rs.list_acc[0]._id;
                var options2 = {
                    'method': 'POST',
                    'url': 'https://api.dhdt.vn/account/login/passwd',
                    'headers': {
                        "accept":'application/json, text/plain, */*',
                        "accept-encoding":'gzip',
                        "user-agent":'okhttp/3.12.1',
                        "connection":'Keep-Alive',
                        "content-type":'application/json;charset=utf-8',
                        "host":'api.dhdt.vn',
                        "hostname":'vn.svonline',
                        "agent":'{"brower":"","version":"","device_name":"","unique_device_id":"","user_agent":"","system_name":"","device_model":"","system_version":""}'
                    },
                    'form': {
                        "type": "user",
                        "_id": id,
                        "passwd": password,
                        "code_push": "ExponentPushToken[G0yi1FJFCy2nbmtmGZeS8R]",
                        "code_device": {
                          "data": "fRufejqrQHqli30s3-bzvW:APA91bGUJP0lLx_B_pyAxT6vunGXnhPeyZY30Y48ClrgKzI70Khaf-wYnhkHXWYTLJGBKx1PRFXD93EGjeMUaPcrNm5J6miHAXwDF-rAXcd7UqCJXsvJmIIb1igeV5vtd2UIbau_DU9e",
                          "type": "fcm"
                        }
                    }
                };
                request(options2, function(err, rss){
                    if(rss){
                        let rs = JSON.parse(rss.body)
                        let sso_token = rs.sso_token
                        let refresh_token = rs.refresh_token
                        let options3 = {
                            'method': 'POST',
                            'url': 'https://api.dhdt.vn/calendar/task',
                            'headers': {
                                "accept":'application/json, text/plain, */*',
                                "accept-encoding":'gzip',
                                "user-agent":'okhttp/3.12.1',
                                "connection":'Keep-Alive',
                                "content-type":'application/json;charset=utf-8',
                                "host":'api.dhdt.vn',
                                "hostname":'vn.svonline',
                                "agent":'{"brower":"","version":"","device_name":"","unique_device_id":"","user_agent":"","system_name":"","device_model":"","system_version":""}',
                                "refresh_token":refresh_token,
                                "sso_token":sso_token,
                            },
                            'form': {
                                "force_update": true
                            }
                        }
                        setTimeout(async function(){
                            request(options3, function(error3, response3){
                                if(response3){
                                    let rs = JSON.parse(response3.body)
                                    let rss = rs.tasks
                                    let arr = []
                                    for (const [key, value] of Object.entries(rss)) {
                                        arr.push(value[0])
                                    }
                                    let obj, result = [], desc_thi = [], desc_hoc = [], descript
                                    for(let i = 0; i < arr.length; i++){
                                        let time = arr[i].startAt
                                        time = time.split(" ")
                                        time = time.shift()
                                        time = new Date(time)
                                        let day = time.getDate()
                                        let month = time.getMonth()+1
                                        let year = time.getFullYear()
                                        time = day +"/"+month +"/"+year
                                        obj = {
                                            "loailich": arr[i].key,
                                            "hocphan": arr[i].title,
                                            "mamon": "",
                                            "thoigian": time,
                                            "tiethoc": "",
                                            "diadiem": "",
                                            "hinhthuc": "",
                                            "giaovien": "",
                                            'dot': "",
                                            'sobaodanh':"" ,
                                            'ghichu': "",
                                        }
                                        // if(arr[i].key === 'lich-thi'){
                                        //     descript = arr[i].desc.replace(/• Phòng thi:|• Ca thi:|• Tổ thi:|• Mã học phần:|• Số lượng:/gi, "")
                                        //     descript = descript.split("\n")
                                        //     desc_thi.push(descript)
                                        //     for(let j = 0; j < desc_thi.length; j++){
                                        //         obj.loailich = "LichThi"
                                        //         obj.mamon = desc_thi[j][3].trim();
                                        //         obj.diadiem = desc_thi[j][0].trim();
                                        //         obj.tiethoc = desc_thi[j][1].trim();
                                        //     }
                                        // }
                                        if(arr[i].key === 'lich-hoc'){
                                            descript = arr[i].desc.replace(/• Tiết:|• Phòng:|• Số tín chỉ:|• Số TCHP:|• Nhóm:|• Mã học phần:/gi, "")
                                            descript = descript.split("\n")
                                            desc_hoc.push(descript)
                                            for(let j = 0; j < desc_hoc.length; j++){
                                                obj.loailich = "LichHoc"
                                                obj.mamon = desc_hoc[j][2].trim();
                                                obj.diadiem = desc_hoc[j][1].trim();
                                                obj.tiethoc = desc_hoc[j][0].trim();
                                            }
                                            result.push(obj)
                                        }
                                    }
                                    resolve(result)
                                }
                            })
                        }, 3000)
                    }
                })
            }else{
                reject(error)
            }
        })
    })
}
function NN_lichthi(username, password){
    return new Promise(function (resolve, reject){
        var options = {
            'method': 'POST',
            'url': 'https://api.dhdt.vn/account/login/check-smartname',
            'headers': {
                "accept":'application/json, text/plain, */*',
                "accept-encoding":'gzip',
                "user-agent":'okhttp/3.12.1',
                "connection":'Keep-Alive',
                "content-type":'application/json;charset=utf-8',
                "host":'api.dhdt.vn',
            },
            'form': {
                "smartname":username,
                "acc_type":'user'
            }
        };
        request(options, function (error, response) {
            if(response){
                let rs = JSON.parse(response.body);
                let id = rs.list_acc[0]._id;
                var options2 = {
                    'method': 'POST',
                    'url': 'https://api.dhdt.vn/account/login/passwd',
                    'headers': {
                        "accept":'application/json, text/plain, */*',
                        "accept-encoding":'gzip',
                        "user-agent":'okhttp/3.12.1',
                        "connection":'Keep-Alive',
                        "content-type":'application/json;charset=utf-8',
                        "host":'api.dhdt.vn',
                        "hostname":'vn.svonline',
                        "agent":'{"brower":"","version":"","device_name":"","unique_device_id":"","user_agent":"","system_name":"","device_model":"","system_version":""}'
                    },
                    'form': {
                        "type": "user",
                        "_id": id,
                        "passwd": password,
                        "code_push": "ExponentPushToken[G0yi1FJFCy2nbmtmGZeS8R]",
                        "code_device": {
                          "data": "fRufejqrQHqli30s3-bzvW:APA91bGUJP0lLx_B_pyAxT6vunGXnhPeyZY30Y48ClrgKzI70Khaf-wYnhkHXWYTLJGBKx1PRFXD93EGjeMUaPcrNm5J6miHAXwDF-rAXcd7UqCJXsvJmIIb1igeV5vtd2UIbau_DU9e",
                          "type": "fcm"
                        }
                    }
                };
                request(options2, function(err, rss){
                    if(rss){
                        let rs = JSON.parse(rss.body)
                        let sso_token = rs.sso_token
                        let refresh_token = rs.refresh_token
                        let options3 = {
                            'method': 'POST',
                            'url': 'https://api.dhdt.vn/calendar/task',
                            'headers': {
                                "accept":'application/json, text/plain, */*',
                                "accept-encoding":'gzip',
                                "user-agent":'okhttp/3.12.1',
                                "connection":'Keep-Alive',
                                "content-type":'application/json;charset=utf-8',
                                "host":'api.dhdt.vn',
                                "hostname":'vn.svonline',
                                "agent":'{"brower":"","version":"","device_name":"","unique_device_id":"","user_agent":"","system_name":"","device_model":"","system_version":""}',
                                "refresh_token":refresh_token,
                                "sso_token":sso_token,
                            },
                            'form': {
                                "force_update": true
                            }
                        }
                        setTimeout(async function(){
                            request(options3, function(error3, response3){
                                if(response3){
                                    let rs = JSON.parse(response3.body)
                                    let rss = rs.tasks
                                    let arr = []
                                    for (const [key, value] of Object.entries(rss)) {
                                        arr.push(value[0])
                                    }
                                    let obj, result = [], desc_thi = [], desc_hoc = [], descript
                                    for(let i = 0; i < arr.length; i++){
                                        let time = arr[i].startAt
                                            time = time.split(" ")
                                            time = time.shift()
                                            time = new Date(time)
                                            let day = time.getDate()
                                            let month = time.getMonth()+1
                                            let year = time.getFullYear()
                                            time = day +"/"+month +"/"+year
                                        obj = {
                                            "loailich": arr[i].key,
                                            "hocphan": arr[i].title,
                                            "mamon": "",
                                            "thoigian": time,
                                            "tiethoc": "",
                                            "diadiem": "",
                                            "hinhthuc": "",
                                            "giaovien": "",
                                            'dot': "",
                                            'sobaodanh':"" ,
                                            'ghichu': "",
                                        }
                                        if(arr[i].key === 'lich-thi'){
                                            descript = arr[i].desc.replace(/• Phòng thi:|• Ca thi:|• Tổ thi:|• Mã học phần:|• Số lượng:|• Số báo danh:|• Hình thức thi:/gi, "")
                                            descript = descript.split("\n")
                                            desc_thi.push(descript)
                                            for(let j = 0; j < desc_thi.length; j++){
                                                obj.loailich = "LichThi"
                                                obj.mamon = desc_thi[j][3].trim();
                                                obj.diadiem = desc_thi[j][1].trim();
                                                obj.tiethoc = desc_thi[j][2].trim();
                                                obj.sobaodanh = desc_thi[j][0].trim();
                                                obj.hinhthuc = desc_thi[j][4].trim();
                                            }
                                            result.push(obj)
                                        }
                                    }
                                    resolve(result)
                                }
                            })
                        }, 3000)
                    }
                })
            }else{
                reject(error)
            }
        })
    })
}
module.exports = {
    login: async function (req, res) {
        let ictu
        let username = req.body.username;
        let password = req.body.password;
        var newToken = jwt.sign({
            username: username,
            password: password
        }, fs.readFileSync('primary.key'));
        let token_firebase = req.body.token_firebase;
        let codeSchool = req.body.username[0] + req.body.username[1] + req.body.username[2];
        let school;
        let hostname;
        let a = keyPublic.encrypt(password, 'base64');
        switch (codeSchool) {
            case "DTZ":
                ictu = tnu.Open("TNUS");
                school = "TNUS"
                hostname = "sinhvien.tnus.edu.vn"
                //DH Khoa học
                break;
            case "DTS":
                console.log("hihi")
                ictu = tnu.Open("TUE");
                school = "TUE"
                hostname = "qlsv.dhsptn.edu.vn"
                break;
                //DH Su Pham
            case "DTN":
                ictu = tnu.Open("TUAF");
                school = "TUAF"
                hostname = "hdnk.tuaf.edu.vn"
                //NongLam
                break;
            case "DTE":
                console.log("done")
                ictu = tnu.Open("TUEBA");
                school = "TUEBA";
                hostname = "sinhvien.tueba.edu.vn";
                break;
            case "DTY":
                ictu = tnu.Open("TUMP");
                school = "TUMP";
                //YDUOC
                hostname = "hoatdongngoaikhoa.tump.edu.vn";
                break;
            default:
                ictu = tnu.Open("ICTU");
                school = "ICTU"
                hostname = "sinhvien.ictu.edu.vn"
        }
        if(req.body.username[0] == "K"){
            school = "TNUT";
            hostname = "qlsv.tnut.edu.vn";
                try{
                    let get_profile = CN_Profile(username, password).then(pf =>{
                        if(pf.code_student == username){
                            let Profile = pf;
                            Profile.codeGT = "";
                            Profile.coinMH = 0;
                            Profile.date_reg = new Date();
                            Profile.isdelete = "false";
                            Profile.isstatus = "true";
                            Profile.avatar = "https://static-s.aa-cdn.net/img/gp/20600010958995/VmiZFrG4kmnqcuaBCeDXzPIEqyC1RGW-W6WywMvO-KOnuCdqaYyw5Q4JJspTBV8wP7M=s300?v=1";
                            res.status(200).json({
                                statuscode: 200,
                                message: "Đăng nhập thành công!",
                                data: {
                                    token: newToken,
                                    profile: Profile
                                }
                            });
                            let newAcc = new accounts({
                                school: school,
                                id_student: (Profile.id_student) ? Profile.id_student : "",
                                code_student: Profile.code_student,
                                password: a,
                                avatar: Profile.avatar,
                                full_name: Profile.full_name,
                                token: newToken,
                                class: Profile.class,
                                majors: Profile.majors,
                                course: Profile.course,
                                hdt: Profile.hedaotao,
                                codeGT: "",
                                coinMH: 0,
                                date_reg: new Date(),
                                isdelete: false,
                                isstatus: true,
                                token_firebase: (token_firebase) ? token_firebase : "",
                                isnoti: true
                            });
                            newAcc.save();
                        }else if(res.statusCode !== 200){
                            res.status(400).json({
                                statuscode: 400,
                                message: "Server nhà trường đang bị lỗi, vui lòng đăng nhập lại sau!"
                            })
                        }
                        else{
                            res.status(400).json({
                                statuscode: 400,
                                message: "Tài khoản hoặc mật khẩu không chính xác!",
                            });
                        }
                    })
                }catch(e){
                    res.status(400).json({
                        statuscode: 400,
                        message: "Server nhà trường đang bị lỗi, vui lòng đăng nhập lại sau!"
                    })
                }
                
        }else if(codeSchool == "DTF"){
            school = "SFL";
            hostname = "qldvsfl.tnu.edu.vn";
                try{
                    let get_profile = NN_Profile(username).then(pf =>{
                        if(pf.code_student == username){
                            let Profile = pf;
                            Profile.codeGT = "";
                            Profile.coinMH = 0;
                            Profile.date_reg = new Date();
                            Profile.isdelete = "false";
                            Profile.isstatus = "true";
                            Profile.avatar = "https://static-s.aa-cdn.net/img/gp/20600010958995/VmiZFrG4kmnqcuaBCeDXzPIEqyC1RGW-W6WywMvO-KOnuCdqaYyw5Q4JJspTBV8wP7M=s300?v=1";
                            res.status(200).json({
                                statuscode: 200,
                                message: "Đăng nhập thành công!",
                                data: {
                                    token: newToken,
                                    profile: Profile,
                                },
                            });
                            let newAcc = new accounts({
                                school: school,
                                id_student: (Profile.id_student) ? Profile.id_student : "",
                                code_student: Profile.code_student,
                                password: a,
                                avatar: Profile.avatar,
                                full_name: Profile.full_name,
                                token: newToken,
                                class: Profile.class,
                                majors: (Profile.majors) ? Profile.majors : "",
                                course: (Profile.course) ? Profile.course : "",
                                hdt: (Profile.hedaotao) ? Profile.hedaotao : "",
                                codeGT: "",
                                coinMH: 0,
                                date_reg: new Date(),
                                isdelete: false,
                                isstatus: true,
                                token_firebase: (token_firebase) ? token_firebase : "",
                                isnoti: true
                            });
                            newAcc.save();
                        }else if(res.statusCode !== 200){
                            res.status(400).json({
                                statuscode: 400,
                                message: "Server nhà trường đang bị lỗi, vui lòng đăng nhập lại sau!"
                            })
                        }
                        else{
                            res.status(400).json({
                                statuscode: 400,
                                message: "Tài khoản hoặc mật khẩu không chính xác!",
                            });
                        }
                    })
                }catch(e){
                    res.status(400).json({
                        statuscode: 400,
                        message: "Server nhà trường đang bị lỗi, vui lòng đăng nhập lại sau!"
                    })
                }
        }else{
            try{
                ictu.Login(username, password).then(function (session) {
                    if(session){
                        ictu.GetProfile().then(async function (pf) {
                            let Profile = pf;
                            Profile.truong = school;
                            Profile.codeGT = "";
                            Profile.coinMH = 0;
                            Profile.date_reg = new Date();
                            Profile.isdelete = "false";
                            Profile.isstatus = "true";
                            Profile.avatar = "https://static-s.aa-cdn.net/img/gp/20600010958995/VmiZFrG4kmnqcuaBCeDXzPIEqyC1RGW-W6WywMvO-KOnuCdqaYyw5Q4JJspTBV8wP7M=s300?v=1";
                            res.status(200).json({
                                statuscode: 200,
                                message: "Đăng nhập thành công!",
                                data: {
                                    token: newToken,
                                    profile: Profile,
                                },
                            });
                            let newAcc = new accounts({
                                school: Profile.truong,
                                id_student: Profile.id_student,
                                code_student: Profile.code_student,
                                password: a,
                                avatar: "https://static-s.aa-cdn.net/img/gp/20600010958995/VmiZFrG4kmnqcuaBCeDXzPIEqyC1RGW-W6WywMvO-KOnuCdqaYyw5Q4JJspTBV8wP7M=s300?v=1",
                                full_name: Profile.full_name,
                                token: newToken,
                                class: Profile.class,
                                majors: Profile.major,
                                course: Profile.course,
                                hdt: Profile.hedaotao,
                                codeGT: "",
                                coinMH: 0,
                                date_reg: new Date(),
                                isdelete: false,
                                isstatus: true,
                                token_firebase: (token_firebase) ? token_firebase : "",
                                isnoti: true
                            });
                            let update = {
                                school: Profile.truong,
                                id_student: Profile.id_student,
                                code_student: Profile.code_student,
                                password: a,
                                avatar: "https://static-s.aa-cdn.net/img/gp/20600010958995/VmiZFrG4kmnqcuaBCeDXzPIEqyC1RGW-W6WywMvO-KOnuCdqaYyw5Q4JJspTBV8wP7M=s300?v=1",
                                full_name: Profile.full_name,
                                token: newToken,
                                class: Profile.class,
                                majors: Profile.major,
                                course: Profile.course,
                                hdt: Profile.hedaotao,
                                codeGT: "",
                                coinMH: 0,
                                date_reg: new Date(),
                                isdelete: false,
                                isstatus: true,
                                token_firebase: (token_firebase) ? token_firebase : "",
                                isnoti: true
                            }
                            let check_db = await accounts.findOne({code_student: username})
                            if(check_db == null){
                               await newAcc.save();
                                console.log("saved");
                            }else{
                                let rs_update = await accounts.findOneAndUpdate({code_student: username}, update)
                                console.log("updated");
                            }
                        })
                    }else if(res.statusCode !== 200){
                        res.status(400).json({
                            statuscode: 400,
                            message: "Server nhà trường đang bị lỗi, vui lòng đăng nhập lại sau!",
                        });
                    }
                    else{
                         res.status(400).json({
                            statuscode: 400,
                            message: "Tài khoản hoặc mật khẩu không chính xác!",
                        });
                    }
                })
            }catch(ex){
                res.status(400).json({
                    statuscode: 400,
                    message: "Server nhà trường đang bị lỗi, vui lòng đăng nhập lại sau!",
                });
            }
        }

        // login comment

        // let password = keyPublic.encrypt(req.body.password, 'base64');
        // var newToken = jwt.sign({
        //     username: req.body.username,
        //     password: password
        // }, fs.readFileSync('primary.key'));
        // let filter = {
        //     code_student: req.body.username
        // };
        // let update = {
        //     token: newToken,
        //     token_firebase: req.body.token_firebase
        // };
        // accounts.findOneAndUpdate(filter, update, (er, rs) => {
        //     if (rs !== null) {
        //         let decodePASS = keyPublic.decrypt(rs.password, 'utf8');
        //         if (decodePASS == req.body.password) {
        //             rs = {
        //                 school: rs.school,
        //                 id_student: rs.id_student,
        //                 code_student: rs.code_student,
        //                 avatar: rs.avatar,
        //                 full_name: rs.full_name,
        //                 class: rs.class,
        //                 majors: rs.majors,
        //                 course: rs.course,
        //                 hdt: rs.HDT,
        //                 codeGT: rs.codeGT,
        //                 coinMH: rs.coinMH,
        //                 isdelete: rs.isdelete,
        //                 isstatus: rs.isstatus
        //             }
        //                 res.status(200).json({
        //                     statuscode: 200,
        //                     message: "Đăng nhập thành công!",
        //                     data: {
        //                         token: newToken,
        //                         profile: rs,
                               
        //                     },
        //                 });
        //         } else {
        //             res.status(400).json({
        //                 statuscode: 400,
        //                 message: "Đăng nhập thất bại do sai tài khoản mật khẩu!",
        //             });
        //         }
        //     } else {
        //         actions.chuaLogin(newToken, res, req);
        //     }
        // });
    },
    dongbolich: function (req, res) {
        actions.dongbolich(req, res);
    },
    logout: async (req, res) => {
        try {
            let token = req.body.token;
            if (token) {
                const filter = {
                    token: token
                }
                const update = {
                    token: "",
                    token_firebase: ""
                }
                let result = await accounts.findOneAndUpdate(filter, update);
                if (result != null) {
                    res.status(200).json({
                        message: "Đăng xuất thành công!"
                    });
                } else {
                    res.status(400).json({
                        message: "Đăng xuất thất bại!"
                    });
                }
            } else {
                res.status(400).json({
                    message: "Đăng xuất thất bại!"
                });
            }
        } catch (err) {
            res.status(400).json({
                message: "Lỗi hệ thống"
            });
        }

    },
    deleteMails: async (req, res) => {
        try {
            let token = 'Bearer ' + req.body.token;
            let number_page = 1;
            var options = {
                'method': 'GET',
                'url': `http://minhhoangjsc.com/minhhoangjsc/public/api/ggaccount/getaccount?limit=500&current_page=${number_page}`,
                'headers': {
                    'Authorization': token
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                let bodyrq = JSON.parse(response.body);
                number_page = bodyrq.data.totalPage;
                for (let i = 1; i < 4; i++) {
                    console.log("hihi")
                    var options = {
                        'method': 'GET',
                        'url': `http://minhhoangjsc.com/minhhoangjsc/public/api/ggaccount/getaccount?limit=500&current_page=${i}`,
                        'headers': {
                            'Authorization': token
                        }
                    };
                    request(options, function (error, response) {
                        if (error) throw new Error(error);
                        let bodyrq = JSON.parse(response.body);
                        console.log(bodyrq)
                        arrEmails = bodyrq.data.value;
                        let arrGmails = [];
                        let arrDelete = [];
                        for (let j = 0; j < arrEmails.length; j++) {
                            try {
                                arrEmails[i] = arrEmails[j].email;
                                var myRe = new RegExp("@gmail.com", "ig");
                                var myArray = myRe.test(arrEmails[i].toString());
                                if (myArray == true) {
                                    arrGmails.push(arrEmails[i])
                                }
                            } catch (ex) {}
                            if (j + 1 == arrEmails.length) {
                                const options = {
                                    uri: 'http://gmailchecker.info/Mail/check',
                                    headers: {
                                        'Host': "gmailchecker.info",
                                        'User-Agent': "Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Thunderbird/45.8.0",
                                        'Accept': "*/*",
                                        'Accept-Language': "en-GB,en;q=0.5",
                                        'Accept-Encoding': "gzip, deflate",
                                        'Referer': "http://gmailchecker.info/Mail",
                                        'Content-Type': "application/json",
                                        'X-XSRF-TOKEN': req.body.xtoken,
                                        'X-Requested-With': "XMLHttpRequest",
                                        'Origin': "http://gmailchecker.info",
                                        'Connection': "keep-alive",
                                        'Cookie': req.body.cctoken,
                                        'Pragma': "no-cache",
                                        'Cache-Control': "no-cache"
                                    },
                                    json: {
                                        "data": arrGmails,
                                        "transactionId": 1
                                    }
                                };
                                request.post(options, function (errs, ress, body) {
                                    if (errs) {
                                        console.log(errs);
                                    } else {
                                        try {
                                            let kq = body.result.list;
                                            console.log(body)
                                            for (let k = 0; k < kq.length; k++) {
                                                let temp = kq[k].split("|");
                                                let statusm = 1;
                                                if (temp[0] == "Good") {
                                                    statusm = 5;
                                                } else if (temp[0] == "Ver") {
                                                    statusm = 10;
                                                } else if (temp[0] == "Disable") {
                                                    statusm = 15;
                                                } else if (temp[0] == "Not_Exist") {
                                                    statusm = 20;
                                                } else if (temp[0] == "Unknown") {
                                                    statusm = 25;
                                                }
                                                if (statusm == 10 || statusm == 15 || statusm == 20) {
                                                    arrDelete.push(temp[1]);
                                                    console.log(temp[1])
                                                }
                                                if (k + 1 == kq.length) {
                                                    var options = {
                                                        'method': 'DELETE',
                                                        'url': 'http://minhhoangjsc.com/minhhoangjsc/public/api/ggaccount/delete-mutiple',
                                                        'headers': {
                                                            'Authorization': token,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            "emails": arrDelete
                                                        })

                                                    };
                                                    request(options, function (error, response) {
                                                        if (error) throw new Error(error);
                                                        console.log(response.body);
                                                    });

                                                }
                                            }
                                        } catch (ex) {

                                        }
                                        l
                                    }
                                });
                            }
                        }
                    });
                }
            });
            res.status(200).json({
                message: "Thành công"
            })
        } catch (err) {}
    },
    update: async (req, res) => {
        let filter = {
            token: req.body.token
        };
        accounts.findOne(filter, (er, rs) => {
            if (rs) {
                // console.log(rs)
                rs = {
                    school: rs.school,
                    id_student: rs.id_student,
                    code_student: rs.code_student,
                    avatar: rs.avatar,
                    full_name: rs.full_name,
                    class: rs.class,
                    majors: rs.majors,
                    course: rs.course,
                    hdt: rs.HDT,
                    codeGT: rs.codeGT,
                    coinMH: rs.coinMH,
                    isdelete: rs.isdelete,
                    isstatus: rs.isstatus
                }
                Promise.all([timetables.findOne({
                    id_student: rs.code_student
                }), marktables.findOne({
                    id_student: rs.code_student
                }), notifications.findOne({
                    school: rs.school
                }), marknks.findOne({
                    id_student: rs.code_student
                })]).then(values => {
                    try {
                        delete values[1]._id;
                    } catch (e) {}
                    try {
                        delete values[0]._id;
                    } catch (e) {}
                    try {
                        delete values[3]._id;
                    } catch (ex) {}
                    try {
                        delete values[2]._id;
                    } catch (ex) {}
                    try{
                        for (let i = 0; i < values[3].entries.length; i++) {
                            values[3].entries[i].idn = parseInt(values[3].entries[i].idn);
                        }
                    }catch(ex){}
                    res.status(200).json({
                        statuscode: 200,
                        message: "Đăng nhập thành công!",
                        data: {
                            profile: rs,
                            schedule: (values[0]) ? values[0] : {},
                            marktable: (values[1]) ? values[1] : {},
                            notifications: (values[2]) ? values[2] : [],
                            ngoaikhoa: (values[3]) ? values[3] : []
                        },
                    });
                });
            } else {
                res.status(401).json({
                    statuscode: 401,
                    message: "Đăng nhập thất bại do phiên đăng nhập hết hạn!",
                });
            }
        });
    },
    test: async function (req, res){
        // let username = req.body.username
        // let password = req.body.password
        // var ictu = tnu.Open("ICTU")
        // ictu.Login(username, password).then(function (session) {
        //     if(session){
        //         let semesterarr = [];
        //         ictu.GetSemestersOfStudy().then(async function (resp) {
                    
        //             for (let i = 0; i < resp.length; i++) {
        //                 if (resp[i].TenKy == '2_2020_2021') {
        //                     semesterarr.push(resp[i])
        //                 }
        //             }
        //             ictu.GetTimeTableOfStudy(semesterarr[0].MaKy).then(function (rs){
        //                 ictu.GetTimeTableOfExam(semesterarr[0].MaKy).then(function (rse) {
        //                     let schedule = rs.Entries;
        //                     let scheduleEx = rse.Entries;
        //                     let temparr = {
        //                         timetable: schedule,
        //                         examtable: scheduleEx
        //                     }
        //                     res.status(200).json({
        //                         statuscode: 200,
        //                         message: "Lấy danh sách lịch thành công!",
        //                         data: temparr
        //                     });
        //                     let timetb = new timetables({
        //                         id_student: username,
        //                         timetable: temparr.timetable,
        //                         examtable: temparr.examtable
        //                     });
        //                     timetb.save();
        //                 })
        //             })
        //         })
        //     }else{
        //         res.status(400).json({
        //             statuscode: 400,
        //             message: "Sai tài khoản hoặc mật khẩu, vui lòng thử lại!"
        //         })
        //     }
        // })

        // let find = await marktables.findOne({id_studentL: "DTC15HD4801030035"})
        // console.log(find);
        //    return
        //------------------------------------------------------------------------

        //    tim tai khoan bi trung 
        // let listacc = await accounts.find({});
        // let arr = []
        // for(let i of listacc){
        //     let username = i.code_student
        //     arr.push(username)
        //     // let pass = keyPublic.decrypt(i.password, 'utf8');
        // }
        //  let sorted_arr = arr.slice().sort(); 
        //     let results = [];
        //     for (let i = 0; i < sorted_arr.length - 1; i++) {
        //       if (sorted_arr[i + 1] == sorted_arr[i]) {
        //         results.push(sorted_arr[i]);
        //       }
        //     }
        //     console.log(results);

            //-------------------------------------------------------------------------------
    //    let pass = keyPublic.decrypt('G/c6yEmzwdx0HdpilimuFYbOY4C5vwHsrpTg4eKI8tK7XQZ+qktdrauKylT02l2Yje1PF6ctS36qbmAP+aBMbA==', 'utf8')
    //    console.log(pass);
    
    
    //-----------------------------------------------------------------------------------
    // let username = req.body.username
    // let password = req.body.password
    // let get_profile = quocte.getProfileQT(username, password).then(pf =>{
    //     console.log(pf);
    // })
    //--------------------------------------------------------------

    },
    getLich: async function (req, res){
        let token = req.body.token;
        let check = await accounts.findOne({token: token})
        if(check !== null){
            let username = check.code_student;
            let password = keyPublic.decrypt(check.password, 'utf8');
            let codeSchool = username[0] + username[1] + username[2];
            let codeSchool2 = username[0] + username[1] + username[2] + username[3] + username[4]; 
            let school;
            let hostname;
            let ictu
            let check_lich = await timetables.findOne({id_student: username})
            // if(check_lich !== null){
            //     res.status(200).json({
            //         statuscode: 200,
            //         message: "Lấy danh sách lịch thành công!",
            //         data: check_lich
            //     })
            // }else{
                switch (codeSchool) {
                    case "DTZ":
                        ictu = tnu.Open("TNUS");
                        school = "TNUS"
                        hostname = "sinhvien.tnus.edu.vn"
                        //DH Khoa học
                        break;
                    case "DTS":
                        console.log("hihi")
                        ictu = tnu.Open("TUE");
                        school = "TUE"
                        hostname = "qlsv.dhsptn.edu.vn"
                        break;
                        //DH Su Pham
                    case "DTN":
                        ictu = tnu.Open("TUAF");
                        school = "TUAF"
                        hostname = "hdnk.tuaf.edu.vn"
                        //NongLam
                        break;
                    case "DTE":
                        console.log("done")
                        ictu = tnu.Open("TUEBA");
                        school = "TUEBA";
                        hostname = "sinhvien.tueba.edu.vn";
                        break;
                    case "DTY":
                        ictu = tnu.Open("TUMP");
                        school = "TUMP";
                        //YDUOC
                        hostname = "hoatdongngoaikhoa.tump.edu.vn";
                        break;
                    default:
                        ictu = tnu.Open("ICTU");
                        school = "ICTU"
                        hostname = "sinhvien.ictu.edu.vn"
                }
                if(username[0] == "K"){
                        try{
                            let get_lichthi = CN_lichthi(username).then(lichthi => {
                                let get_lichhoc = CN_lichhoc(username).then(lichhoc => {
                                    if(lichhoc.length >=0 && lichthi.length >=0){
                                        let temparr = {
                                            timetable: lichhoc,
                                            examtable: lichthi
                                        }
                                        res.status(200).json({
                                            statuscode: 200,
                                            message: "Lấy danh sách lịch thành công!",
                                            data: temparr,
                                        })
                                        let timetb = new timetables({
                                            id_student: username,
                                            timetable: temparr.timetable,
                                            examtable: temparr.examtable
                                        });
                                        timetb.save();
                                    }else{
                                        let temparr = {
                                            timetable: [],
                                            examtable: []
                                        }
                                        res.status(200).json({
                                            statuscode: 200,
                                            message: "Lấy danh sách lịch thành công!",
                                            data: temparr,
                                        })
                                        let timetb = new timetables({
                                            id_student: username,
                                            timetable: temparr.timetable,
                                            examtable: temparr.examtable
                                        });
                                        timetb.save();
                                    }
                                })
                            })
                        }catch(e){
                            let temparr = {
                                timetable: [],
                                examtable: []
                            }
                            res.status(200).json({
                                statuscode: 200,
                                message: "Lấy danh sách lịch thành công!",
                                data: temparr,
                            })
                            let timetb = new timetables({
                                id_student: username,
                                timetable: temparr.timetable,
                                examtable: temparr.examtable
                            });
                            timetb.save();
                        }
                }else if(codeSchool == "DTF"){
                    try{    
                        let get_lichhoc = NN_lichhoc(username, password).then(lichhoc =>{
                            let get_lichthi = NN_lichthi(username,password).then(lichthi =>{
                                if(lichhoc.length >= 0 && lichthi.length >= 0){
                                    let temparr = {
                                        timetable: lichhoc,
                                        examtable: lichthi
                                    }
                                    res.status(200).json({
                                        statuscode: 200,
                                        message: "Lấy danh sách lịch thành công!",
                                        data: temparr
                                    
                                    })
                                    let timetb = new timetables({
                                        id_student: username,
                                        timetable: temparr.timetable,
                                        examtable: temparr.examtable
                                    });
                                    timetb.save();
                                }else{
                                    let temparr = {
                                        timetable: [],
                                        examtable: []
                                    }
                                        res.status(200).json({
                                        statuscode: 200,
                                        message: "Lấy danh sách lịch thành công!",
                                        data: temparr
                                    })
                                    let timetb = new timetables({
                                        id_student: username,
                                        timetable: temparr.timetable,
                                        examtable: temparr.examtable
                                    });
                                    timetb.save();
                                }
                            })
                        })
                    }catch(e){
                        let temparr = {
                            timetable: [],
                            examtable: []
                        }
                            res.status(200).json({
                            statuscode: 200,
                            message: "Lấy danh sách lịch thành công!",
                            data: temparr
                        })
                        let timetb = new timetables({
                            id_student: username,
                            timetable: temparr.timetable,
                            examtable: temparr.examtable
                        });
                        timetb.save();
                    }
                }else if(codeSchool2 == 'DTC19' || codeSchool2 == 'DTC20'){
                    try{
                        ictu.Login(username, password).then(function (session) {
                            if(session){
                                let semesterarr = [];
                                ictu.GetSemestersOfStudy().then(async function (resp) {
                                    if(resp.length > 0){
                                        for (let i = 0; i < resp.length; i++) {
                                            if (resp[i].TenKy == '2_2020_2021') {
                                                semesterarr.push(resp[i])
                                            }
                                        }
                                        ictu.GetTimeTableOfStudy(semesterarr[0].MaKy).then(function (rs){
                                            ictu.GetTimeTableOfExam(semesterarr[0].MaKy).then(async function (rse) {
                                                if(rs.Entries.length >= 0 && rse.Entries.length >= 0){
                                                    let schedule = rs.Entries;
                                                    let scheduleEx = rse.Entries;
                                                    let temparr = {
                                                        timetable: schedule,
                                                        examtable: scheduleEx
                                                    }
                                                    res.status(200).json({
                                                        statuscode: 200,
                                                        message: "Lấy danh sách lịch thành công!",
                                                        data: temparr
                                                    });
                                                    let timetb = new timetables({
                                                        id_student: username,
                                                        timetable: temparr.timetable,
                                                        examtable: temparr.examtable
                                                    });
                                                    let update = {
                                                        id_student: username,
                                                        timetable: temparr.timetable,
                                                        examtable: temparr.examtable
                                                    }
                                                    let check_lich = await timetables.findOne({id_student: username})
                                                    if(check_lich == null){
                                                        timetb.save();
                                                        console.log("saved");
                                                    }else{
                                                        let rs_update = await timetables.findOneAndUpdate({id_student: username}, update)
                                                        console.log("updated");
                                                    }
                                                    // timetb.save();
                                                }else{
                                                    let temparr = {
                                                        timetable: [],
                                                        examtable: []
                                                    }
                                                    res.status(200).json({
                                                        statuscode: 200,
                                                        message: "Lấy danh sách lịch thành công!",
                                                        data: temparr
                                                    });
                                                    let timetb = new timetables({
                                                        id_student: username,
                                                        timetable: temparr.timetable,
                                                        examtable: temparr.examtable
                                                    });
                                                   timetb.save();
                                                }
                                            })
                                        })
                                    }else{
                                        res.status(400).json({
                                            statuscode: 400,
                                            message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                                        })
                                    }
                                })
                            }else{
                                res.status(400).json({
                                    statuscode: 400,
                                    message: "Sai tài khoản hoặc mật khẩu, vui lòng thử lại!"
                                })
                            }
                        })
                    }catch(ex){
                        let temparr = {
                            timetable: [],
                            examtable: []
                        }
                        res.status(200).json({
                            statuscode: 200,
                            message: "Lấy danh sách lịch thành công!",
                            data: temparr
                        });
                        let timetb = new timetables({
                            id_student: username,
                            timetable: temparr.timetable,
                            examtable: temparr.examtable
                        });
                        timetb.save();
                    }
                }
                else{
                    try{
                        ictu.Login(username, password).then(function (session) {
                            if(session){
                                let semesterarr = [];
                                ictu.GetSemestersOfStudy().then(async function (resp) {
                                    if(resp.length > 0){
                                        for (let i = 0; i < resp.length; i++) {
                                            if (resp[i].IsNow == true) {
                                                semesterarr.push(resp[i]);
                                                semesterarr.push(resp[i + 1]);
                                            }
                                        }
                                        ictu.GetTimeTableOfStudy(semesterarr[0].MaKy).then(function (rs) {
                                            ictu.GetTimeTableOfExam(semesterarr[0].MaKy).then(async function (rse) {
                                                if(rs.Entries.length >= 0 && rse.Entries.length >= 0){
                                                    let schedule = rs.Entries;
                                                    let scheduleEx = rse.Entries;
                                                    let temparr = {
                                                        timetable: schedule,
                                                        examtable: scheduleEx
                                                    }
                                                    res.status(200).json({
                                                        statuscode: 200,
                                                        message: "Lấy danh sách lịch thành công!",
                                                        data: temparr
                                                    });
                                                    let timetb = new timetables({
                                                        id_student: username,
                                                        timetable: temparr.timetable,
                                                        examtable: temparr.examtable
                                                    });
                                                    let update = {
                                                        id_student: username,
                                                        timetable: temparr.timetable,
                                                        examtable: temparr.examtable
                                                    }
                                                    let check_lich = await timetables.findOne({id_student: username})
                                                    if(check_lich == null){
                                                        timetb.save();
                                                        console.log("saved");
                                                    }else{
                                                        let rs_update = await timetables.findOneAndUpdate({id_student: username}, update)
                                                        console.log("updated");
                                                    }
                                                    // timetb.save();
                                                }else{
                                                    let temparr = {
                                                        timetable: [],
                                                        examtable: []
                                                    }
                                                    res.status(200).json({
                                                        statuscode: 200,
                                                        message: "Lấy danh sách lịch thành công!",
                                                        data: temparr
                                                    });
                                                    let timetb = new timetables({
                                                        id_student: username,
                                                        timetable: temparr.timetable,
                                                        examtable: temparr.examtable
                                                    });
                                                    timetb.save();
                                                }
                                            })
                                        })
                                    }else{
                                        res.status(400).json({
                                            statuscode: 400,
                                            message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
                                        })
                                    }
                                })
                            }else{
                                res.status(400).json({
                                    statuscode: 400,
                                    message: "Sai tài khoản hoặc mật khẩu, vui lòng thử lại!"
                                })
                            }
                        })
                    }catch(e){
                        let temparr = {
                            timetable: [],
                            examtable: []
                        }
                        res.status(200).json({
                            statuscode: 200,
                            message: "Lấy danh sách lịch thành công!",
                            data: temparr
                        });
                        let timetb = new timetables({
                            id_student: username,
                            timetable: temparr.timetable,
                            examtable: temparr.examtable
                        });
                        timetb.save();
                    }
                }
            // }
        }else{
            res.status(401).json({
                statuscode: 401,
                message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
            })  
        }
    },
    getDiem: async function (req, res){
        let token = req.body.token;
        let check = await accounts.findOne({token: token})
        if(check !== null){
            let username = check.code_student;
            let password = keyPublic.decrypt(check.password, 'utf8');
            let codeSchool = username[0] + username[1] + username[2];
            let school;
            let hostname;
            let ictu
            let check_diem = await marktables.findOne({id_student: username})
            // if(check_diem !== null){
            //     res.status(200).json({
            //         statuscode: 200,
            //         message: "Lấy danh sách điểm thành công!",
            //         data: check_diem
            //     })
            // }else{
                switch (codeSchool) {
                    case "DTZ":
                        ictu = tnu.Open("TNUS");
                        school = "TNUS"
                        hostname = "sinhvien.tnus.edu.vn"
                        //DH Khoa học
                        break;
                    case "DTS":
                        console.log("hihi")
                        ictu = tnu.Open("TUE");
                        school = "TUE"
                        hostname = "qlsv.dhsptn.edu.vn"
                        break;
                        //DH Su Pham
                    case "DTN":
                        ictu = tnu.Open("TUAF");
                        school = "TUAF"
                        hostname = "hdnk.tuaf.edu.vn"
                        //NongLam
                        break;
                    case "DTE":
                        console.log("done")
                        ictu = tnu.Open("TUEBA");
                        school = "TUEBA";
                        hostname = "sinhvien.tueba.edu.vn";
                        break;
                    case "DTY":
                        ictu = tnu.Open("TUMP");
                        school = "TUMP";
                        //YDUOC
                        hostname = "hoatdongngoaikhoa.tump.edu.vn";
                        break;
                    default:
                        ictu = tnu.Open("ICTU");
                        school = "ICTU"
                        hostname = "sinhvien.ictu.edu.vn"
                }
                if(username[0] == "K"){
                    try{
                        let get_diem = CN_Diem(username, password).then(diem => {
                            let get_diem_tb = CN_diem_tb(username,password).then(diemtb => {
                                if(diem.length >= 0 && diemtb.length >= 0){
                                    res.status(200).json({
                                        statuscode: 200,
                                        message: "Lấy danh sách điểm thành công!",
                                        data: diem
                                    });
                                    let marks = new marktables({
                                        id_student: username,
                                        tongsotc: diemtb[0].tongsotc,
                                        sotctuongduong: diemtb[0].sotctuongduong,
                                        stctln: diemtb[0].stctln,
                                        dtbc: diemtb[0].dtbc,
                                        dtbcqd: diemtb[0].dtbcqd,
                                        somonkhongdat: '',
                                        sotckhongdat: '',
                                        dtbxltn: '',
                                        dtbmontn: '',
                                        entries: diem
                                    });
                                    marks.save();
                                }else{
                                    res.status(200).json({
                                        statuscode: 200,
                                        message: "Lấy danh sách điểm thành công!",
                                        data: {
                                            id_student: username,
                                            tongsotc: '',
                                            sotctuongduong: '',
                                            stctln: '',
                                            dtbc: '',
                                            dtbcqd: '',
                                            somonkhongdat: '',
                                            sotckhongdat: '',
                                            dtbxltn: '',
                                            dtbmontn: '',
                                            entries: []
                                        }
                                    });
                                    let marks = new marktables({
                                        id_student: username,
                                        tongsotc: '',
                                        sotctuongduong: '',
                                        stctln: '',
                                        dtbc: '',
                                        dtbcqd: '',
                                        somonkhongdat: '',
                                        sotckhongdat: '',
                                        dtbxltn: '',
                                        dtbmontn: '',
                                        entries: []
                                    });
                                    marks.save();
                                }
                            })
                        })
                    }catch(e){
                        let marktable = {}
                        res.status(200).json({
                            statuscode: 200,
                            message: "Lấy danh sách điểm thành công!",
                            data: {
                                id_student: username,
                                tongsotc: '',
                                sotctuongduong: '',
                                stctln: '',
                                dtbc: '',
                                dtbcqd: '',
                                somonkhongdat: '',
                                sotckhongdat: '',
                                dtbxltn: '',
                                dtbmontn: '',
                                entries: []
                            }
                        });
                        let marks = new marktables({
                            id_student: username,
                            tongsotc: '',
                            sotctuongduong: '',
                            stctln: '',
                            dtbc: '',
                            dtbcqd: '',
                            somonkhongdat: '',
                            sotckhongdat: '',
                            dtbxltn: '',
                            dtbmontn: '',
                            entries: []
                        });
                        marks.save();
                    }
                }else if(codeSchool == "DTF"){
                    let marktable = {}
                    res.status(200).json({
                        statuscode: 200,
                        message: "Lấy danh sách điểm thành công!",
                        data: {
                            id_student: username,
                            tongsotc: '',
                            sotctuongduong: '',
                            stctln: '',
                            dtbc: '',
                            dtbcqd: '',
                            somonkhongdat: '',
                            sotckhongdat: '',
                            dtbxltn: '',
                            dtbmontn: '',
                            entries: []
                        }
                    });
                    let marks = new marktables({
                        id_student: username,
                        tongsotc: '',
                        sotctuongduong: '',
                        stctln: '',
                        dtbc: '',
                        dtbcqd: '',
                        somonkhongdat: '',
                        sotckhongdat: '',
                        dtbxltn: '',
                        dtbmontn: '',
                        entries: []
                    });
                    marks.save();
                }else{
                    try{
                        ictu.Login(username, password).then(function (session) {
                            if(session){
                                ictu.GetMarkTable().then(async function (data) {
                                    if(data.length > 0){
                                        let MarkTable = data;
                                        for (let i = 0; i < MarkTable[0].entries.length; i++) {
                                            MarkTable[0].entries[i] = {
                                                "mamon": MarkTable[0].entries[i].mamon,
                                                "temon": MarkTable[0].entries[i].temon,
                                                "sotc": MarkTable[0].entries[i].sotc,
                                                "chuyencan": MarkTable[0].entries[i].cc,
                                                "thi": MarkTable[0].entries[i].thi,
                                                "tkhp": MarkTable[0].entries[i].tkhp,
                                                "diemchu": MarkTable[0].entries[i].diemchu
                                            }
                                        }
                                        res.status(200).json({
                                            statuscode: 200,
                                            message: "Lấy danh sách điểm thành công!",
                                            data: MarkTable[0]
                                        });
                                        let marks = new marktables({
                                            id_student: username,
                                            tongsotc: MarkTable[0].tongsotc,
                                            sotctuongduong: MarkTable[0].sotctuongduong,
                                            stctln: MarkTable[0].stctln,
                                            dtbc: MarkTable[0].dtbc,
                                            dtbcqd: MarkTable[0].dtbcqd,
                                            somonkhongdat: MarkTable[0].somonkhongdat,
                                            sotckhongdat: MarkTable[0].sotckhongdat,
                                            dtbxltn: MarkTable[0].dtbxltn,
                                            dtbmontn: MarkTable[0].dtbmontn,
                                            entries: MarkTable[0].entries
                                        });
                                        let update = {
                                            id_student: username,
                                            tongsotc: MarkTable[0].tongsotc,
                                            sotctuongduong: MarkTable[0].sotctuongduong,
                                            stctln: MarkTable[0].stctln,
                                            dtbc: MarkTable[0].dtbc,
                                            dtbcqd: MarkTable[0].dtbcqd,
                                            somonkhongdat: MarkTable[0].somonkhongdat,
                                            sotckhongdat: MarkTable[0].sotckhongdat,
                                            dtbxltn: MarkTable[0].dtbxltn,
                                            dtbmontn: MarkTable[0].dtbmontn,
                                            entries: MarkTable[0].entries
                                        }
                                        let check_diem = await marktables.findOne({id_student: username})
                                        if(check_diem == null){
                                            marks.save();
                                            console.log("save");
                                        }else{
                                            let rs_update = await marktables.findOneAndUpdate({id_student: username}, update)
                                            console.log("updated");
                                        }
                                        
                                    }else{
                                        res.status(200).json({
                                            statuscode: 200,
                                            message: "Lấy danh sách điểm thành công!",
                                            data: {
                                                id_student: username,
                                                tongsotc: '',
                                                sotctuongduong: '',
                                                stctln: '',
                                                dtbc: '',
                                                dtbcqd: '',
                                                somonkhongdat: '',
                                                sotckhongdat: '',
                                                dtbxltn: '',
                                                dtbmontn: '',
                                                entries: []
                                            }
                                        });
                                        let marks = new marktables({
                                            id_student: username,
                                            tongsotc: '',
                                            sotctuongduong: '',
                                            stctln: '',
                                            dtbc: '',
                                            dtbcqd: '',
                                            somonkhongdat: '',
                                            sotckhongdat: '',
                                            dtbxltn: '',
                                            dtbmontn: '',
                                            entries: []
                                        });
                                        marks.save();
                                    }
                                })
                            }else{
                                res.status(400).json({
                                    statuscode: 400,
                                    message: "Sai tài khoản hoặc mật khẩu, vui lòng thử lại!"
                                })
                            }
                        })
                    }catch(ex){
                        res.status(200).json({
                            statuscode: 200,
                            message: "Lấy danh sách điểm thành công!",
                            data: {
                                id_student: username,
                                tongsotc: '',
                                sotctuongduong: '',
                                stctln: '',
                                dtbc: '',
                                dtbcqd: '',
                                somonkhongdat: '',
                                sotckhongdat: '',
                                dtbxltn: '',
                                dtbmontn: '',
                                entries: []
                            }
                        });
                        let marks = new marktables({
                            id_student: username,
                            tongsotc: '',
                            sotctuongduong: '',
                            stctln: '',
                            dtbc: '',
                            dtbcqd: '',
                            somonkhongdat: '',
                            sotckhongdat: '',
                            dtbxltn: '',
                            dtbmontn: '',
                            entries: []
                        });
                        marks.save();
                    }
                    
                }
            // }
        }else{
            res.status(401).json({
                statuscode: 401,
                message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
            })  
        }
    },
    getNgoaiKhoa: async function (req, res) {
        let token = req.body.token
        let check = await accounts.findOne({token: token})
        if(check !== null){
            let username = check.code_student;
            let codeSchool = username[0] + username[1] + username[2];
            let hostname;
            let check_ngoai_khoa = await marknks.findOne({id_student: username})
            // if(check_ngoai_khoa !== null){
            //     res.status(200).json({
            //         statuscode: 200,
            //         message: "Lấy danh sách điểm ngoại khóa thành công!",
            //         data: check_ngoai_khoa
            //     })
            // }else{
                switch (codeSchool) {
                    case "DTZ":
                        hostname = "sinhvien.tnus.edu.vn"
                        //DH Khoa học
                        break;
                    case "DTS":
                        hostname = "qlsv.dhsptn.edu.vn"
                        break;
                        //DH Su Pham
                    case "DTN":
                        hostname = "hdnk.tuaf.edu.vn"
                        //NongLam
                        break;
                    case "DTE":
                        hostname = "sinhvien.tueba.edu.vn";
                        break;
                    case "DTY":
                        //YDUOC
                        hostname = "hoatdongngoaikhoa.tump.edu.vn";
                        break;
                    case "DTF":
                        //NN
                        hostname = "qldvsfl.tnu.edu.vn";
                        break;
                    default:
                        hostname = "sinhvien.ictu.edu.vn"
                }
                if(username[0] == "K"){
                    hostname = "qlsv.tnut.edu.vn"
                }
                var options = {
                    'method': 'POST',
                    'url': 'https://api.dhdt.vn/activity/student-score',
                    'headers': {
                        'hostname': hostname,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "ids": username
                    })
                };
                request(options, async function (error, response){
                    try{
                            let tp6 = JSON.parse(response.body);
                            for (let j = 0; j < tp6.info.list.length ; j++){
                                tp6.info.list[j].idn = parseInt(tp6.info.list[j].idn);
                            }
                            res.status(200).json({
                                statuscode: 200,
                                message: "Lấy danh sách điểm ngoại khóa thành công!",
                                data: {
                                        total: tp6.info.total,
                                        waiting: tp6.info.waiting,
                                        entries: tp6.info.list
                                    }
                            });
                            let marksnk = new marknks({
                                id_student: username,
                                total: tp6.info.total,
                                waiting: tp6.info.waiting,
                                entries: tp6.info.list
                            });
                            let update = {
                                id_student: username,
                                total: tp6.info.total,
                                waiting: tp6.info.waiting,
                                entries: tp6.info.list
                            }
                            let check_nk = await marknks.findOne({id_student: username})
                            if(check_nk == null){
                                marksnk.save();
                            }else{
                                let rs_update = await marknks.findOneAndUpdate({id_student: username}, update)
                            }
                            
                    }catch(ex){
                        res.status(200).json({
                            statuscode: 200,
                            message: "Lấy danh sách điểm ngoại khóa thành công!",
                            data: {
                                    total: 0,
                                    waiting: 0,
                                    entries: []
                                }
                        });
                        let marksnk = new marknks({
                            id_student: username,
                            total: 0,
                            waiting: 0,
                            entries: []
                        });
                        marksnk.save();
                    }
                })
            // }
        }else{
            res.status(401).json({
                statuscode: 401,
                message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!"
            })  
        }
    },
}