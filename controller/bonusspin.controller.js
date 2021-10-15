const accounts = require('../model/accounts');
const bonusspins1 = require('../model/bonusspin');
const yeucau = require('../model/yeucau');
module.exports = {
    bonusSpin: async (req, res) => {
        let filter = {
            token: req.body.token
        };
        accounts.findOne(filter, (er, rs) => {
            if (rs) {
                bonusspins1.findOne({
                    id_student: rs.code_student
                }, async (er1, rs1) => {
                    if (rs1) {

                    } else {
                        let bonusspin = new bonusspins1({
                            id_student: rs.code_student,
                            reward: [],
                            noreward: [],
                            coin: []
                        });
                        let a = await bonusspin.save();
                    }
                    // Chúc bạn may mắn lần sau: 62 | 1
                    // 50k: 1 | 2
                    // 20k: 2 | 3
                    // 10k: 10 | 4
                    // 1 coin: 17 | 5
                    // 2 coin: 6 | 6
                    // 4 coin: 4 | 7
                    let arrQuay = [2, 3, 3, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6];
                    if (rs.coinMH < 2) {
                        res.status(400).json({
                            statuscode: 400,
                            message: "Bạn đã hết lượt quay!",
                        });
                    } else {
                        let coin = rs.coinMH - 2;
                        accounts.findOneAndUpdate(filter, {
                            coinMH: coin
                        }, (ers, kq) => {
                            for (let i = 0; i < 80; i++) {
                                arrQuay.push(1);
                            }
                            for (let i = 0; i < 5; i++) {
                                arrQuay.push(4);
                            }
                            for (let i = 0; i < 12; i++) {
                                arrQuay.push(5);
                            }
                            setTimeout(() => {
                                const random = Math.floor(Math.random() * arrQuay.length);
                                let sTring = "Error";
                                switch (arrQuay[random]) {
                                    case 1:
                                        sTring = "Chúc bạn may mắn lần sau";
                                        bonusspins1.findOne({
                                            id_student: rs.code_student
                                        }, (er1, rs1) => {
                                            if (rs1) {
                                                let temp = rs1.noreward;
                                                temp.push({
                                                    value: 1,
                                                    time: new Date(),
                                                    code: "",
                                                    seri: "",
                                                    type_card: "",
                                                    status: 1
                                                });
                                                console.log(temp);
                                                bonusspins1.findOneAndUpdate({
                                                    id_student: rs.code_student
                                                }, {
                                                    noreward: temp
                                                }, (a, b) => {});
                                            }
                                        });
                                        break;
                                    case 2:
                                        sTring = "Chúc mừng bạn đã được 50k!";
                                        bonusspins1.findOne({
                                            id_student: rs.code_student
                                        }, (er1, rs1) => {
                                            if (rs1) {
                                                let temp = rs1.reward;
                                                temp.push({
                                                    value: 2,
                                                    time: new Date(),
                                                    code: "",
                                                    seri: "",
                                                    type_card: "",
                                                    status: 1
                                                });
                                                console.log(temp);
                                                bonusspins1.findOneAndUpdate({
                                                    id_student: rs.code_student
                                                }, {
                                                    reward: temp
                                                }, (a, b) => {});
                                            }
                                        });
                                        break;
                                    case 3:
                                        sTring = "Chúc mừng bạn đã được 20k";
                                        bonusspins1.findOne({
                                            id_student: rs.code_student
                                        }, (er1, rs1) => {
                                            if (rs1) {
                                                let temp = rs1.reward;
                                                temp.push({
                                                    value: 3,
                                                    time: new Date(),
                                                    code: "",
                                                    seri: "",
                                                    type_card: "",
                                                    status: 1
                                                });
                                                console.log(temp);
                                                bonusspins1.findOneAndUpdate({
                                                    id_student: rs.code_student
                                                }, {
                                                    reward: temp
                                                }, (a, b) => {});
                                            }
                                        });
                                        break;
                                    case 4:
                                        sTring = "Chúc mừng bạn đã được 10k";
                                        bonusspins1.findOne({
                                            id_student: rs.code_student
                                        }, (er1, rs1) => {
                                            if (rs1) {
                                                let temp = rs1.reward;
                                                temp.push({
                                                    value: 4,
                                                    time: new Date(),
                                                    code: "",
                                                    seri: "",
                                                    type_card: "",
                                                    status: 1
                                                });
                                                console.log(temp);
                                                bonusspins1.findOneAndUpdate({
                                                    id_student: rs.code_student
                                                }, {
                                                    reward: temp
                                                }, (a, b) => {});
                                            }
                                        });
                                        break;
                                    case 5:
                                        sTring = "Chúc mừng bạn đã được 1 Coin";
                                        coin = coin + 1;
                                        bonusspins1.findOne({
                                            id_student: rs.code_student
                                        }, (er1, rs1) => {
                                            if (rs1) {
                                                let temp = rs1.coin;
                                                temp.push({
                                                    value: 5,
                                                    time: new Date(),
                                                    code: "",
                                                    seri: "",
                                                    type_card: "",
                                                    status: 1
                                                });
                                                console.log(temp);
                                                bonusspins1.findOneAndUpdate({
                                                    id_student: rs.code_student
                                                }, {
                                                    coin: temp
                                                }, (a, b) => {});
                                            }
                                        });
                                        accounts.findOneAndUpdate(filter, {
                                            coinMH: coin
                                        }, (a, b) => {});
                                        break;
                                    case 6:
                                        sTring = "Chúc mừng bạn đã được 2 Coin";
                                        coin = coin + 2;
                                        bonusspins1.findOne({
                                            id_student: rs.code_student
                                        }, (er1, rs1) => {
                                            if (rs1) {
                                                let temp = rs1.coin;
                                                temp.push({
                                                    value: 6,
                                                    time: new Date(),
                                                    code: "",
                                                    seri: "",
                                                    type_card: "",
                                                    status: 1
                                                });
                                                console.log(temp);
                                                bonusspins1.findOneAndUpdate({
                                                    id_student: rs.code_student
                                                }, {
                                                    coin: temp
                                                }, (a, b) => {});
                                            }
                                        });
                                        accounts.findOneAndUpdate(filter, {
                                            coinMH: coin
                                        }, (a, b) => {});
                                        break;
                                    case 7:
                                        sTring = "Chúc mừng bạn đã được 4 Coin";
                                        coin = coin + 4;
                                        bonusspins1.findOne({
                                            id_student: rs.code_student
                                        }, (er1, rs1) => {
                                            if (rs1) {
                                                let temp = rs1.coin;
                                                temp.push({
                                                    value: 7,
                                                    time: new Date(),
                                                    code: "",
                                                    seri: "",
                                                    type_card: "",
                                                    status: 1
                                                });
                                                console.log(temp);
                                                bonusspins1.findOneAndUpdate({
                                                    id_student: rs.code_student
                                                }, {
                                                    coin: temp
                                                }, (a, b) => {});
                                            }
                                        });
                                        accounts.findOneAndUpdate(filter, {
                                            coinMH: coin
                                        }, (a, b) => {});
                                        break;
                                    default:
                                        sTring = "Error";
                                }
                                console.log(arrQuay[random], sTring);
                                res.status(200).json({
                                    statuscode: 200,
                                    message: "Quay số thành công!",
                                    data: {
                                        number: arrQuay[random],
                                        string: sTring
                                    }
                                });
                            }, 20);
                        });

                    }
                });

            } else {
                res.status(401).json({
                    statuscode: 401,
                    message: "Đăng nhập thất bại do phiên đăng nhập hết hạn!",
                });
            }
        });
    },
    getbonusSpin: async function (req, res) {
        let filter = {
            token: req.body.token
        };
        accounts.findOne(filter, async (er, rs) => {
            if (rs) {

                let bonusspins = await bonusspins1.findOne({
                    id_student: rs.code_student
                });
                console.log(bonusspins)
                if (bonusspins != null) {
                    for (let i = 0; i < bonusspins.reward.length; i++) {
                        switch (bonusspins.reward[i].value) {
                            case 2:
                                bonusspins.reward[i].string = "50.000VND"
                                break;
                            case 3:
                                bonusspins.reward[i].string = "20.000VND"
                                break;
                            case 4:
                                bonusspins.reward[i].string = "10.000VND"
                                break;
                            default:
                                sTring = "Error";
                        }
                    }
                    for (let i = 0; i < bonusspins.noreward.length; i++) {
                        bonusspins.noreward[i].string = "Chúc bạn may mắn lần sau!"
                    }
                    for (let i = 0; i < bonusspins.coin.length; i++) {
                        switch (bonusspins.coin[i].value) {
                            case 5:
                                bonusspins.coin[i].string = "1 Coin"
                                break;
                            case 6:
                                bonusspins.coin[i].string = "2 Coin"
                                break;
                            case 7:
                                bonusspins.coin[i].string = "4 Coin"
                                break;
                            default:
                                sTring = "Error";
                        }
                    }
                    delete bonusspins._id;
                    setTimeout(function () {
                        res.status(200).json({
                            statuscode: 200,
                            data: bonusspins,
                        })
                    }, 30)
                } else {
                    res.status(200).json({
                        statuscode: 200,
                        data: {
                            reward: [],
                            noreward: [],
                            coin: []
                        }
                    })
                }

            } else {
                res.status(200).json({
                    statuscode: 200,
                    data: {
                        reward: [],
                        noreward: [],
                        coin: []
                    }
                })
            }
        });
    },
    giveCode: async function(req, res){
        let token = req.body.token
        let value = req.body.value
        let type_card = req.body.type_card
        let time = req.body.time
        let check = await accounts.findOne({token: token})
        if(check != null){
            let newuyeucau = yeucau({
                id_student: check.code_student,
                value: value,
                type_card: type_card,
                time: time,
            })
            let rs = await newuyeucau.save()
            if(rs != null){
                res.status(200).json({
                    statuscode: 200,
                    message: "Gửi yêu cầu thành công!",
                    data: {
                        value:value,
                        type_card:type_card,
                        time:time,
                    }
                })
                let rs_update = await bonusspins1.findOne({id_student: check.code_student})
                let reward = rs_update.reward
                let a = new Date(time)
                a = a.toString()
                for(let item of reward){
                    if(a == item.time.toString()){
                        let update = await bonusspins1.updateOne({"reward.time": item.time},{ $set:
                            {
                              "reward.$.status": 2, 
                              "reward.$.type_card": type_card, 
                            }
                        })
                    }
                }
            }else{
                res.status(400).json({
                    statuscode: 400,
                    message: "Gửi yêu cầu thất bại!",
                });
            }
        }else{
            res.status(401).json({
                statuscode: 401,
                message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!",
            });
        }
    }
}
