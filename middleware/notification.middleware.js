module.exports = {
    push_notification: async (req, res, next) => {
        if (!req.body.token) {
            res.status(400).json({
                statuscode: 400,
                message: "Token không được để trống!"
            });
            return;
        }
        if (!req.body.content) {
            res.status(400).json({
                statuscode: 400,
                message: "Nội dung tin nhắn không được để trống!"
            });
            return;
        }
        if (req.body.content && req.body.content == "") {
            res.status(400).json({
                statuscode: 400,
                message: "Nội dung tin nhắn không được để trống!"
            });
            return;
        }
        next();
    },
    active: async (req, res, next) => {
        if (!req.body.token) {
            res.status(400).json({
                statuscode: 400,
                message: "Token không được để trống!"
            });
            return;
        }
        if (!req.body.active) {
            res.status(400).json({
                statuscode: 400,
                message: "Lệnh không được để trống!"
            });
            return;
        }
        next();
    },
    list_noti: async (req, res, next) => {
        if (!req.body.token) {
            res.status(400).json({
                statuscode: 400,
                message: "Token không được để trống!"
            });
            return;
        }
        next();
    }
}