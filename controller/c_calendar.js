const tnu = require('sscores');
const fs = require('fs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

var ictu = tnu.Open("ICTU");

module.exports = {
    timetable: function (req, res) {
        newToken = req.headers['token'];
        try{
            var decoded = jwt.verify(newToken, fs.readFileSync('primary.key'));
        }catch(err){
            res.json({
                status: "error",
                message: "Token lỗi, vui lòng kiểm tra lại",
            });
        }
        var username = decoded.username;
        var password = decoded.password;
        var semester = req.body.semester;
        ictu.Login(username, password).then(function (session) {
            if (session) {
                ictu.GetTimeTableOfStudy(semester).then(function (data) {
                    res.json({
                        status: "success",
                        message: data,
                    });
                }, console.log);
            }else{
                res.json({
                    status: "error",
                    message: "Sai tài khoản hoặc mật khẩu",
                });
            }
        }, function (err) {
            console.log(err);
        });
    },
    examtable: function (req, res) {
        newToken = req.headers['token'];
        try{
            var decoded = jwt.verify(newToken, fs.readFileSync('primary.key'));
        }catch(err){
            res.json({
                status: "error",
                message: "Token lỗi, vui lòng kiểm tra lại",
            });
        }
        var username = decoded.username;
        var password = decoded.password;
        var semester = req.body.semester;
        ictu.Login(username, password).then(function (session) {
            if (session) {
                ictu.GetTimeTableOfExam(semester).then(function (data) {
                    res.json({
                        status: "success",
                        message: data,
                    });
                }, console.log);
            }else{
                res.json({
                    status: "error",
                    message: "Sai tài khoản hoặc mật khẩu",
                });
            }
        }, function (err) {
            console.log(err);
        });
    }
}
