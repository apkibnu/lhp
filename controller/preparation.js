const db = require('../config/db')
const updateshift = require('../config/shift')
const conLocal = db.conLocal;
let shift;

exports.home = (req, res) => {
    const arr = [];
    conLocal.query("select * from tb_part where id > 1", (err, res1) => {
        if (err) { throw err }
        for (let i = 0; i < res1.length; i++) {
            arr.push(res1[i].NAMA_PART)
        }
        data = {
            res1,
            arr
        }
        res.render('preparation', data)
    })
}

exports.prep = (req, res) => {
    var part = req.body.namapart
    var api = part.replace("/", "+")
    var nrp1 = req.body.nrp1;
    var nrp2 = req.body.nrp2;
    var nrp3 = req.body.nrp3;
    var nrp4 = req.body.nrp4;
    shift = updateshift()
    conLocal.query("select tb_produksi.ID, tb_produksi.SHIFT, tb_line.CYCLE_TIME from tb_produksi join tb_line on tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART where tb_produksi.line = ? and tb_produksi.nama_part = ? and tb_produksi.shift = ? and tb_produksi.tanggal = curdate() AND (tb_produksi.nrp1 = ? OR tb_produksi.nrp1 = ? OR tb_produksi.nrp1 = ? OR tb_produksi.nrp1 = ?) AND (tb_produksi.nrp2 = ? OR tb_produksi.nrp2 = ? OR tb_produksi.nrp2 = ? OR tb_produksi.nrp2 = ?) AND (tb_produksi.nrp3 = ? OR tb_produksi.nrp3 = ? OR tb_produksi.nrp3 = ? OR tb_produksi.nrp3 = ?) AND (tb_produksi.nrp4 = ? OR tb_produksi.nrp4 = ? OR tb_produksi.nrp4 = ? OR tb_produksi.nrp4 = ?)", [req.body.line, part, shift, nrp1, nrp2, nrp3, nrp4, nrp1, nrp2, nrp3, nrp4, nrp1, nrp2, nrp3, nrp4, nrp1, nrp2, nrp3, nrp4], (err, rescheck) => {
        conLocal.query("select * from tb_produksi where nama_part = ? and line = ? and tanggal = curdate() and shift = ?", [part, req.body.line, updateshift()], (err, resdouble) => {
            if (err) {
                res.send(err)
            } else if (rescheck.length > 0) {
                global[`tid-${rescheck[0].ID}`] = null
                global[`dtcheck-${rescheck[0].ID}`] = null
                global[`dtclick-${rescheck[0].ID}`] = false
                res.redirect(`/${api}/${rescheck[0].ID}/${req.body.line}`)
            } else if (resdouble.length > 0) {
                res.redirect('/')
            } else {
                conLocal.query("INSERT INTO tb_produksi (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resauto) => { })
                conLocal.query("INSERT INTO tb_rejection (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resreject) => { })
                conLocal.query("INSERT INTO tb_dt_auto (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resauto) => { })
                conLocal.query("INSERT INTO tb_dt_material (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resmat) => { })
                conLocal.query("INSERT INTO tb_dt_mesin (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resmesin) => { })
                conLocal.query("INSERT INTO tb_dt_others (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resothers) => { })
                conLocal.query("INSERT INTO tb_dt_proses (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, respro) => { })
                conLocal.query("INSERT INTO tb_dt_terplanning (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resplan) => { })
                conLocal.query("INSERT INTO tb_locsheet_1 (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resloc1) => { })
                conLocal.query("INSERT INTO tb_locsheet_2 (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resloc2) => { })
                conLocal.query("INSERT INTO tb_locsheet_3 (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [updateshift(), nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resloc3) => {
                    global[`tid-${resloc3.insertId}`] = null
                    global[`dtcheck-${resloc3.insertId}`] = null
                    global[`dtclick-${resloc3.insertId}`] = false
                    res.redirect(`/${api}/${resloc3.insertId}/${req.body.line}`)
                })
            }
        })
    })
}