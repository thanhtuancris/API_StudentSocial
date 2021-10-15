const tnu = require('sscores');
const fs = require('fs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const request = require('request');
const accounts = require('../model/accounts');
const semesters = require('../model/semesters');
const marktables = require('../model/marktables');
const timetables = require('../model/timetables');
const notifications = require('../model/notifications');
const marknks = require('../model/marknk');
const quocte = require('../university/newIS')
const ngoaingu = require('../university/newSFL')
const congnghiep = require('../university/TNUT')
const cheerio = require('cheerio');
const NodeRSA = require('node-rsa');
// const chilkat = require('@chilkat/ck-node12-win64');
// const chilkat = require('@chilkat/ck-node12-linux64');
const keyPublic = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIBOgIBAAJBAMGGf41b5BmnBc+oRRyasFUgRPxMFcJeVxWYPv3bh5cv5hfPkJcm\n' +
    'nG4ZjoLIRThB6W4LW3N60zqXGb+UGkBlcFkCAwEAAQJAfWeOmCeHtCfLWDkOL+79\n' +
    'fOwgR+113DIN9GxnxVDQmGLMrldWN+G/O5i2jD82sfani/BshEm0yfT48WO3/ayy\n' +
    'AQIhAOr+wAurKc8OF665ijMq2yUc2B5fDaQBueblji/cHIWRAiEA0tLSS3eMr33o\n' +
    'KFWKiXMAnkCccAyBGD7CzWWnPhO4ukkCIFeggxBW1RJGmQIoYaZO1sTyCozYuQdt\n' +
    'NVsqQmkKVQBhAiBJjBCfETq8MjFeeNEWuE775lBs6n/SxHpTC2Z3youEOQIhAKOQ\n' +
    'yNUB6hfga/0DEGOhZyfbexoYHx0ognxy8TPz6bBP\n' +
    '-----END RSA PRIVATE KEY-----');

const {
    worker
} = require('cluster');

function getngoaikhoa(ids, hostname) {
    return new Promise(function (myResolve, myReject) {
        var options = {
            'method': 'POST',
            'url': 'https://api.dhdt.vn/activity/student-score',
            'headers': {
                'hostname': hostname,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "ids": ids
            })
        };
        request(options, function (error, response) {
            if (error) {
                myReject(error)
            } else {
                let data = JSON.parse(response.body);
                myResolve(data);
            }
        });
    });
}
function svnet(username, password) {
    let kq = {};
    return new Promise(function (myResolve, myReject) {
        var options = {
            'method': 'POST',
            'url': 'http://svnet-api.tnu.edu.vn/',
            'headers': {
                'namespace': 'APP',
                'Content-Type': 'application/json',
                'Cookie': 'ASP.NET_SessionId=ciky3vncwasanmsorq32dzzr'
            },
            body: JSON.stringify({
                "m": "member",
                "fn": "login",
                "userName": username,
                "passWord": password
            })

        };
        request(options, function (error, response) {
            if (error) {
                //myReject(error)
            } else {
                let data = JSON.parse(response.body);
                try {
                    if (data.success == true) {
                        let token = data.data;
                        var opGetProfile = {
                            'method': 'POST',
                            'url': 'http://svnet-api.tnu.edu.vn/',
                            'headers': {
                                'namespace': 'APP',
                                'authorization': token,
                                'Content-Type': 'application/json',
                                'Cookie': 'ASP.NET_SessionId=ciky3vncwasanmsorq32dzzr'
                            },
                            body: JSON.stringify({
                                "m": "member",
                                "fn": "infor_member"
                            })

                        };
                        request(opGetProfile, function (erGP, reGP) {
                            if (reGP) {
                                //myReject(error)
                                let kqGp = JSON.parse(reGP.body)
                                var opGetEV = {
                                    'method': 'POST',
                                    'url': 'http://svnet-api.tnu.edu.vn/',
                                    'headers': {
                                        'namespace': 'APP',
                                        'authorization': token,
                                        'Content-Type': 'application/json',
                                        'Cookie': 'ASP.NET_SessionId=ciky3vncwasanmsorq32dzzr'
                                    },
                                    body: JSON.stringify({
                                        "m": "member",
                                        "fn": "list_notification_by_member",
                                        "pageIndex": 1,
                                        "pageSize": 500
                                    })
                                };
                                request(opGetEV, function (erEV, reEV) {
                                    if(reEV){
                                        let kqEV = JSON.parse(reEV.body)
                                        kq.profile = kqGp.data;
                                        kq.events = kqEV.data.data;
                                        myResolve(kq);
                                    }
                                });
                            } else {}
                        });
                    }
                } catch (ex) {
                    myReject(ex)
                }
            }
        });
    });
}
function NN_Profile(username){
    return new Promise(function (resolve,reject){
        let option = {
            'method': 'GET',
            'url': `https://qldvsfl.tnu.edu.vn/hoat-dong/diem-ca-nhan/${username}.html`,
            'headers': {
                "Host":'qldvsfl.tnu.edu.vn',
                "Connection":'keep-alive',
                "sec-ch-ua":'"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                "sec-ch-ua-mobile":'?0',
                "Upgrade-Insecure-Requests":'1',
                "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                "Sec-Fetch-Site":'none',
                "Sec-Fetch-Mode":'navigate',
                "Sec-Fetch-User":'?1',
                "Sec-Fetch-Dest":'document',
                "Accept-Encoding":'',
                "Accept-Language":'en-US,en;q=0.9'
            }
        }
        request(option, async function (error, response, html){
            if(response){
                let $ = cheerio.load(html)
                let a = $("#__layout > div > section > main > div.bgw.p-10.el-row > div.p-r-5.min-height-70vh.el-col.el-col-18 > div > div.bg-info.text-white.p-15.text-center.std-info.el-row > div.text-uppercase.el-col.el-col-16")
                let ten = $(a).find("h1").text()
                let lop = $(a).find("h2").text()
                let diem =  $(a).find("h3").find("span").text()
                diem = diem.split('')
                let hoatdong = $("#__layout > div > section > main > div.bgw.p-10.el-row > div.p-r-5.min-height-70vh.el-col.el-col-18 > div > div.el-table.el-table--fit.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr").each(function(index, element){
                    let b = $(element).find("td").find("span").text()
                })
                let obj1 = {
                    "school": "SFL",
                    "code_student": username,
                    "full_name": ten,
                    "class": lop,
                    "majors": "",
                    "hedaotao": "",
                    "course": "",
                }
                resolve(obj1)
            }else{
                reject(error)
            }
        })
    })
}

