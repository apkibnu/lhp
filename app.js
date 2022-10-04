// module express
const express = require('express');
const app = express();
const port = 3000;
const http = require('http').Server(app)
// socket io
const io = require("socket.io")(http)
const socketInterval = require('./socket/interval');
const socketDowntime = require('./socket/downtime');
const socketNG = require('./socket/ng');
const socketPreparation = require('./socket/preparation');
//router
const route = require('./routes/route')
// module body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// module ejs
app.set('view engine','ejs');
// access file static
app.use(express.static('public'));
process.env.TZ = "Asia/Bangkok";

// listening to emit
io.on('connection', (socket) => {
    socketInterval.interval(socket)
    socketInterval.disconnect(socket)
    socketDowntime.updateDT(socket)
    socketDowntime.selesaiDT(socket)
    socketDowntime.selesaiDTAuto(socket)
    socketDowntime.selesaiDTNoTicket(socket)
    socketDowntime.layoff(socket)
    socketDowntime.selesaiLayoff(socket)
    socketNG.updateNG(socket)
    socketNG.updateLocSheet(socket)
    socketPreparation.cariLine(socket)
    socketPreparation.cariNRP(socket)
    socketPreparation.cariPart(socket)
})

app.use(route)

//listen syntax
http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(new Date());
});

