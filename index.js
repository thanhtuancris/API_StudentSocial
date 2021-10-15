const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const actions = require('./controller/action');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require("mongoose");
const fs = require('fs');
const fileupload = require('express-fileupload');
const db = require('./configs/connect.database');
dotenv.config();
const accounts = require('./model/accounts');
const host = "0.0.0.0";
const port = 3000;
const cron = require('cron').CronJob;
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(helmet());
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
})
// setup the logger
app.use(morgan('combined', {
    stream: accessLogStream
}))
app.use(cors());
//SERVER SET
app.set("view engine", "ejs");
app.set("views", './views');
app.use(express.static('public'));
//connect MongoDB
db.connect()
// Setup RE
let rouAccount = require('./routes/account.router');
rouAccount(app);

let rouNotifi = require('./routes/notification.router');
rouNotifi(app);

let rouBonusspin = require('./routes/bonusspin.router');
rouBonusspin(app);

let rouCheckin = require('./routes/checkin.router');
rouCheckin(app);

let rouCoin = require('./routes/coin.router');
rouCoin(app);

app.get('*', function (req, res) {
    res.render("login")
})
app.post('*', function (req, res) {
    res.status(404).json({
        message: "Trang không tồn tại, vui lòng thử lại"
    });
})
const NodeRSA = require('node-rsa');
const keyPublic = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIBOgIBAAJBAMGGf41b5BmnBc+oRRyasFUgRPxMFcJeVxWYPv3bh5cv5hfPkJcm\n' +
    'nG4ZjoLIRThB6W4LW3N60zqXGb+UGkBlcFkCAwEAAQJAfWeOmCeHtCfLWDkOL+79\n' +
    'fOwgR+113DIN9GxnxVDQmGLMrldWN+G/O5i2jD82sfani/BshEm0yfT48WO3/ayy\n' +
    'AQIhAOr+wAurKc8OF665ijMq2yUc2B5fDaQBueblji/cHIWRAiEA0tLSS3eMr33o\n' +
    'KFWKiXMAnkCccAyBGD7CzWWnPhO4ukkCIFeggxBW1RJGmQIoYaZO1sTyCozYuQdt\n' +
    'NVsqQmkKVQBhAiBJjBCfETq8MjFeeNEWuE775lBs6n/SxHpTC2Z3youEOQIhAKOQ\n' +
    'yNUB6hfga/0DEGOhZyfbexoYHx0ognxy8TPz6bBP\n' +
    '-----END RSA PRIVATE KEY-----');

if (!module.parent) {
    app.listen(process.env.PORT, host, async () => {
        console.log("Project runing port: " + process.env.PORT)
        
    });
}
module.exports = app