const accounts = require('../model/accounts');
module.exports = {
    addRich: async function (req, res) {
        let filter = {
            token: req.body.token
        };
        accounts.findOne(filter, function (er, rs) {
            if (rs) {
                if (rs.codeGT === "") {
                    accounts.findOne({code_student: req.body.code}, function (ers, rss) {
                        if (rss) {
                            accounts.updateOne({code_student: rs.code_student}, {codeGT: req.body.code,coinMH: rss.coinMH + 0.5}, (hihi, hehe) => {
                                if (hehe) {
                                    accounts.updateOne({code_student: req.body.code}, {coinMH: rss.coinMH + 0.5}, (error, response) => {
                                        if (response) {
                                            res.status(200).json({
                                                statuscode: 200,
                                                message: "Cộng điểm thành công!"
                                            });
                                        } else {
                                            res.status(200).json({
                                                statuscode: 200,
                                                message: "Cộng điểm thành công!"
                                            });
                                        }
                                    });
                                } else {
                                    res.status(200).json({
                                        statuscode: 200,
                                        message: "Cộng điểm thành công!"
                                    });
                                }
                            });
                        } else {
                            res.status(400).json({
                                statuscode: 400,
                                message: "Mã giới thiệu không có trên hệ thống!"
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        statuscode: 400,
                        message: "Bạn đã nhập mã!"
                    });
                }
            } else {
                res.status(401).json({
                    statuscode: 401,
                    message: "Token loi"
                });
            }
        });
    },
    getcodeGT: async function (req, res) {
        let filter = {
            token: req.body.token
        };
        accounts.findOne(filter, async (er, rs) => {
            if (rs) {
                res.status(200).json({
                    statuscode: 200,
                    data: rs.codeGT
                })
            } else {
                res.status(401).json({
                    statuscode: 401,
                    message: "Token loi"
                })
            }
        });
    },
    getcoin: async function (req, res) {
        let filter = {
            token: req.body.token
        };
        accounts.findOne(filter, async (er, rs) => {
            if (rs) {
                res.status(200).json({
                    statuscode: 200,
                    data: rs.coinMH
                })
            } else {
                res.status(401).json({
                    statuscode: 401,
                    message: "Token loi"
                })
            }
        });
    }
}