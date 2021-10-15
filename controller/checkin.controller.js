const accounts = require('../model/accounts');
const checkins = require('../model/checkin');
module.exports = {
    checkins: async function (req, res) {
        let filter = {
            token: req.body.token
        };
        accounts.findOne(filter, async (er, rs) => {
            if (rs) {
                let check = await checkins.findOne({
                    id_student: rs.code_student
                });
                if (check != null) {
                    let daycheck = check.date_edit,
                        day1 = '' + daycheck.getDate();
                    let day = new Date(),
                        day2 = '' + day.getDate();
                    console.log(day1, day2)
                    if (day1 == day2) {
                        res.status(400).json({
                            statuscode: 400,
                            message: "Bạn đã điểm danh rồi mà :("
                        })
                    } else {
                        let coin = rs.coinMH + 0.5;
                        accounts.updateOne(filter, {
                            coinMH: coin
                        }, function (ers, rss) {
                            res.status(200).json({
                                statuscode: 200,
                                message: "Điểm danh thành công"
                            })
                        });
                        checkins.updateOne({id_student: rs.code_student}, {
                            date_edit: new Date()
                        }, function (ers, rss) {
                        });
                    }

                } else {
                    let newCheck = new checkins({
                        id_student: rs.code_student,
                        date_reg: new Date(),
                        date_edit: new Date(),
                    });
                    newCheck.save();
                    let coin = rs.coinMH + 0.5;
                    accounts.updateOne(filter, {
                        coinMH: coin
                    }, function (ers, rss) {
                        res.status(200).json({
                            statuscode: 200,
                            message: "Điểm danh thành công"
                        })
                    });
                }
            } else {
                res.status(401).json({
                    statuscode: 401,
                    message: "Token lỗi"
                })
            }
        });
    }
}