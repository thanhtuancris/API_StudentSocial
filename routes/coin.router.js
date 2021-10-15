module.exports = function (app) {
    var middleware = require('../middleware/account.middleware');
    var ctrAccount = require('../controller/coin.controller');
    app.route('/api/addrich').post(middleware.addRich,ctrAccount.addRich);
    app.route('/api/getcoin').post(middleware.logout,ctrAccount.getcoin);
    app.route('/api/getcodegt').post(middleware.logout,ctrAccount.getcodeGT);
}