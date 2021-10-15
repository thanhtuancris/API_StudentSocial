module.exports = function (app) {
    var middleware = require('../middleware/notification.middleware');

    var ctrAccount = require('../controller/notification.controller');
    app.route('/api/pushnotification').post(middleware.push_notification,ctrAccount.push_notification);
    app.route('/api/activenoti').post(middleware.active,ctrAccount.active);
    app.route('/api/list_noti').post(middleware.list_noti,ctrAccount.list_noti);
    
}