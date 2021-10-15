module.exports = {
    login: async (req, res, next) => {
        if (!req.body.username) {
            res.status(400).json({
                statuscode: 400,
                message: "Tài khoản không được để trống!"
            });
            return;
        }
        if (!req.body.password) {
            res.status(400).json({
                statuscode: 400,
                message: "Mật khẩu không được để trống!"
            });
            return;
        }
        if (!req.body.token_firebase) {
            res.status(400).json({
                statuscode: 400,
                message: "Thiếu token Firebase"
            });
            return;
        }
        res.setTimeout(30000, () => {
            res.status(400).json({
                statuscode: 400,
                message: "timeout"
            });
            return
        });
        next();
    },
    addRich: async (req, res, next) => {
        if (!req.body.token) {
            res.status(400).json({
                statuscode: 400,
                message: "Token không được để trống!"
            });
            return;
        }
        if (!req.body.code) {
            res.status(400).json({
                statuscode: 400,
                message: "Mã giới thiệu không được để trống!"
            });
            return;
        }
        next();
    },
    logout: async (req, res, next) => {
        if (!req.body.token) {
            res.status(400).json({
                statuscode: 400,
                message: "Token không được để trống!"
            });
            return;
        }
        next();
    },
    getLich: async (req, res, next) => {
        if (!req.body.token) {
            res.status(400).json({
                statuscode: 400,
                message: "Token không được để trống!"
            });
            return;
        }
        res.setTimeout(30000, () => {
            res.status(400).json({
                statuscode: 400,
                message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
            });
            return
        });
        next();
    },
    getDiem: async (req, res, next) => {
        if (!req.body.token) {
            res.status(400).json({
                statuscode: 400,
                message: "Token không được để trống!"
            });
            return;
        }
        res.setTimeout(30000, () => {
            res.status(400).json({
                statuscode: 400,
                message: "Server nhà trường đang bảo trì, vui lòng thử lại sau!"
            });
            return
        });
        next();
    },
    getNgoaiKhoa: async (req, res, next) => {
        if (!req.body.token) {
            res.status(400).json({
                statuscode: 400,
                message: "Token không được để trống!"
            });
            return;
        }
        res.setTimeout(30000, () => {
            res.status(400).json({
                statuscode: 400,
                message: "Server nhà trường đang bảo trì, vui lòng thử lại lịch sau!"
            });
            return
        });
        next();
    }
}