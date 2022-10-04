const db = require('../config/db')
const updateShift = require('../config/shift')
const conLocal = db.conLocal;
const conTicket = db.conTicket;
const fetch = require('node-fetch');

var second; 
let shift;

exports.updateDT = (socket) => {
    socket.on('update-dt', (pelapor, problem, deskripsi, nama_part, lane, namadt, jenisdt, id, idlap) => {
        conTicket.query("select status from tb_line where nama_line = ? and nama_part = ?", [lane, nama_part], async (err, rescheckdt) => {
            if (rescheckdt[0].status == 'normal') {
                console.log(1)
                var obj;
                const body = {name: pelapor, problem: problem, deskripsi: deskripsi, nama_part: nama_part, lane: lane};
                const response = await fetch('http://localhost:3030/buattiket/WIT7B1fENoSu', {
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'}
                }).then(res => res.json())
                .then(json => obj = json)
                .catch(err => console.log(err));
                var stringify = JSON.stringify(obj)
                var parse = JSON.parse(stringify)
                global[`tid-${idlap}`] = parse.message
                conLocal.query("select time_to_sec(`"+namadt+"`) as '"+namadt+"' from tb_dt_"+jenisdt+" where ID = ?", [idlap], (err, result) => {
                    if (err) {throw new Error('Failed')}
                    second = result[0][namadt]
                    console.log(second)
                    socket.emit('send-dt-value', result[0][namadt]);
                })
                global[`dtint-${parse.message}`] = setInterval(function(){
                    conLocal.query("select * from tb_produksi where id = ? and nama_part = ? and line = ? and tanggal = curdate()", [idlap, nama_part, lane], async (err, result1) => {
                        shift = updateShift()
                        if (shift != result1[0].SHIFT && global[`dtint-${global[`tid-${idlap}`]}`]) {
                            const body = {};
                            const response = await fetch('http://localhost:3030/selesai/'+global[`tid-${idlap}`]+'/operator/KeRuFIfu6i8a', {
                                method: 'post',
                                body: JSON.stringify(body),
                                headers: {'Content-Type': 'application/json'}
                            }).then(res => res.json())
                            .then(json => console.log(json))
                            clearInterval(global[`dtint-${global[`tid-${idlap}`]}`])
                            global[`dtint-${global[`tid-${idlap}`]}`] = null
                            global[`tid-${idlap}`] = null
                        }
                    })
                    conLocal.query("update tb_dt_"+jenisdt+" set `"+namadt+"` = sec_to_time(time_to_sec(`"+namadt+"`)+1) where ID = ?", [idlap], (err, result) => {
                        if (err) {console.log(err)}
                    })
                }, 1000)
            } else if (rescheckdt[0].status != 'normal' && global[`dtint-${global[`tid-${idlap}`]}`]) {
                console.log(2)
                console.log('doublee')
                conLocal.query("select time_to_sec(`"+namadt+"`) as '"+namadt+"' from tb_dt_"+jenisdt+" where ID = ?", [idlap], (err, result) => {
                    if (err) {throw new Error('Failed')}
                    second = result[0][namadt]
                    console.log(second)
                    socket.emit('send-dt-value', result[0][namadt]);
                })
            } else if (rescheckdt[0].status != 'normal' && !global[`dtint-${global[`tid-${idlap}`]}`]) {
                console.log(3)
                conTicket.query('select ticketid, idsql, wakturesponstart from ticket JOIN problem ON ticket.problem = problem.namaproblem where tanggal = curdate() and nama_part = ? and lane = ? and statusticket = \'menunggu respon\'', [nama_part, lane], (err, resticket) => {
                    global[`tid-${idlap}`] = resticket[0].ticketid
                    global[`dtint-${global[`tid-${idlap}`]}`] = true
                    var endTime = new Date(resticket[0].wakturesponstart);
                    var endTime = (Date.parse(endTime)) / 1000;
                    global[`dtint-${resticket[0].ticketid}`] = setInterval(() => {
                        var m = new Date();
                        // var dateString =
                        //     m.getUTCFullYear() + "-" +
                        //     ("0" + (m.getMonth()+1)).slice(-2) + "-" +
                        //     ("0" + m.getDate()).slice(-2) + "T" +
                        //     ("0" + m.getHours()).slice(-2) + ":" +
                        //     ("0" + m.getMinutes()).slice(-2) + ":" +
                        //     ("0" + m.getSeconds()).slice(-2) + ".000Z";
                        var now = (Date.parse(m) / 1000);
                        let timeLeft = now - endTime;
                        socket.emit('send-dt-value', timeLeft);
                        conLocal.query("select * from tb_produksi where id = ? and nama_part = ? and line = ? and tanggal = curdate()", [idlap, nama_part, lane], async (err, result1) => {
                            shift = updateShift()
                            if (shift != result1[0].SHIFT && global[`dtint-${global[`tid-${idlap}`]}`]) {
                                const body = {};
                                const response = await fetch('http://localhost:3030/selesai/'+global[`tid-${idlap}`]+'/operator/KeRuFIfu6i8a', {
                                    method: 'post',
                                    body: JSON.stringify(body),
                                    headers: {'Content-Type': 'application/json'}
                                }).then(res => res.json())
                                .then(json => console.log(json))
                                clearInterval(global[`dtint-${global[`tid-${idlap}`]}`])
                                global[`dtint-${global[`tid-${idlap}`]}`] = null
                                global[`tid-${idlap}`] = null
                            }
                        })
                        conLocal.query("update tb_dt_"+jenisdt+" set `"+namadt+"` = sec_to_time(?) where ID = ?", [timeLeft, idlap], (err, result) => {
                            if (err) {console.log(err)}
                        })
                    }, 1000)
                })
            }
        })
    })
}

