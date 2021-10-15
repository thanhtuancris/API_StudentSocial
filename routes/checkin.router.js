module.exports = function (app) {
    var middleware = require('../middleware/account.middleware');
    var ctrAccount = require('../controller/checkin.controller');
    app.route('/api/checkin').post(middleware.logout,ctrAccount.checkins);
}