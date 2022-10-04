const db = require('../config/db')
const conLocal = db.conLocal;
const conLogin = db.conLogin;

exports.cariNRP = (socket) => {
    socket.on('search-nrp', (nrp, id) => {
        conLogin.query("select nama from karyawan where nrp = ?", [nrp], (err, res1) => {
            if(res1.length == 0) {
                socket.emit('nama', '', id);
            } else {
                socket.emit('nama', res1[0].nama, id);
            }
        })
    })
}

exports.cariLine = (socket) => {
    socket.on('getLine', (cluster) => {
        conLocal.query("select distinct nama_line from tb_line where machining = ?", [cluster], (err, resclus) => {
            if(err) {throw err}
            else if (resclus.length === 0) {
                console.log('mt')
            }
            const items = [];
            for (let i = 0; i < resclus.length; i++) {
                items.push(resclus[i].nama_line)
            }
            socket.emit('sendLine', items)
        })
    })
}

exports.cariPart = (socket) => {
    socket.on('getPart', (line, cluster) => {
        conLocal.query("select distinct nama_part from tb_line where machining = ? and nama_line = ?", [cluster, line], (err, resclus) => {
            if(err) {throw err}
            else if (resclus.length === 0) {
                console.log('mt')
            } else {
                const items = [];
                for (let i = 0; i < resclus.length; i++) {
                    items.push(resclus[i].nama_part)
                }
                socket.emit('sendPart', items)
            }
        })
    })
}