const db = require('../config/db')
const updateshift = require('../config/shift')
const conLocal = db.conLocal;
const conLogin = db.conLogin;
let shift;

exports.locSheetGet = (req, res) => {
    var part = req.params.part
    var namapart = part.replace("+", "/")
    var idlaporan = req.params.nomorlhp
    var line = req.params.line
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    conLocal.query("select * from tb_produksi join tb_line on tb_produksi.nama_part = tb_line.nama_part and tb_produksi.line = tb_line.nama_line where tb_produksi.id = ? and tb_produksi.nama_part = ? and tb_produksi.tanggal = curdate()", [req.params.nomorlhp, namapart], (err, result1) => {
        if (err) { res.send(err) }
        else {
            if (result1.length == 0) {
                res.send('Access Denied! 1')
            } else {
                shift = updateshift()
                if (shift != result1[0].SHIFT) {
                    res.send('Access Denied! 2')
                } else {
                    conLogin.query('select nama from karyawan where nrp = ?', [result1[0].NRP1], (err, resname) => {
                        if (err) { throw err }
                        else {
                            data = {
                                nama1: resname[0].nama,
                                namapart,
                                nrp1: result1[0].NRP1,
                                idprod: idlaporan,
                                reject: req.params.reject,
                                kode: req.params.kodeloc,
                                line,
                                undo: req.params.kodeundo
                            }
                            res.render(namapart, data)
                        }
                    })
                }
            }
        }
    })
}

exports.locSheetPost = (req, res) => {
    var part = req.params.part
    var namapart = part.replace("+", "/")
    var body = req.body.kode
    var line = req.params.line
    global[`kodelocsheet-${req.params.nomorlhp}`] = `${req.params.kodeloc}${body}`
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    conLocal.query("select * from tb_produksi where id = ? and nama_part = ? and tanggal = curdate()", [req.params.nomorlhp, namapart], (err, result1) => {
        if (err) { res.send(err) }
        else {
            if (result1.length == 0) {
                res.send('Access Denied!')
            } else {
                shift = updateshift()
                if (shift != result1[0].SHIFT) {
                    res.send('Access Denied!')
                } else {
                    global[`undoTracker-${req.params.nomorlhp}`] = req.params.kodeundo
                    conLocal.query("update tb_rejection set ?? = ?? + 1 where ID = ?", [req.params.reject, req.params.reject, req.params.nomorlhp], (err, result) => {
                        if (err) { throw new Error(err) }
                        conLocal.query(`update tb_locsheet_1 set ?? = ?? + 1 where id = ?`, [req.params.kodeloc + body, req.params.kodeloc + body, req.params.nomorlhp], (err, resloc) => {
                            if (resloc) { res.redirect(`/${namapart}/${req.params.nomorlhp}/${line}`) }
                            else {
                                conLocal.query(`update tb_locsheet_2 set ?? = ?? + 1 where id = ?`, [req.params.kodeloc + body, req.params.kodeloc + body, req.params.nomorlhp], (err, resloc2) => {
                                    if (resloc2) { res.redirect(`/${namapart}/${req.params.nomorlhp}/${line}`) }
                                    else {
                                        conLocal.query(`update tb_locsheet_3 set ?? = ?? + 1 where id = ?`, [req.params.kodeloc + body, req.params.kodeloc + body, req.params.nomorlhp], (err, resloc3) => {
                                            if (err) throw err
                                            res.redirect(`/${namapart}/${req.params.nomorlhp}/${line}`)
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
            }
        }
    })
}