function CN_Profile(username, password){
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
                                          'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemlichthi',
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
                                              let data = []
                                              let $ =  cheerio.load(html4)
                                              let ttcn = $(".infor-member > .center > table > tbody")
                                              let dt = $(ttcn).find("tr").find("td").find("span")
                                              $(dt).each(function(i,e){
                                                  let b = $(e).text()
                                                  data.push(b)
                                              })
                                              let obj = {
                                                  "school": "TNUT",
                                                  "code_student": data[1],
                                                  "full_name": data[3],
                                                  // "Phái": data[5],
                                                  // "Nơi sinh": data[7],
                                                  "class": data[9],
                                                  "majors": data[11],
                                                  // "Khoa": data[13],
                                                  "hedaotao": data[15],
                                                  "course": data[17],
                                                  // "Cố vấn học tập": data[19]
                                              }
                                            //   console.log(obj);
                                              resolve(obj);
                                          }
                                      })
                                  }
                              })
                          }, 3000);
                        
                      }
                  });
              }else{
                  reject(error);
              }
          });
    })

}
module.exports = {
    getthongbao: () => {
        ictu.GetNews().then(function (news) {
            console.log("\n\nDữ liệu về thông báo tại trang chủ:");
            console.log(news);
            let notification1s = new notifications({
                school: "ICTU",
                notifications: news
            });
            notification1s.save();
        }, function (err) {
            console.log(err);
        });
    },
    markExtracurricular: function (ids) {
        return new Promise(function (myResolve, myReject) {
            var options = {
                'method': 'POST',
                'url': 'https://api.dhdt.vn/activity/student-score',
                'headers': {
                    'hostname': 'sinhvien.ictu.edu.vn',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "ids": ids
                })
            };
            request(options, function (error, response) {
                if (error) {
                    myReject(error)
                } else {
                    let data = JSON.parse(response.body);
                    myResolve(data);
                }
            });
        });
    },
    dongbolich: async function (req, res) {
        let school = "ICTU"
        let ictu = tnu.Open("ICTU");
            let username = req.body.username;
            let password = req.body.password;
        let check_exist = await accounts.findOne({code_student: username})
        if(check_exist == null) {
            console.log(username);
            console.log(password);
            res.status(400).json({
                message: "Không tồn tại tài khoản"
            })
        }else{
            var options = {
                'method': 'POST',
                'url': 'https://api.dhdt.vn/activity/student-score',
                'headers': {
                    'hostname': 'sinhvien.ictu.edu.vn',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "ids": username
                })
            };
            try{
                ictu.Login(username, password).then(function (session) {
                    if(session){
                        let semesterarr = [];
                        ictu.GetSemestersOfStudy().then(async function (resp) {
                            for (let i = 0; i < resp.length; i++) {
                                if (resp[i].IsNow == true) {
                                    semesterarr.push(resp[i]);
                                    semesterarr.push(resp[i + 1]);
                                }
                            }
                            ictu.GetTimeTableOfStudy(semesterarr[0].MaKy).then(function (rs) {
                                ictu.GetTimeTableOfExam(semesterarr[0].MaKy).then(function (rse) {
                                    ictu.GetProfile().then(function (pf) {
                                        ictu.GetMarkTable().then(function (data) {
                                            let Profile = pf;
                                            let MarkTable = data;
                                            let schedule = rs.Entries;
                                            let scheduleEx = rse.Entries;
                                            Profile.truong = school;
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
                                            let temparr = {
                                                timetable: schedule,
                                                examtable: scheduleEx
                                            }
                                            let UDAcc = {
                                                full_name: Profile.full_name,
                                                class: Profile.class,
                                                majors: Profile.major,
                                                course: Profile.course,
                                                hdt: Profile.hedaotao
                                            };
                                            
                                            accounts.findOneAndUpdate({
                                                code_student: pf.code_student
                                            }, UDAcc, (er, rs) => {
                                                    let UDmarks = {
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
                                                    };
                                                    marktables.findOneAndUpdate({
                                                        id_student: pf.code_student
                                                    }, UDmarks, (er, rs) => {
                                                        let timetb = {
                                                            timetable: temparr.timetable,
                                                            examtable: temparr.examtable
                                                        };
                                                        timetables.findOneAndUpdate({
                                                            id_student: pf.code_student
                                                        }, timetb, (er, rs) => {
                                                            request(options, function (error, response){
                                                                try{
                                                                    let tp6 = JSON.parse(response.body);
                                                                    for (let j = 0; j < tp6.info.list.length ; j++){
                                                                        tp6.info.list[j].idn = parseInt(tp6.info.list[j].idn);
                                                                    }
                                                                    let UDmarksnk = {
                                                                        total: tp6.info.total,
                                                                        waiting: tp6.info.waiting,
                                                                        entries: tp6.info.list
                                                                    };
                                                                    marknks.findOneAndUpdate({
                                                                        id_student: pf.code_student
                                                                    }, UDmarksnk, (er, rs) => {
                                                                        res.status(200).json({
                                                                            statuscode: 200,
                                                                            message: "done"
                                                                        });
                                                                    })
                                                                   
                                                            }catch(ex){
                                                                let UDmarksnk = {
                                                                    total: 0,
                                                                    waiting: 0,
                                                                    entries: []
                                                                };
                                                                marknks.findOneAndUpdate({
                                                                    id_student: pf.code_student
                                                                }, UDmarksnk, (er, rs) => {
                                                                    res.status(200).json({
                                                                        statuscode: 200,
                                                                        message: "done"
                                                                    });
                                                                })
                                                            }
                                                            })
                                                        });
                                                    });
                                            });
                                        })
                                    })
                                })
                            })
                        })
                    }
                })
            }catch(ex){
                ictu.Login(username, password).then(function (session) {
                    if(session){
                        let semesterarr = [];
                        ictu.GetSemestersOfStudy().then(async function (resp) {
                            for (let i = 0; i < resp.length; i++) {
                                if (resp[i].IsNow == true) {
                                    semesterarr.push(resp[i]);
                                    semesterarr.push(resp[i + 1]);
                                }
                            }
                            ictu.GetTimeTableOfStudy(semesterarr[0].MaKy).then(function (rs) {
                                ictu.GetTimeTableOfExam(semesterarr[0].MaKy).then(function (rse) {
                                    ictu.GetProfile().then(function (pf) {
                                        ictu.GetMarkTable().then(function (data) {
                                            let Profile = pf;
                                            let MarkTable = data;
                                            let schedule = rs.Entries;
                                            let scheduleEx = rse.Entries;
                                            let tp6 = JSON.parse(response.body);
                                            Profile.truong = school;
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
                                            let temparr = {
                                                timetable: schedule,
                                                examtable: scheduleEx
                                            }
                                            let UDAcc = {
                                                full_name: Profile.full_name,
                                                class: Profile.class,
                                                majors: Profile.major,
                                                course: Profile.course,
                                                hdt: Profile.hedaotao
                                            };
                                            
                                            accounts.findOneAndUpdate({
                                                code_student: pf.code_student
                                            }, UDAcc, (er, rs) => {
                                                let UDmarksnk = {
                                                    total: 0,
                                                    waiting: 0,
                                                    entries: []
                                                };
                                                marknks.findOneAndUpdate({
                                                    id_student: pf.code_student
                                                }, UDmarksnk, (er, rs) => {
                                                    let UDmarks = {
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
                                                    };
                                                    marktables.findOneAndUpdate({
                                                        id_student: pf.code_student
                                                    }, UDmarks, (er, rs) => {
                                                        let timetb = {
                                                            timetable: temparr.timetable,
                                                            examtable: temparr.examtable
                                                        };
                                                        timetables.findOneAndUpdate({
                                                            id_student: pf.code_student
                                                        }, timetb, (er, rs) => {
                                                            res.status(200).json({
                                                                message: "done"
                                                            })
                                                        });
                                                    });
                                                });
                                            });
                                        })
                                    })
                                })
                            })
                        })
                    }
                })
            }
        }
        
    },
    chuaLogin: async function(newToken, res, req){
        let ictu
        let username = req.body.username;
        let password = req.body.password;
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
                            ictu.GetProfile().then(function (pf) {
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
                                        newAcc.save();
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
        
    }
}