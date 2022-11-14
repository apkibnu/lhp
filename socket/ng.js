const db = require('../config/db')
const conLocal = db.conLocal;

exports.updateNG = (socket) => {
    socket.on('update-ng', (ng, ok, id) => {
        conLocal.query("update tb_produksi set ng = ?, ok = ? where id = ?", [ng, ok, id], (err, result) => {
            if (err) { throw new Error('Failed') }
            //console.log(ng, lhpid)
        })
    })
}

exports.updateLocSheet = (socket) => {
    socket.on('update-reject', (jenis, total, id) => {
        conLocal.query("update tb_rejection set ?? = ? where ID = ?", [jenis, total, id], (err, result) => {
            if (err) { throw new Error('Failed') }
        })
        conLocal.query("update tb_locsheet_1 set ?? = ?? - 1 where ID = ?", [global[`kodelocsheet-${id}`], global[`kodelocsheet-${id}`], id], (err, result) => {
            conLocal.query("update tb_locsheet_2 set ?? = ?? - 1 where ID = ?", [global[`kodelocsheet-${id}`], global[`kodelocsheet-${id}`], id], (err, result) => {
                conLocal.query("update tb_locsheet_3 set ?? = ?? - 1 where ID = ?", [global[`kodelocsheet-${id}`], global[`kodelocsheet-${id}`], id], (err, result) => {

                })
            })
        })
    })
}