module.exports = {
    giveCode: async (req, res, next) => {
        if (!req.body.token) {
            res.status(400).json({
                statuscode: 400,
                message: "Token không được để trống!"
            });
            return;
        }
        if (!req.body.value) {
            res.status(400).json({
                statuscode: 400,
                message: "Giá trị phần thưởng không được để trống!"
            });
            return;
        }
        if (!req.body.type_card) {
            res.status(400).json({
                statuscode: 400,
                message: "Loại thẻ không được để trống"
            });
            return;
        }
        if (!req.body.time) {
            res.status(400).json({
                statuscode: 400,
                message: "Thời gian không được để trống"
            });
            return;
        }
        next();
    },
   
}