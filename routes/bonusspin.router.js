module.exports = function (app) {
    var middleware = require('../middleware/account.middleware');
    var bonusspin_middleware = require('../middleware/bonusspin.middleware');
    var ctrBonusspin = require('../controller/bonusspin.controller');
    app.route('/api/bonusspin').post(middleware.logout,ctrBonusspin.bonusSpin);
    app.route('/api/getbonus').post(middleware.logout,ctrBonusspin.getbonusSpin);
    app.route('/api/give-code').post(bonusspin_middleware.giveCode,ctrBonusspin.giveCode);
}