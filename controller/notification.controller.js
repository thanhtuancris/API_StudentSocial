const accounts = require('../model/accounts');
const notifications = require('../model/notifications');
const {
    admin
} = require('../configs/firebase-config');
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};
module.exports = {
    push_notification: async function (req, res) {
        let filter = {
            token: req.body.token
        };
        const message = {
            notification: {
               title: req.body.title,
               body: req.body.content
                   }
            };
        const options = notification_options
        accounts.findOne(filter, async function (er, rs) {
            if (rs) {
                if (rs.class) {
                    let Mbclass = await accounts.find({
                        class: rs.class,
                        isnoti: true
                    });
                    let noti = new notifications({
                        school: rs.school,
                        title: req.body.title,
                        events: req.body.content,
                        class: rs.class,
                        full_name: rs.full_name,
                        time: new Date(),
                        type: "class"
                    });
                    noti.save();
                    for (let i = 0; i < Mbclass.length; i++) {
                        if(Mbclass[i].code_student != rs.code_student){
                            try{
                                admin.messaging().sendToDevice(Mbclass[i].token_firebase, message, options)
                                .then(response => {
                                    console.log("Notification sent successfully")
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                            }catch(ex){
                            }
                            
                        }else{
                            
                        }
                        if (i + 1 == Mbclass.length) {
                            res.status(200).json({
                                statuscode: 200,
                                message: "done"
                            })
                        }
                    }
                } else {
                    res.status(400).json({
                        statuscode: 400,
                        message: "Hệ thống lỗi, vui lòng thử lại"
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
    active: async function (req, res) {
        let filter = {
            token: req.body.token
        };
        let update = {
            isnoti: true
        };
        if(req.body.isnoti == "true"){
            update.isnoti = true;
        }
        if(req.body.isnoti == "false"){
            update.isnoti = false;
        }
        
        accounts.findOneAndUpdate(filter, update, async function (er, rs) {
            if (rs) {
                res.status(200).json({
                    statuscode: 200,
                    message: "Update thành công"
                });
            } else {
                res.status(401).json({
                    statuscode: 401,
                    message: "Token loi"
                });
            }
        });
    },
    list_noti: async function (req, res) {
        let filter = {
            token: req.body.token
        };
        accounts.findOne(filter, async function (er, rs) {
            if (rs) {
                if (rs.class) {
                    let a = await notifications.find({school: rs.school,class: rs.class});
                    if(a != null){
                        res.status(200).json({
                            statuscode: 200,
                            data: a
                        });
                    }else{
                        res.status(200).json({
                            statuscode: 200,
                            data: []
                        });
                    }
                } else {
                    res.status(400).json({
                        statuscode: 400,
                        message: "Hệ thống lỗi, vui lòng thử lại"
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
}