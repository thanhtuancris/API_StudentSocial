module.exports = function (app) {
    var middleware = require('../middleware/account.middleware');
    var ctrAccount = require('../controller/account.controller');
    app.route('/api/login').post(middleware.login,ctrAccount.login);
    app.route('/api/dongbolich').post(ctrAccount.dongbolich);
    app.route('/api/logout').post(middleware.logout,ctrAccount.logout);
    app.route('/api/checkmails').post(ctrAccount.deleteMails);
    app.route('/api/update').post(middleware.logout,ctrAccount.update);
    app.route('/api/test').post(ctrAccount.test);
    app.route('/api/get-lich').post(middleware.getLich,ctrAccount.getLich);
    app.route('/api/get-diem').post(middleware.getDiem,ctrAccount.getDiem);
    app.route('/api/get-ngoaikhoa').post(middleware.getNgoaiKhoa,ctrAccount.getNgoaiKhoa);
}