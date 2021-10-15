// const chilkat = require('@chilkat/ck-node12-win64');
// const chilkat = require('@chilkat/ck-node12-linux64');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
function getTimeTableNN(username, password){
    return new Promise(function (resolve, reject) {
        var http_request = new chilkat.HttpRequest();
        var http = new chilkat.Http();
        let url = 'https://daotao.tnu.edu.vn/knn'
        var data = http.QuickRequest('GET', url)
        let $ = cheerio.load(data.BodyStr)
        if($ !== null){
            let viewstate = $('#__VIEWSTATE').attr('value')
            let VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').attr('value')
            let EVENTVALIDATION = $('#__EVENTVALIDATION').attr('value')
            let rs_url = data.FinalRedirectUrl

            http_request.AddHeader("Referer", rs_url);
            http_request.AddHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0");
            http.SaveCookies = true;
            http.SendCookies = true;
            http.CookieDir = "memory";
            http.FollowRedirects = false
            http_request.AddParam("txtUserName", username);
            http_request.AddParam("txtPassword", password);
            http_request.AddParam("__EVENTTARGET", "");
            http_request.AddParam("__EVENTARGUMENT", "");
            http_request.AddParam("__LASTFOCUS", "");
            http_request.AddParam("__VIEWSTATE", viewstate);
            http_request.AddParam("__VIEWSTATEGENERATOR", VIEWSTATEGENERATOR);
            http_request.AddParam("__EVENTVALIDATION", EVENTVALIDATION);
            http_request.AddParam("PageHeader1$drpNgonNgu", "569C8D995BAE4BC7B02584B8B659D8A8");
            http_request.AddParam("PageHeader1$hidisNotify", "0");
            http_request.AddParam("PageHeader1$hidValueNotify", "");
            http_request.AddParam("btnSubmit", "Đăng+nhập");
            http_request.AddParam("hidUserId", "");
            http_request.AddParam("hidUserFullName", "");
            http_request.AddParam("hidTrainingSystemId", "");

            let temp = [], arr = []
            var login = http.PostUrlEncoded(rs_url + "?url=https://daotao.tnu.edu.vn/knn/Home.aspx", http_request);
            var lichhoc = http.QuickGetStr(rs_url.replace('login.aspx', 'Reports/Form/StudentTimeTable.aspx'))
            let $2 = cheerio.load(lichhoc)
            let tr_length = $2("#gridRegistered > tbody:nth-child(1) > tr").length
            let tr = $2("#gridRegistered > tbody:nth-child(1) > tr").each(function(i,e){
                if(i > 0 && i < tr_length - 1){
                    let td = $(e).find("td").each(function(ind, ele){
                        let text = $(ele).text()
                        text = text.replace(/\t+/g,'')
                        text = text.replace(/\n+/g,'')
                        temp.push(text)
                        if ((ind + 1) % 10 == 0) {
                            arr.push(temp);
                            temp = []
                        }
                    });
                }
            })
            let rs_lichhoc = [], thu = 0
            for (let i = 0; i < arr.length; i++) {
                let data = arr[i]
                let hocphan = data[1]
                let mamon = data[2]
                let thoigian = data[3]
                let diadiem = data[4]
                //tg
                thoigian = thoigian.split("Từ")
                thoigian.splice(0, 1)
                for(let j = 0; j < thoigian.length; j++){
                    let time = thoigian[j].split(":")
                    startTime1 = time[0].split("đến")[0]
                    endTime1 = time[0].split("đến")[1]
                    day_thu = time[1].match(/Thứ(.+?)tiết/)[1];
                    tiet = time[1].match(/tiết(.+?)\(/)[1];
                    hinhthuc = time[1].match(/(\(.+?)\)/g)[1].replace(/\(|\)/gm, '');
                    obj = {
                        loailich: "LichHoc",
                        hocphan: hocphan,
                        mamon: mamon,
                        thoigian: "",
                        tiethoc: tiet.trim(),
                        diadiem: diadiem ? diadiem.trim() : "",
                        hinhthuc: hinhthuc ? hinhthuc : "",
                        giaovien: "",
                        dot: "",
                        sobaodanh: "",
                        ghichu: "",
                    }
                    if(day_thu == 2){
                        thu = 1
                    }
                    if(day_thu == 3){
                        thu = 2
                    }
                    if(day_thu == 4){
                        thu = 3
                    }
                    if(day_thu == 5){
                        thu = 4
                    }
                    if(day_thu == 6){
                        thu = 5
                    }
                    if(day_thu == 7){
                        thu = 6
                    }
                    var startTime = moment(startTime1, "DD/MM/YYYY").toDate();
                    var endTime = moment(endTime1, "DD/MM/YYYY").toDate();
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
                
            }
                resolve(rs_lichhoc)
        }else{
            reject
        }
    })
}
function getProFileNN(username, password){
    return new Promise(function (resolve, reject) {
        var http_request = new chilkat.HttpRequest();
        var http = new chilkat.Http();
        let url = 'https://daotao.tnu.edu.vn/knn'
        var data = http.QuickRequest('GET', url)
        let $ = cheerio.load(data.BodyStr)
        if($ !== null){
            let viewstate = $('#__VIEWSTATE').attr('value')
            let VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').attr('value')
            let EVENTVALIDATION = $('#__EVENTVALIDATION').attr('value')
            let rs_url = data.FinalRedirectUrl

            http_request.AddHeader("Referer", rs_url);
            http_request.AddHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0");
            http.SaveCookies = true;
            http.SendCookies = true;
            http.CookieDir = "memory";
            http.FollowRedirects = false
            http_request.AddParam("txtUserName", username);
            http_request.AddParam("txtPassword", password);
            http_request.AddParam("__EVENTTARGET", "");
            http_request.AddParam("__EVENTARGUMENT", "");
            http_request.AddParam("__LASTFOCUS", "");
            http_request.AddParam("__VIEWSTATE", viewstate);
            http_request.AddParam("__VIEWSTATEGENERATOR", VIEWSTATEGENERATOR);
            http_request.AddParam("__EVENTVALIDATION", EVENTVALIDATION);
            http_request.AddParam("PageHeader1$drpNgonNgu", "569C8D995BAE4BC7B02584B8B659D8A8");
            http_request.AddParam("PageHeader1$hidisNotify", "0");
            http_request.AddParam("PageHeader1$hidValueNotify", "");
            http_request.AddParam("btnSubmit", "Đăng+nhập");
            http_request.AddParam("hidUserId", "");
            http_request.AddParam("hidUserFullName", "");
            http_request.AddParam("hidTrainingSystemId", "");


            var login = http.PostUrlEncoded(rs_url + "?url=https://daotao.tnu.edu.vn/knn/Home.aspx", http_request);
            var profile = http.QuickGetStr(rs_url.replace('login.aspx', 'StudentViewExamList.aspx'))
            let $2 = cheerio.load(profile)
            let msv = $2("#lblMaSinhVien").text()
            let hoten = $2("#lblTenSinhVien").text()
            let course = $2("#lblKhoaHoc").text()
            let majors = $2("#lblNganhHoc").text()
            let lop = $2("#lblLop").text()
            let SFL_profile = {
                school: "SFL",
                id_student: "",
                code_student: msv,
                avatar: "https://static-s.aa-cdn.net/img/gp/20600010958995/VmiZFrG4kmnqcuaBCeDXzPIEqyC1RGW-W6WywMvO-KOnuCdqaYyw5Q4JJspTBV8wP7M=s300?v=1",
                full_name: hoten,
                class: lop,
                majors: majors,
                course: course,
                hdt: "",
            }
            resolve(SFL_profile)
        }else{
            reject
        }
    })
}
module.exports = {
    getTimeTableNN,
    getProFileNN
}