exports.selesaiDT = (socket) => {
    socket.on('selesai-dt', async (idlap) => {
        const body = {};
        const response = await fetch('http://localhost:3030/selesai/'+global[`tid-${idlap}`]+'/operator/KeRuFIfu6i8a', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.log(err))
        clearInterval(global[`dtint-${global[`tid-${idlap}`]}`])
        global[`dtint-${global[`tid-${idlap}`]}`] == null
        global[`tid-${idlap}`] = null
        // let check = setInterval(function(){
        //     conTicket.query("select * from ticketselesai where ticketid = ?", [global[`tid-${idlap}`]], (err, resdone) => {
        //         if (err) {throw err}
        //         else {
        //             if (resdone[0].pelaporsetuju == 1 && resdone[0].teknisisetuju == 1) {
        //                 clearInterval(global[`dtint-${global[`tid-${idlap}`]}`])
        //                 clearInterval(check)
        //                 global[`tid-${idlap}`] = null
        //
        //                 global[`dtclick-${idlap}`] = false
        //             } 
        //         }
        //     })
        // }, 1000) 
    })
}

exports.selesaiDTNoTicket = (socket) => {
    socket.on('selesai-noticket-dt', async() => {
        dtclick = false;
        clearInterval(dtint)
    })
}

exports.selesaiDTAuto = (socket) => {
    socket.on('dt-selesai-auto', async(idlap) => {
        const body ={};
        const response = await fetch('http://localhost:3030/selesai/'+global[`tid-${idlap}`]+'/operator/auto/WQ1n5prQcGCt', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.log(err))
        clearInterval(global[`dtint-${global[`tid-${idlap}`]}`]);
        global[`dtint-${global[`tid-${idlap}`]}`] = null
        global[`tid-${idlap}`] = null
    })
}

exports.layoff = (socket) => {
    socket.on('layoff', (nama_part, nama_line) => {
        conTicket.query('select status from tb_line where nama_line = ? and nama_part = ?', [nama_line, nama_part], (err, resstat) => {
            if (resstat[0].status == 'normal') {
                conTicket.query("update tb_line set status = 'layoff' where nama_part = ? and nama_line = ?", [nama_part, nama_line], (err, resupdt) => {})
            } else {
                console.log('double')
            }
        })
    })
}

exports.selesaiLayoff = (socket) => {
    socket.on('selesaiLayoff', (nama_line, nama_part) => {
        conTicket.query("update tb_line set status = 'normal' where nama_part = ? and nama_line = ?", [nama_part, nama_line], (err, resupdt) => {})
    })
}