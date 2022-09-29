// module express
const express = require('express');
const app = express();
const port = 3000;
const http = require('http').Server(app)
const io = require("socket.io")(http)
// mysql
const mysql = require('mysql');
// module body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// module ejs
app.set('view engine','ejs');
// access file static
app.use(express.static('public'));
// node-fetch
const fetch = require('node-fetch');
const { clearInterval } = require('timers');
// initialize mysql database
var conLocal;
var conLogin;
var conTicket;
function handleError() {
    conLocal = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "smartsys_Monitoring_mach"
    });

    // Connection error, 2 seconds retry
    conLocal.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        } else {
            console.log('Connected')
        }
    });

    conLocal.on('error', function (err) {
        console.log('db error', err);
        // If the connection is disconnected, automatically reconnect
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
    conLogin = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "smartsys_permit"
    });

    // Connection error, 2 seconds retry
    conLogin.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        } else {
            console.log('Connected')
        }
    });

    conLogin.on('error', function (err) {
        console.log('db error', err);
        // If the connection is disconnected, automatically reconnect
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
    conTicket = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "smartsys_ticketing"
    });

    // Connection error, 2 seconds retry
    conTicket.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        } else {
            console.log('Connected')
        }
    });

    conTicket.on('error', function (err) {
        console.log('db error', err);
        // If the connection is disconnected, automatically reconnect
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();

var shift;

function updateshift() {
    var masuk1 = 0;
    var pulang1 =  7 * 60 + 10;
    var masuk2 = pulang1;
    var pulang2 =  16 * 60;
    var masuk3 = pulang2;
    var pulang3 = 23 * 60 + 59;
    var date = new Date(); 
    var now = ((date.getHours() * 60) + date.getMinutes());
    if (masuk1 <= now && now < pulang1) { 
        shift = 1
    } else if (masuk2 <= now && now < pulang2) {
        shift = 2
    } else if (masuk3 <= now && now < pulang3) {
        shift = 3
    }
}

// listening to emit
io.on('connection', (socket) => {
    let interval;
    let resume;
    let dtint;
    var second; 
    var waktu;
    var lasttotal;
    var lastng;
    var lastok;
    var z = 0;
    let trackerTotal;

    socket.on('interval', (id, namapart, line) => {
        updateshift()
        conLocal.query("select * from tb_produksi where id = ? and nama_part = ? and line = ? and tanggal = curdate()", [id, namapart, line], (err, result1) => {
            updateshift()
            trackerTotal = result1[0].TOTAL_PRODUKSI
            if (shift != result1[0].SHIFT) {
                // clearInterval(global[`lt-${line}-${namapart}-${id}`])
                clearInterval(global[`trgt-${line}-${namapart}-${id}`])
                global[`trgt-${line}-${namapart}-${id}`] = null
                // global[`ln-${line}-${namapart}-${id}`] = null
            }
        })
        if (global[`dtcheck-${id}`]) {
            io.emit(`noclick-${id}`, global[`dtcheck-${id}`])
        }
        interval = setInterval(function(){
            conLocal.query("select * from tb_produksi join tb_line on tb_produksi.line = tb_line.nama_line and tb_produksi.nama_part = tb_line.nama_part where tb_produksi.id = ?", [id] , (err, result12) => {
                if (err) {throw(err)}
                else if (result12.length === 0) {
                    console.log(result12[0].TOTAL_PRODUKSI)
                } else {
                    updateshift()
                    function target(id) {
                        updateshift()
                        conLocal.query("select * from tb_produksi where id = ? and tanggal = curdate()", [id], (err, result1) => {
                            var date = new Date(); 
                            var now = (date.getHours() * 60) + date.getMinutes()
                            if (shift != result1[0].SHIFT) {
                                clearInterval(global[`trgt-${line}-${namapart}`])
                                global[`trgt-${line}-${namapart}-${id}`] = null
                                console.log('int stop')
                            } else if (((2 * 60) <= now && now < (2 * 60) + 10) || ((4 * 60) + 30 <= now && now < (5 * 60))) {
                                console.log('istirahat')
                                return
                            } else if (((9 * 60) + 30 <= now && now < (9 * 60) + 40) || ((12 * 60) <= now && now < (12 * 60) + 40) || ((14 * 60) + 20 <= now && now < (14 * 60) + 30)) {
                                console.log('istirahat')
                                return
                            } else if (((18 * 60) <= now && now < (18 * 60) + 15)|| ((19 * 60) + 20 <= now && now < (20 * 60))|| ((21 * 60) + 50 <= now && now < (22 * 60))) {
                                console.log('istirahat')
                                return
                            } else {
                                console.log('sql launched')
                                conLocal.query('update tb_produksi set target = target + 1 where id = ?', [id], (err, rut) => {})
                            }
                        })
                    }
                    // function lostTime(id) {
                    //     updateshift()
                    //     var date = new Date(); 
                    //     var now = (date.getHours() * 60) + date.getMinutes()
                    //     conLocal.query("select * from tb_produksi join tb_line on tb_produksi.line = tb_line.nama_line and tb_produksi.nama_part = tb_line.nama_part where tb_produksi.id = ?", [id] , (err, result12) => {
                    //         console.log(z, result12[0].TOTAL_PRODUKSI, trackerTotal)
                    //         if (global[`dtclick-${id}`]) {
                    //             z = 0
                    //             return
                    //         } else if (shift != result12[0].SHIFT) {
                    //             clearInterval(global[`lt-${line}-${namapart}`])
                    //             global[`lt-${line}-${namapart}-${id}`] = null
                    //         } else if (((2 * 60) <= now && now < (2 * 60) + 10) || ((4 * 60) + 30 <= now && now < (5 * 60)) || ((9 * 60) + 30 <= now && now < (9 * 60) + 40) || ((12 * 60) <= now && now < (12 * 60) + 40) || ((14 * 60) + 20 <= now && now < (14 * 60) + 30)|| ((18 * 60) <= now && now < (18 * 60) + 15)|| ((19 * 60) + 20 <= now && now < (20 * 60))|| ((21 * 60) + 50 <= now && now < (22 * 60))) {
                    //             return
                    //         } else if (z <= result12[0].CYCLE_TIME && result12[0].TOTAL_PRODUKSI > trackerTotal) {
                    //             z = 0
                    //             trackerTotal = result12[0].TOTAL_PRODUKSI
                    //             console.log('under')
                    //         } else if (z > result12[0].CYCLE_TIME && result12[0].TOTAL_PRODUKSI > trackerTotal){
                    //             conLocal.query("update tb_produksi set lost_time = sec_to_time(time_to_sec(lost_time) + ?) where id = ?", [z - result12[0].CYCLE_TIME, id])
                    //             trackerTotal = result12[0].TOTAL_PRODUKSI
                    //             z = 0
                    //             console.log('over')
                    //         } else {
                    //             z++;
                    //             return
                    //         }
                    //     })
                    // }
                    conLocal.query("select * from tb_produksi where id = ?", [id] , (err, reshour) => {
                        conLocal.query("SELECT (TIME_TO_SEC(`5R`) + TIME_TO_SEC(MP_PENGGANTI) + TIME_TO_SEC(CT_TIDAK_STANDART) + TIME_TO_SEC(MP_DIALIHKAN) + TIME_TO_SEC(DANDORY) + TIME_TO_SEC(PREVENTIVE_MAINT) + TIME_TO_SEC(PROD_PART_LAIN) + TIME_TO_SEC(`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(`PRODUKSI_1_M/P`) + TIME_TO_SEC(`PRODUKSI_2_M/C`) + TIME_TO_SEC(OVERLAP_LINE_LAIN) + TIME_TO_SEC(LAYOFF_MANPOWER) + TIME_TO_SEC(LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(LAYOFF_KOMP_SPM) + TIME_TO_SEC(LAYOFF_KOMP_CNC) + TIME_TO_SEC(PACKAGING_KOSONG) + TIME_TO_SEC(LAYOFF_STOCK_WAITING)) AS totalplan,  (TIME_TO_SEC(gagal_vacum) + TIME_TO_SEC(gagal_ambil) + TIME_TO_SEC(instocker) + TIME_TO_SEC(outstocker) + TIME_TO_SEC(feeder) + TIME_TO_SEC(flipper) + TIME_TO_SEC(robot)) AS totalauto, (TIME_TO_SEC(MC_TROUBLE) + TIME_TO_SEC(MC_ASSY_TROUBLE) + TIME_TO_SEC(MC_SPM_DRILL) + TIME_TO_SEC(LT_TROUBLE) + TIME_TO_SEC(WASHING_TROUBLE) + TIME_TO_SEC(ANGIN_DROP) + TIME_TO_SEC(PENAMBAHAN_COOLANT) + TIME_TO_SEC(WARMING_UP) + TIME_TO_SEC(OTHERS_MC)) AS totalmesin, (TIME_TO_SEC(stock_waiting) + TIME_TO_SEC(PARTIAL) + TIME_TO_SEC(sortir) + TIME_TO_SEC(innerpart_kosong) + TIME_TO_SEC(repair_part) + TIME_TO_SEC(trimming_part) + TIME_TO_SEC(sto) + TIME_TO_SEC(others_material)) AS totalmat,  (TIME_TO_SEC(SETTING_PROGRAM) + TIME_TO_SEC(GANTI_TOOL) + TIME_TO_SEC(TRIAL_MACHINING) + TIME_TO_SEC(Q_TIME) + TIME_TO_SEC(JIG_FIXTURE) + TIME_TO_SEC(WAITING_CMM) + TIME_TO_SEC(UKUR_MANUAL) + TIME_TO_SEC(LT_IMPRAG) + TIME_TO_SEC(GANTI_THREEBOND) + TIME_TO_SEC(PERUBAHAN_PROSES) + TIME_TO_SEC(JOB_SET_UP) + TIME_TO_SEC(TRIAL_NON_MACH) + TIME_TO_SEC(OTHERS_PROSES)) AS totalpro, (TIME_TO_SEC(PERSIAPAN_PROD) + TIME_TO_SEC(LISTRIK_MATI) + TIME_TO_SEC(KURAS_WASHING) + TIME_TO_SEC(P5M) + TIME_TO_SEC(MP_SAKIT) + TIME_TO_SEC(OTHERS)) AS totaloth  FROM tb_dt_terplanning, tb_dt_auto, tb_dt_proses, tb_dt_material, tb_dt_mesin, tb_dt_others  WHERE tb_dt_terplanning.ID = ? AND tb_dt_auto.ID = ? AND tb_dt_mesin.ID = ? AND tb_dt_proses.ID = ? AND tb_dt_material.ID = ? AND tb_dt_others.ID = ?", [id, id, id, id, id, id], (err, reshour1) => {
                            var date = new Date(); 
                            var now = date.getHours()
                            conLocal.query("delete from tb_data_hourly where tanggal != curdate()", (err, resdel) => {})
                            let totalDT = reshour1[0].totalplan + reshour1[0].totalauto + reshour1[0].totalmesin + reshour1[0].totalmat + reshour1[0].totalpro + reshour1[0].totaloth
                            let ava = ((480 * 60)-totalDT)/(480 * 60)
                            let per = (reshour[0].TOTAL_PRODUKSI)/((480*60)/result12[0].CYCLE_TIME)
                            let qua = (reshour[0].OK/reshour[0].TOTAL_PRODUKSI)
                            let oee = ava * per * qua
                            conLocal.query('update tb_produksi set ava = ?, per = ?, qua = ?, oee = ? where id = ?', [ava.toFixed(3), per.toFixed(3), qua.toFixed(3), oee.toFixed(3), id], (err, resoee) => {})
                            conLocal.query("select * from tb_data_hourly where tanggal = curdate() and shift = ? and jam = ? and nama_part = ? and line = ? and idlap = ?", [shift, now, namapart, line, id], (err, resc) => {
                                if (err) {throw err}
                                else if (shift != reshour[0].SHIFT) {
                                    clearInterval(interval)
                                }
                                else if (resc.length === 0) {
                                    io.emit(`update-total-${id}`, result12[0].TOTAL_PRODUKSI, result12[0].TARGET)
                                    conLocal.query("select sum(total_produksi) as total, sum(ok) as ok, sum(ng) as ng, sum(time_to_sec(dt_auto)) as totalauto,sum(time_to_sec(dt_material)) as totalmat, sum(time_to_sec(dt_mesin)) as totalmesin, sum(time_to_sec(dt_others)) as totalothers, sum(time_to_sec(dt_proses)) as totalproses, sum(time_to_sec(dt_terplanning)) as totalplan, sum(target) as target from tb_data_hourly where shift = ? and nama_part = ? and line = ? and tanggal = curdate() and idlap = ?", [shift, namapart, line, id], (err, resch) => {
                                        if (err) {throw err}
                                        lasttotal = resch[0].total
                                        lastok = resch[0].ok
                                        lastng = resch[0].ng
                                        lasttotaln = reshour[0].TOTAL_PRODUKSI
                                        lastokn = reshour[0].OK
                                        lastngn = reshour[0].NG
                                        conLocal.query("insert into tb_data_hourly (TANGGAL, JAM, SHIFT, LINE, IDLAP, NAMA_PART, OK, NG, TOTAL_PRODUKSI, TARGET, DT_AUTO, DT_MATERIAL, DT_MESIN, DT_OTHERS, DT_PROSES, DT_TERPLANNING) values (curdate(), ?, ?, ?, ?, ?, ?, ?, ?, ?, sec_to_time(?), sec_to_time(?), sec_to_time(?), sec_to_time(?), sec_to_time(?), sec_to_time(?))", [now, shift, line, id, namapart, Math.max(lastokn - lastok, 0), Math.max(lastngn - lastng, 0), Math.max(lasttotaln - lasttotal, 0), Math.max(reshour[0].TARGET - resch[0].target, 0), Math.max(reshour1[0].totalauto - resch[0].totalauto, 0), Math.max(reshour1[0].totalmat - resch[0].totalmat, 0), Math.max(reshour1[0].totalmesin - resch[0].totalmesin, 0), Math.max(reshour1[0].totaloth - resch[0].totalothers, 0), Math.max(reshour1[0].totalpro - resch[0].totalproses, 0), Math.max(reshour1[0].totalplan - resch[0].totalplan, 0)], (err, res13) => {
                                            if (err) {throw err}
                                        })
                                        
                                    })
                                } else {
                                    io.emit(`update-total-${id}`, result12[0].TOTAL_PRODUKSI, result12[0].TARGET)
                                    conLocal.query("SELECT SUM(total_produksi) as total, SUM(ok) as ok, SUM(ng) as ng, sum(time_to_sec(dt_auto)) as totalauto,sum(time_to_sec(dt_material)) as totalmat, sum(time_to_sec(dt_mesin)) as totalmesin, sum(time_to_sec(dt_others)) as totalothers, sum(time_to_sec(dt_proses)) as totalproses, sum(time_to_sec(dt_terplanning)) as totalplan, sum(target) as target FROM tb_data_hourly WHERE shift = ? and nama_part = ? and line = ? AND tanggal = CURDATE() AND idlap = ? and id != (SELECT max(id) FROM tb_data_hourly WHERE shift = ? and nama_part = ? and line = ? and tanggal = CURDATE() and idlap = ?)", [shift, namapart, line, id, shift, namapart, line, id], (err, resch) => {
                                        if (err) {throw err}
                                        lasttotal = resch[0].total
                                        lastok = resch[0].ok
                                        lastng = resch[0].ng
                                        conLocal.query("update tb_data_hourly set total_produksi = ?, ok = ?, ng = ?, target = ?, dt_auto = sec_to_time(?), dt_material = sec_to_time(?), dt_mesin = sec_to_time(?), dt_others = sec_to_time(?), dt_proses = sec_to_time(?), dt_terplanning = sec_to_time(?) where tanggal = curdate() and shift = ? and jam = ? and nama_part = ? and line = ? and idlap = ?", [Math.max(reshour[0].TOTAL_PRODUKSI - lasttotal, 0), Math.max(reshour[0].OK - lastok, 0), Math.max(reshour[0].NG - lastng, 0), Math.max(reshour[0].TARGET - resch[0].target, 0), Math.max(reshour1[0].totalauto - resch[0].totalauto, 0), Math.max(reshour1[0].totalmat - resch[0].totalmat, 0), Math.max(reshour1[0].totalmesin - resch[0].totalmesin, 0), Math.max(reshour1[0].totaloth - resch[0].totalothers, 0), Math.max(reshour1[0].totalpro - resch[0].totalproses, 0), Math.max(reshour1[0].totalplan - resch[0].totalplan, 0), shift, now, namapart, line, id], (err, resin) => {
                                            if (err) {throw err}
                                        })
                                    })
                                }
                                if (!global[`trgt-${line}-${namapart}-${id}`]) {
                                    console.log('target done')
                                    global[`trgt-${line}-${namapart}-${id}`] = setInterval(() => {target(id)}, parseInt(result12[0].CYCLE_TIME) * 1000)
                                }
                                // if (!global[`lt-${line}-${namapart}-${id}`]) {
                                //     global[`lt-${line}-${namapart}-${id}`] = setInterval(() => {lostTime(id)}, 1000)
                                // }
                            })
                        })
                    })
                }
            })
        }, 1000)

        resume = setInterval(function(){
            updateshift()
            conLocal.query("SELECT plan.id, sum(prod.TOTAL_PRODUKSI) AS totalprod, sum(prod.OK) AS ok, sum(prod.NG) AS ng, sum(TIME_TO_SEC(plan.`5R`) + TIME_TO_SEC(plan.MP_PENGGANTI) + TIME_TO_SEC(plan.CT_TIDAK_STANDART) + TIME_TO_SEC(plan.MP_DIALIHKAN) + TIME_TO_SEC(plan.DANDORY) + TIME_TO_SEC(plan.PREVENTIVE_MAINT) + TIME_TO_SEC(plan.PROD_PART_LAIN) + TIME_TO_SEC(plan.`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(plan.`PRODUKSI_1_M/P`) + TIME_TO_SEC(plan.`PRODUKSI_2_M/C`) + TIME_TO_SEC(plan.OVERLAP_LINE_LAIN) + TIME_TO_SEC(plan.LAYOFF_MANPOWER) + TIME_TO_SEC(plan.LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(plan.LAYOFF_KOMP_SPM) + TIME_TO_SEC(plan.LAYOFF_KOMP_CNC) + TIME_TO_SEC(plan.PACKAGING_KOSONG) + TIME_TO_SEC(plan.LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(auto.gagal_vacum) + TIME_TO_SEC(auto.gagal_ambil) + TIME_TO_SEC(auto.instocker) + TIME_TO_SEC(auto.outstocker) + TIME_TO_SEC(auto.feeder) + TIME_TO_SEC(auto.flipper) + TIME_TO_SEC(auto.robot)) AS totalauto, sum(TIME_TO_SEC(mach.MC_TROUBLE) + TIME_TO_SEC(mach.MC_ASSY_TROUBLE) + TIME_TO_SEC(mach.MC_SPM_DRILL) + TIME_TO_SEC(mach.LT_TROUBLE) + TIME_TO_SEC(mach.WASHING_TROUBLE) + TIME_TO_SEC(mach.ANGIN_DROP) + TIME_TO_SEC(mach.PENAMBAHAN_COOLANT) + TIME_TO_SEC(mach.WARMING_UP) + TIME_TO_SEC(mach.OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(mat.stock_waiting) + TIME_TO_SEC(mat.PARTIAL) + TIME_TO_SEC(mat.sortir) + TIME_TO_SEC(mat.innerpart_kosong) + TIME_TO_SEC(mat.repair_part) + TIME_TO_SEC(mat.trimming_part) + TIME_TO_SEC(mat.sto) + TIME_TO_SEC(mat.others_material)) AS totalmat, sum(TIME_TO_SEC(pro.SETTING_PROGRAM) + TIME_TO_SEC(pro.GANTI_TOOL) + TIME_TO_SEC(pro.TRIAL_MACHINING) + TIME_TO_SEC(pro.Q_TIME) + TIME_TO_SEC(pro.JIG_FIXTURE) + TIME_TO_SEC(pro.WAITING_CMM) + TIME_TO_SEC(pro.UKUR_MANUAL) + TIME_TO_SEC(pro.LT_IMPRAG) + TIME_TO_SEC(pro.GANTI_THREEBOND) + TIME_TO_SEC(pro.PERUBAHAN_PROSES) + TIME_TO_SEC(pro.JOB_SET_UP) + TIME_TO_SEC(pro.TRIAL_NON_MACH) + TIME_TO_SEC(pro.OTHERS_PROSES)) AS totalpro, sum(TIME_TO_SEC(oth.PERSIAPAN_PROD) + TIME_TO_SEC(oth.LISTRIK_MATI) + TIME_TO_SEC(oth.KURAS_WASHING) + TIME_TO_SEC(oth.P5M) + TIME_TO_SEC(oth.MP_SAKIT) + TIME_TO_SEC(oth.OTHERS)) AS totaloth FROM tb_dt_terplanning AS plan join tb_dt_auto AS auto ON auto.id = plan.id join tb_dt_proses AS pro ON pro.id = auto.id join tb_dt_material AS mat ON mat.id = pro.id join tb_dt_mesin AS mach ON mach.id = mat.id join tb_dt_others AS oth ON oth.id = mach.id JOIN tb_produksi AS prod ON prod.id = oth.id WHERE plan.NAMA_PART = ? AND plan.LINE = ? AND plan.tanggal = CURDATE() AND plan.SHIFT = ?;", [namapart, line, shift], (err, rint) => {
                io.emit(`update-resume-${id}`, shift, rint[0].totalprod, rint[0].ok, rint[0].ng, rint[0].totalplan, rint[0].totalauto, rint[0].totalmesin, rint[0].totalmat, rint[0].totalpro, rint[0].totaloth)
            })
            conLocal.query("select * from tb_data_hourly where nama_part = ? and line = ? and tanggal = curdate()", [namapart, line], (err, resl) => {
                if (resl.length === 0) {
                    console.log('jam kosong')
                } else {
                    for (let i = 0; i < resl.length; i++) {
                        io.emit(`update-hourly-${id}`, resl[i].JAM, resl[i].TOTAL_PRODUKSI, Math.max(resl[i].OK,0), resl[i].NG, resl[i].SHIFT)
                    }
                }
            })
        }, 1000)
    })
    socket.on('test', () => {
        console.log('test')
    })
    socket.on('disconnect', () => {
        clearInterval(interval)
        clearInterval(resume)
    })
    socket.on('update-ng', (ng, ok, id) => {
        conLocal.query("update tb_produksi set ng = ?, ok = ? where id = ?", [ng, ok, id], (err, result) => {
            if (err) {throw new Error('Failed')}
            //console.log(ng, lhpid)
        })
    })
    socket.on('update-reject', (jenis, total, id) => {
        conLocal.query("update tb_rejection set "+ jenis +" = ? where ID = ?", [total, id], (err, result) => {
            if (err) {throw new Error('Failed')}
        })
        conLocal.query("update tb_locsheet_1 set "+ global[`kodelocsheet-${id}`] +" = "+global[`kodelocsheet-${id}`]+" - 1 where ID = ?", [id], (err, result) => {
            conLocal.query("update tb_locsheet_2 set "+ global[`kodelocsheet-${id}`]+" = "+global[`kodelocsheet-${id}`]+" - 1 where ID = ?", [id], (err, result) => {
                conLocal.query("update tb_locsheet_3 set "+ global[`kodelocsheet-${id}`]+" = "+global[`kodelocsheet-${id}`]+" - 1 where ID = ?", [id], (err, result) => {
                    
                })
            })
        })
    })
    socket.on('update-dt', async (pelapor, problem, deskripsi, nama_part, lane, namadt, jenisdt, id, idlap) => {
        if (!global[`dtclick-${idlap}`]) {
            var obj;
            const body = {name: pelapor, problem: problem, deskripsi: deskripsi, nama_part: nama_part, lane: lane};
            const response = await fetch('http://localhost:3030/buattiket/WIT7B1fENoSu', {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json())
            .then(json => obj = json)
            .then(res => console.log(res))
            .catch(err => console.log(err));
            var stringify = JSON.stringify(obj)
            var parse = JSON.parse(stringify)
            //waktu = parse.waktu
            global[`tid-${idlap}`] = parse.message
            global[`dtcheck-${idlap}`] = id;
            global[`dtclick-${idlap}`] = true;
            //var timeLeft
            conLocal.query("select time_to_sec(`"+namadt+"`) as '"+namadt+"' from tb_dt_"+jenisdt+" where ID = ?", [idlap], (err, result) => {
                if (err) {throw new Error('Failed')}
                second = result[0][namadt]
                console.log(second)
                socket.emit('send-dt-value', result[0][namadt]);
            })
            global[`dtint-${parse.message}`] = setInterval(function(){
                // var endTime = new Date();
                // var endTime = (Date.parse(endTime)) / 1000;
                // var m = new Date();
                // var dateString =
                //     m.getUTCFullYear() + "-" +
                //     ("0" + (m.getMonth()+1)).slice(-2) + "-" +
                //     ("0" + m.getDate()).slice(-2) + "T" +
                //     ("0" + m.getHours()).slice(-2) + ":" +
                //     ("0" + m.getMinutes()).slice(-2) + ":" +
                //     ("0" + m.getSeconds()).slice(-2) + ".000Z";
                // var now = (Date.parse(dateString) / 1000);
                // timeLeft = now - endTime;
                conLocal.query("select * from tb_produksi where id = ? and nama_part = ? and line = ? and tanggal = curdate()", [idlap, nama_part, lane], async (err, result1) => {
                    updateshift()
                    if (shift != result1[0].SHIFT && global[`dtint-${global[`tid-${idlap}`]}`]) {
                        const body = {};
                        const response = await fetch('http://localhost:3030/selesai/'+global[`tid-${idlap}`]+'/operator/KeRuFIfu6i8a', {
                            method: 'post',
                            body: JSON.stringify(body),
                            headers: {'Content-Type': 'application/json'}
                        }).then(res => res.json())
                        .then(json => console.log(json))
                        clearInterval(global[`dtint-${global[`tid-${idlap}`]}`])
                        global[`tid-${idlap}`] = null
                        global[`dtcheck-${idlap}`] = null
                        global[`dtclick-${idlap}`] = false
                    }
                })
                conLocal.query("update tb_dt_"+jenisdt+" set `"+namadt+"` = sec_to_time(time_to_sec(`"+namadt+"`)+1) where ID = ?", [idlap], (err, result) => {
                    if (err) {console.log(err)}
                })
            }, 1000)
        } else {
            console.log('doublee')
            conLocal.query("select time_to_sec(`"+namadt+"`) as '"+namadt+"' from tb_dt_"+jenisdt+" where ID = ?", [idlap], (err, result) => {
                if (err) {throw new Error('Failed')}
                second = result[0][namadt]
                console.log(second)
                socket.emit('send-dt-value', result[0][namadt]);
            })
        }
    })
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
        global[`tid-${idlap}`] = null
        global[`dtcheck-${idlap}`] = null
        global[`dtclick-${idlap}`] = false
        // let check = setInterval(function(){
        //     conTicket.query("select * from ticketselesai where ticketid = ?", [global[`tid-${idlap}`]], (err, resdone) => {
        //         if (err) {throw err}
        //         else {
        //             if (resdone[0].pelaporsetuju == 1 && resdone[0].teknisisetuju == 1) {
        //                 clearInterval(global[`dtint-${global[`tid-${idlap}`]}`])
        //                 clearInterval(check)
        //                 global[`tid-${idlap}`] = null
        //                 global[`dtcheck-${idlap}`] = null
        //                 global[`dtclick-${idlap}`] = false
        //             } 
        //         }
        //     })
        // }, 1000) 
    })
    socket.on('selesai-noticket-dt', async() => {
        dtclick = false;
        clearInterval(dtint)
    })
    socket.on('dt-selesai-auto', async(idlap) => {
        const body ={};
        clearInterval(global[`dtint-${global[`tid-${idlap}`]}`]);
        const response = await fetch('http://localhost:3030/selesai/'+global[`tid-${idlap}`]+'/operator/auto/WQ1n5prQcGCt', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.log(err))
        global[`tid-${idlap}`] = null
        global[`dtcheck-${idlap}`] = null
        global[`dtclick-${idlap}`] = false
    })
    socket.on('search-nrp', (nrp, id) => {
        conLogin.query("select nama from karyawan where nrp = ?", [nrp], (err, res1) => {
            if(res1.length == 0) {
                socket.emit('nama', '', id);
            } else {
                socket.emit('nama', res1[0].nama, id);
            }
        })
    })
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
})

app.get('/', (req, res) => {
    const arr = [];
    conLocal.query("select * from tb_part where id > 1", (err, res1) => {
        if (err) {throw err}
        for (let i = 0; i < res1.length; i++) {
            arr.push(res1[i].NAMA_PART)
        }
        data = {
            res1,
            arr
        }
        res.render('preparation', data)
    })
})

app.post('/preparation', (req, res) => {
    var part = req.body.namapart
    var api = part.replace("/", "+")
    var nrp1 = req.body.nrp1;
    var nrp2 = req.body.nrp2;
    var nrp3 = req.body.nrp3;
    var nrp4 = req.body.nrp4;
    updateshift()
    conLocal.query("select tb_produksi.ID, tb_produksi.SHIFT, tb_line.CYCLE_TIME from tb_produksi join tb_line on tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART where tb_produksi.line = ? and tb_produksi.nama_part = ? and tb_produksi.shift = ? and tb_produksi.tanggal = curdate() AND (tb_produksi.nrp1 = ? OR tb_produksi.nrp1 = ? OR tb_produksi.nrp1 = ? OR tb_produksi.nrp1 = ?) AND (tb_produksi.nrp2 = ? OR tb_produksi.nrp2 = ? OR tb_produksi.nrp2 = ? OR tb_produksi.nrp2 = ?) AND (tb_produksi.nrp3 = ? OR tb_produksi.nrp3 = ? OR tb_produksi.nrp3 = ? OR tb_produksi.nrp3 = ?) AND (tb_produksi.nrp4 = ? OR tb_produksi.nrp4 = ? OR tb_produksi.nrp4 = ? OR tb_produksi.nrp4 = ?)", [req.body.line, part, shift, nrp1, nrp2, nrp3, nrp4, nrp1, nrp2, nrp3, nrp4, nrp1, nrp2, nrp3, nrp4, nrp1, nrp2, nrp3, nrp4], (err, rescheck) => {
        conLocal.query("select * from tb_produksi where nama_part = ? and line = ? and tanggal = curdate() and shift = ?", [part, req.body.line, shift], (err, resdouble) => {
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
                conLocal.query("INSERT INTO tb_produksi (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resauto) => {
                    conLocal.query("INSERT INTO tb_rejection (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resreject) => {
                        conLocal.query("INSERT INTO tb_dt_auto (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resauto) => {
                            conLocal.query("INSERT INTO tb_dt_material (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resmat) => {
                                conLocal.query("INSERT INTO tb_dt_mesin (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resmesin) => {
                                    conLocal.query("INSERT INTO tb_dt_others (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resothers) => {
                                        conLocal.query("INSERT INTO tb_dt_proses (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, respro) => {       
                                            conLocal.query("INSERT INTO tb_dt_terplanning (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resplan) => {
                                                conLocal.query("INSERT INTO tb_locsheet_1 (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resloc1) => {
                                                    conLocal.query("INSERT INTO tb_locsheet_2 (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resloc2) => {
                                                        conLocal.query("INSERT INTO tb_locsheet_3 (tanggal, shift, nrp1, nrp2, nrp3, nrp4, line, nama_part) VALUES (curdate(), '?', ?, ?, ?, ?, ?, ?);", [shift, nrp1, nrp2, nrp3, nrp4, req.body.line, part], (err, resloc3) => {
                                                            conLocal.query("SELECT * FROM tb_produksi JOIN tb_line ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART WHERE tb_produksi.ID = ?", [resloc3.insertId], (err, rescycle) => {
                                                                global[`tid-${resloc3.insertId}`] = null
                                                                global[`dtcheck-${resloc3.insertId}`] = null
                                                                global[`dtclick-${resloc3.insertId}`] = false
                                                                res.redirect(`/${api}/${resauto.insertId}/${req.body.line}`)
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })
    })
})

app.get('/:part/:nomorlhp/:line', (req, res) => {
    var part = req.params.part
    var namapart = part.replace("+", "/")
    var idlaporan = req.params.nomorlhp
    var line = req.params.line
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    updateshift()
    conLocal.query("select * from tb_produksi where id = ? and nama_part = ? and line = ? and tanggal = curdate()", [req.params.nomorlhp, namapart, line], (err, result1) => {
        if (err) {res.send(err)}
        else {
            if (result1.length == 0) {
                res.send('kosong')
            } else {
                if (shift != result1[0].SHIFT) {
                    res.send('Access Denied')
                } else {
                    conLogin.query('select nama from karyawan where nrp = ?', [result1[0].NRP1], (err, resname) => {
                        if (err) {throw err}
                        else {
                            nama1 = resname[0].nama
                            conLocal.query("select * from tb_rejection where id = ?", [idlaporan], (err, result2) => {
                                if (err) {throw err}
                                conLocal.query("SELECT (TIME_TO_SEC(`5R`) + TIME_TO_SEC(MP_PENGGANTI) + TIME_TO_SEC(CT_TIDAK_STANDART) + TIME_TO_SEC(MP_DIALIHKAN) + TIME_TO_SEC(DANDORY) + TIME_TO_SEC(PREVENTIVE_MAINT) + TIME_TO_SEC(PROD_PART_LAIN) + TIME_TO_SEC(`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(`PRODUKSI_1_M/P`) + TIME_TO_SEC(`PRODUKSI_2_M/C`) + TIME_TO_SEC(OVERLAP_LINE_LAIN) + TIME_TO_SEC(LAYOFF_MANPOWER) + TIME_TO_SEC(LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(LAYOFF_KOMP_SPM) + TIME_TO_SEC(LAYOFF_KOMP_CNC) + TIME_TO_SEC(PACKAGING_KOSONG) + TIME_TO_SEC(LAYOFF_STOCK_WAITING)) AS totalplan, (TIME_TO_SEC(gagal_vacum) + TIME_TO_SEC(gagal_ambil) + TIME_TO_SEC(instocker) + TIME_TO_SEC(outstocker) + TIME_TO_SEC(feeder) + TIME_TO_SEC(flipper) + TIME_TO_SEC(robot)) AS totalauto,(TIME_TO_SEC(MC_TROUBLE) + TIME_TO_SEC(MC_ASSY_TROUBLE) + TIME_TO_SEC(MC_SPM_DRILL) + TIME_TO_SEC(LT_TROUBLE) + TIME_TO_SEC(WASHING_TROUBLE) + TIME_TO_SEC(ANGIN_DROP) + TIME_TO_SEC(PENAMBAHAN_COOLANT) + TIME_TO_SEC(WARMING_UP) + TIME_TO_SEC(OTHERS_MC)) AS totalmesin,(TIME_TO_SEC(stock_waiting) + TIME_TO_SEC(PARTIAL) + TIME_TO_SEC(sortir) + TIME_TO_SEC(innerpart_kosong) + TIME_TO_SEC(repair_part) + TIME_TO_SEC(trimming_part) + TIME_TO_SEC(sto) + TIME_TO_SEC(others_material)) AS totalmat,(TIME_TO_SEC(SETTING_PROGRAM) + TIME_TO_SEC(GANTI_TOOL) + TIME_TO_SEC(TRIAL_MACHINING) + TIME_TO_SEC(Q_TIME) + TIME_TO_SEC(JIG_FIXTURE) + TIME_TO_SEC(WAITING_CMM) + TIME_TO_SEC(UKUR_MANUAL) + TIME_TO_SEC(LT_IMPRAG) + TIME_TO_SEC(GANTI_THREEBOND) + TIME_TO_SEC(PERUBAHAN_PROSES) + TIME_TO_SEC(JOB_SET_UP) + TIME_TO_SEC(TRIAL_NON_MACH) + TIME_TO_SEC(OTHERS_PROSES)) AS totalpro,(TIME_TO_SEC(PERSIAPAN_PROD) + TIME_TO_SEC(LISTRIK_MATI) + TIME_TO_SEC(KURAS_WASHING) + TIME_TO_SEC(P5M) + TIME_TO_SEC(MP_SAKIT) + TIME_TO_SEC(OTHERS)) AS totaloth FROM tb_dt_terplanning, tb_dt_auto, tb_dt_proses, tb_dt_material, tb_dt_mesin, tb_dt_others WHERE tb_dt_terplanning.ID = ? AND tb_dt_auto.ID = ? AND tb_dt_mesin.ID = ? AND tb_dt_proses.ID = ? AND tb_dt_material.ID = ? AND tb_dt_others.ID = ?;", [idlaporan,idlaporan,idlaporan,idlaporan,idlaporan,idlaporan], (err, result3) => {
                                    conLocal.query("SELECT (dimensi + blong + seret + dent + uncutting + step + kasar +NG_ASSY+RIVET+BIMETAL+JOINT_TUBE+PLATE+NO_JIG+OTHERS_P+KEROPOS+BOCOR+FLOWLINE+RETAK+GOMPAL+OVER_PROSES+KURANG_PROSES+JAMUR+UNDERCUT+DEKOK+TRIAL+UNCUT_MATERIAL+OTHERS_MATERIAL) AS ng FROM tb_rejection WHERE tanggal = CURDATE() and nama_part = ? AND line = ? and id = ?", [namapart, line, req.params.nomorlhp], (err, resng) => {
                                        conLocal.query("SELECT tb_line.cycle_time FROM tb_produksi JOIN tb_line ON tb_produksi.LINE = tb_line.NAMA_LINE AND tb_produksi.NAMA_PART = tb_line.NAMA_PART WHERE tb_produksi.ID = ?", [req.params.nomorlhp], (err, resct) => {
                                            data = {
                                                totalp: result1[0].TOTAL_PRODUKSI,
                                                result2,
                                                resulttotal: result3,
                                                totalok: result1[0].OK,
                                                ng: resng[0].ng,
                                                que: '', 
                                                namapart,
                                                part,
                                                nama1,
                                                dtclick: global[`dtclick-${idlaporan}`] || false,
                                                nrp1: result1[0].NRP1,
                                                idprod: idlaporan,
                                                undoTracker: global[`undoTracker-${req.params.nomorlhp}`],
                                                line,
                                                target: result1[0].TARGET
                                            }
                                            res.render('rejection', data)
                                        })
                                    })
                                })
                            })
                        }
                    })
                }
            }
        }          
    })
})

app.get('/:part/:nomorlhp/:line/dt', (req, res) => {
    var part = req.params.part
    var namapart = part.replace("+", "/")
    var lhpid = req.params.nomorlhp
    var line = req.params.line
    var totalp;
    var totalok;
    var ng;
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    conLocal.query("select * from tb_produksi where id = ? and nama_part = ? and tanggal = curdate()", [lhpid, namapart], (err, result1) => {
        if (err) {throw err}
        else if (result1.length == 0) {
            res.send('kosong')
        } else {
            updateshift()
            if (shift != result1[0].SHIFT) {
                res.send('kosong tanggal')
            } else {
                conLogin.query('select nama from karyawan where nrp = ?', [result1[0].NRP1], (err, resname) => {
                    if (err) {throw err}
                    else {
                        nama1 = resname[0].nama
                        totalp = result1[0].TOTAL_PRODUKSI
                        totalok = result1[0].OK
                        conLocal.query("SELECT TIME_TO_SEC(gagal_vacum) AS gagal_vacum, TIME_TO_SEC(gagal_ambil) AS gagal_ambil, TIME_TO_SEC(instocker) AS instocker, TIME_TO_SEC(outstocker) AS outstocker,TIME_TO_SEC(feeder) AS feeder, TIME_TO_SEC(flipper) AS flipper, TIME_TO_SEC(robot) AS robot FROM tb_dt_auto where id=?", [lhpid], (err, resultauto) => {
                            if (err) {throw err}
                            conLocal.query("SELECT TIME_TO_SEC(stock_waiting) AS stock_waiting, TIME_TO_SEC(partial) AS partial, TIME_TO_SEC(sortir) AS sortir, TIME_TO_SEC(innerpart_kosong) AS innerpart_kosong,TIME_TO_SEC(repair_part) AS repair_part, TIME_TO_SEC(trimming_part) AS trimming_part, TIME_TO_SEC(sto) AS sto, TIME_TO_SEC(others_material) AS others_material FROM tb_dt_material WHERE id = ?;", [lhpid],(err, resultmat) => {
                                if (err) {throw err}
                                conLocal.query("SELECT TIME_TO_SEC(MC_TROUBLE) AS mc_trouble, TIME_TO_SEC(MC_ASSY_TROUBLE) AS mc_assy_trouble, TIME_TO_SEC(MC_SPM_DRILL) AS mc_spm_drill, TIME_TO_SEC(LT_TROUBLE) AS lt_trouble,TIME_TO_SEC(WASHING_TROUBLE) AS washing_trouble, TIME_TO_SEC(ANGIN_DROP) AS angin_drop, TIME_TO_SEC(PENAMBAHAN_COOLANT) AS penambahan_coolant, TIME_TO_SEC(WARMING_UP) AS warming_up, TIME_TO_SEC(OTHERS_MC) AS others_mc FROM tb_dt_mesin WHERE id = ?;", [lhpid], (err, resultmac) => {
                                    if (err) {throw err}
                                    conLocal.query("SELECT TIME_TO_SEC(PERSIAPAN_PROD) AS persiapan_prod, TIME_TO_SEC(LISTRIK_MATI) AS listrik_mati, TIME_TO_SEC(KURAS_WASHING) AS kuras_washing, TIME_TO_SEC(P5M) AS p5m,TIME_TO_SEC(MP_SAKIT) AS mp_sakit, TIME_TO_SEC(OTHERS) AS others FROM tb_dt_others WHERE id = ?;", [lhpid], (err, resultoth) => {
                                        if (err) {throw err}
                                        conLocal.query("SELECT TIME_TO_SEC(SETTING_PROGRAM) AS setting_program, TIME_TO_SEC(GANTI_TOOL) AS ganti_tool, TIME_TO_SEC(TRIAL_MACHINING) AS trial_machining, TIME_TO_SEC(Q_TIME) AS q_time,TIME_TO_SEC(JIG_FIXTURE) AS jig_fixture, TIME_TO_SEC(WAITING_CMM) AS waiting_cmm, TIME_TO_SEC(UKUR_MANUAL) AS ukur_manual, TIME_TO_SEC(LT_IMPRAG) AS lt_imprag, TIME_TO_SEC(GANTI_THREEBOND) AS ganti_treebond, TIME_TO_SEC(PERUBAHAN_PROSES) AS perubahan_proses, TIME_TO_SEC(JOB_SET_UP) AS job_setup, TIME_TO_SEC(TRIAL_NON_MACH) AS trial_non_mach, TIME_TO_SEC(OTHERS_PROSES) AS others_proses FROM tb_dt_proses WHERE id = ?;", [lhpid], (err, resultpro) => {
                                            if (err) {throw err}
                                            conLocal.query("SELECT TIME_TO_SEC(5R) AS 5r, TIME_TO_SEC(MP_PENGGANTI) AS mp_pengganti, TIME_TO_SEC(CT_TIDAK_STANDART) AS ct_tidak_standart, TIME_TO_SEC(MP_DIALIHKAN) AS mp_dialihkan, TIME_TO_SEC(DANDORY) AS dandori, TIME_TO_SEC(PREVENTIVE_MAINT) AS preventive_maint, TIME_TO_SEC(PROD_PART_LAIN) AS prod_part_lain, TIME_TO_SEC(`PRODUKSI_2/3_JIG`) AS 'produksi_2/3_jig', TIME_TO_SEC(`PRODUKSI_1_M/P`) AS 'produksi_1_m/p', TIME_TO_SEC(`PRODUKSI_2_M/C`) AS 'produksi_2_m/c', TIME_TO_SEC(OVERLAP_LINE_LAIN) AS overlap_line_lain, TIME_TO_SEC(LAYOFF_MANPOWER) AS layoff_manpower, TIME_TO_SEC(LAYOFF_TOOL_KOSONG) AS layoff_tool_kosong, TIME_TO_SEC(LAYOFF_KOMP_SPM) AS layoff_komp_spm, TIME_TO_SEC(LAYOFF_KOMP_CNC) AS layoff_komp_cnc, TIME_TO_SEC(PACKAGING_KOSONG) AS packaging_kosong, TIME_TO_SEC(LAYOFF_STOCK_WAITING) AS layoff_stock_waiting FROM tb_dt_terplanning WHERE id = ?;", [lhpid], (err, resultplan) => {
                                                if (err) {throw err}
                                                conLocal.query("SELECT (TIME_TO_SEC(`5R`) + TIME_TO_SEC(MP_PENGGANTI) + TIME_TO_SEC(CT_TIDAK_STANDART) + TIME_TO_SEC(MP_DIALIHKAN) + TIME_TO_SEC(DANDORY) + TIME_TO_SEC(PREVENTIVE_MAINT) + TIME_TO_SEC(PROD_PART_LAIN) + TIME_TO_SEC(`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(`PRODUKSI_1_M/P`) + TIME_TO_SEC(`PRODUKSI_2_M/C`) + TIME_TO_SEC(OVERLAP_LINE_LAIN) + TIME_TO_SEC(LAYOFF_MANPOWER) + TIME_TO_SEC(LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(LAYOFF_KOMP_SPM) + TIME_TO_SEC(LAYOFF_KOMP_CNC) + TIME_TO_SEC(PACKAGING_KOSONG) + TIME_TO_SEC(LAYOFF_STOCK_WAITING)) AS totalplan, (TIME_TO_SEC(gagal_vacum) + TIME_TO_SEC(gagal_ambil) + TIME_TO_SEC(instocker) + TIME_TO_SEC(outstocker) + TIME_TO_SEC(feeder) + TIME_TO_SEC(flipper) + TIME_TO_SEC(robot)) AS totalauto,(TIME_TO_SEC(MC_TROUBLE) + TIME_TO_SEC(MC_ASSY_TROUBLE) + TIME_TO_SEC(MC_SPM_DRILL) + TIME_TO_SEC(LT_TROUBLE) + TIME_TO_SEC(WASHING_TROUBLE) + TIME_TO_SEC(ANGIN_DROP) + TIME_TO_SEC(PENAMBAHAN_COOLANT) + TIME_TO_SEC(WARMING_UP) + TIME_TO_SEC(OTHERS_MC)) AS totalmesin,(TIME_TO_SEC(stock_waiting) + TIME_TO_SEC(PARTIAL) + TIME_TO_SEC(sortir) + TIME_TO_SEC(innerpart_kosong) + TIME_TO_SEC(repair_part) + TIME_TO_SEC(trimming_part) + TIME_TO_SEC(sto) + TIME_TO_SEC(others_material)) AS totalmat,(TIME_TO_SEC(SETTING_PROGRAM) + TIME_TO_SEC(GANTI_TOOL) + TIME_TO_SEC(TRIAL_MACHINING) + TIME_TO_SEC(Q_TIME) + TIME_TO_SEC(JIG_FIXTURE) + TIME_TO_SEC(WAITING_CMM) + TIME_TO_SEC(UKUR_MANUAL) + TIME_TO_SEC(LT_IMPRAG) + TIME_TO_SEC(GANTI_THREEBOND) + TIME_TO_SEC(PERUBAHAN_PROSES) + TIME_TO_SEC(JOB_SET_UP) + TIME_TO_SEC(TRIAL_NON_MACH) + TIME_TO_SEC(OTHERS_PROSES)) AS totalpro,(TIME_TO_SEC(PERSIAPAN_PROD) + TIME_TO_SEC(LISTRIK_MATI) + TIME_TO_SEC(KURAS_WASHING) + TIME_TO_SEC(P5M) + TIME_TO_SEC(MP_SAKIT) + TIME_TO_SEC(OTHERS)) AS totaloth FROM tb_dt_terplanning, tb_dt_auto, tb_dt_proses, tb_dt_material, tb_dt_mesin, tb_dt_others WHERE tb_dt_terplanning.ID = ? AND tb_dt_auto.ID = ? AND tb_dt_mesin.ID = ? AND tb_dt_proses.ID = ? AND tb_dt_material.ID = ? AND tb_dt_others.ID = ?;", [lhpid, lhpid, lhpid, lhpid, lhpid, lhpid], (err, resulttotal) => {
                                                    if (err) {throw err}
                                                    conLocal.query("SELECT (dimensi + blong + seret + dent + uncutting + step + kasar +NG_ASSY+RIVET+BIMETAL+JOINT_TUBE+PLATE+NO_JIG+OTHERS_P+KEROPOS+BOCOR+FLOWLINE+RETAK+GOMPAL+OVER_PROSES+KURANG_PROSES+JAMUR+UNDERCUT+DEKOK+TRIAL+UNCUT_MATERIAL+OTHERS_MATERIAL) AS ng FROM tb_rejection WHERE tanggal = CURDATE() and nama_part = ? AND line = ? AND shift = ? and id = ?", [namapart, line, shift, req.params.nomorlhp], (err, resng) => {
                                                        if (err) {res.send(err)}
                                                        conLocal.query("SELECT tb_line.cycle_time FROM tb_produksi JOIN tb_line ON tb_produksi.LINE = tb_line.NAMA_LINE AND tb_produksi.NAMA_PART = tb_line.NAMA_PART WHERE tb_produksi.ID = ?", [req.params.nomorlhp], (err, resct) => {
                                                            if (err) {res.send(err)}
                                                            else {
                                                                data = {
                                                                    totalp,
                                                                    totalok,
                                                                    ng: resng[0].ng,
                                                                    resultauto,
                                                                    resultmac,
                                                                    resultmat,
                                                                    resultoth,
                                                                    resultplan,
                                                                    resultpro, 
                                                                    resulttotal,
                                                                    dtcheck:'',
                                                                    namapart,
                                                                    part,
                                                                    nama1,
                                                                    nrp1: result1[0].NRP1,
                                                                    idprod: lhpid,
                                                                    line,
                                                                    target: result1[0].TARGET
                                                                }
                                                                res.render('downtime', data)
                                                            }
                                                        })
                                                    })
                                                }) 
                                            })  
                                        })  
                                    })
                                })
                            })
                        })
                    }
                })
            } 
        }
    })
})

app.get('/:part/:nomorlhp/:line/resume', (req, res) => {
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
        if (err) {throw err}
        else if (result1.length == 0) {
            res.send('kosong')
        } else {
            totalp = result1[0].TOTAL_PRODUKSI
            totalok = result1[0].OK
            ng = result1[0].NG
            updateshift()
            if (shift != result1[0].SHIFT) {
                res.send('kosong tanggal')
            } else {
                conLogin.query('select nama from karyawan where nrp = ?', [result1[0].NRP1], (err, resname) => {
                    if (err) {throw err}
                    else {
                        nama1 = resname[0].nama
                        conLocal.query("SELECT plan.id, sum(prod.TOTAL_PRODUKSI) AS totalprod, sum(prod.OK) AS ok, sum(prod.NG) AS ng, sum(TIME_TO_SEC(plan.`5R`) + TIME_TO_SEC(plan.MP_PENGGANTI) + TIME_TO_SEC(plan.CT_TIDAK_STANDART) + TIME_TO_SEC(plan.MP_DIALIHKAN) + TIME_TO_SEC(plan.DANDORY) + TIME_TO_SEC(plan.PREVENTIVE_MAINT) + TIME_TO_SEC(plan.PROD_PART_LAIN) + TIME_TO_SEC(plan.`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(plan.`PRODUKSI_1_M/P`) + TIME_TO_SEC(plan.`PRODUKSI_2_M/C`) + TIME_TO_SEC(plan.OVERLAP_LINE_LAIN) + TIME_TO_SEC(plan.LAYOFF_MANPOWER) + TIME_TO_SEC(plan.LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(plan.LAYOFF_KOMP_SPM) + TIME_TO_SEC(plan.LAYOFF_KOMP_CNC) + TIME_TO_SEC(plan.PACKAGING_KOSONG) + TIME_TO_SEC(plan.LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(auto.gagal_vacum) + TIME_TO_SEC(auto.gagal_ambil) + TIME_TO_SEC(auto.instocker) + TIME_TO_SEC(auto.outstocker) + TIME_TO_SEC(auto.feeder) + TIME_TO_SEC(auto.flipper) + TIME_TO_SEC(auto.robot)) AS totalauto, sum(TIME_TO_SEC(mach.MC_TROUBLE) + TIME_TO_SEC(mach.MC_ASSY_TROUBLE) + TIME_TO_SEC(mach.MC_SPM_DRILL) + TIME_TO_SEC(mach.LT_TROUBLE) + TIME_TO_SEC(mach.WASHING_TROUBLE) + TIME_TO_SEC(mach.ANGIN_DROP) + TIME_TO_SEC(mach.PENAMBAHAN_COOLANT) + TIME_TO_SEC(mach.WARMING_UP) + TIME_TO_SEC(mach.OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(mat.stock_waiting) + TIME_TO_SEC(mat.PARTIAL) + TIME_TO_SEC(mat.sortir) + TIME_TO_SEC(mat.innerpart_kosong) + TIME_TO_SEC(mat.repair_part) + TIME_TO_SEC(mat.trimming_part) + TIME_TO_SEC(mat.sto) + TIME_TO_SEC(mat.others_material)) AS totalmat, sum(TIME_TO_SEC(pro.SETTING_PROGRAM) + TIME_TO_SEC(pro.GANTI_TOOL) + TIME_TO_SEC(pro.TRIAL_MACHINING) + TIME_TO_SEC(pro.Q_TIME) + TIME_TO_SEC(pro.JIG_FIXTURE) + TIME_TO_SEC(pro.WAITING_CMM) + TIME_TO_SEC(pro.UKUR_MANUAL) + TIME_TO_SEC(pro.LT_IMPRAG) + TIME_TO_SEC(pro.GANTI_THREEBOND) + TIME_TO_SEC(pro.PERUBAHAN_PROSES) + TIME_TO_SEC(pro.JOB_SET_UP) + TIME_TO_SEC(pro.TRIAL_NON_MACH) + TIME_TO_SEC(pro.OTHERS_PROSES)) AS totalpro, sum(TIME_TO_SEC(oth.PERSIAPAN_PROD) + TIME_TO_SEC(oth.LISTRIK_MATI) + TIME_TO_SEC(oth.KURAS_WASHING) + TIME_TO_SEC(oth.P5M) + TIME_TO_SEC(oth.MP_SAKIT) + TIME_TO_SEC(oth.OTHERS)) AS totaloth FROM tb_dt_terplanning AS plan join tb_dt_auto AS auto ON auto.id = plan.id join tb_dt_proses AS pro ON pro.id = auto.id join tb_dt_material AS mat ON mat.id = pro.id join tb_dt_mesin AS mach ON mach.id = mat.id join tb_dt_others AS oth ON oth.id = mach.id JOIN tb_produksi AS prod ON prod.id = oth.id WHERE plan.NAMA_PART = ? AND plan.LINE = ? AND plan.tanggal = CURDATE() AND plan.SHIFT = 1;", [namapart, line], (err, r1) => {
                            conLocal.query("SELECT plan.id, sum(prod.TOTAL_PRODUKSI) AS totalprod, sum(prod.OK) AS ok, sum(prod.NG) AS ng, sum(TIME_TO_SEC(plan.`5R`) + TIME_TO_SEC(plan.MP_PENGGANTI) + TIME_TO_SEC(plan.CT_TIDAK_STANDART) + TIME_TO_SEC(plan.MP_DIALIHKAN) + TIME_TO_SEC(plan.DANDORY) + TIME_TO_SEC(plan.PREVENTIVE_MAINT) + TIME_TO_SEC(plan.PROD_PART_LAIN) + TIME_TO_SEC(plan.`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(plan.`PRODUKSI_1_M/P`) + TIME_TO_SEC(plan.`PRODUKSI_2_M/C`) + TIME_TO_SEC(plan.OVERLAP_LINE_LAIN) + TIME_TO_SEC(plan.LAYOFF_MANPOWER) + TIME_TO_SEC(plan.LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(plan.LAYOFF_KOMP_SPM) + TIME_TO_SEC(plan.LAYOFF_KOMP_CNC) + TIME_TO_SEC(plan.PACKAGING_KOSONG) + TIME_TO_SEC(plan.LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(auto.gagal_vacum) + TIME_TO_SEC(auto.gagal_ambil) + TIME_TO_SEC(auto.instocker) + TIME_TO_SEC(auto.outstocker) + TIME_TO_SEC(auto.feeder) + TIME_TO_SEC(auto.flipper) + TIME_TO_SEC(auto.robot)) AS totalauto, sum(TIME_TO_SEC(mach.MC_TROUBLE) + TIME_TO_SEC(mach.MC_ASSY_TROUBLE) + TIME_TO_SEC(mach.MC_SPM_DRILL) + TIME_TO_SEC(mach.LT_TROUBLE) + TIME_TO_SEC(mach.WASHING_TROUBLE) + TIME_TO_SEC(mach.ANGIN_DROP) + TIME_TO_SEC(mach.PENAMBAHAN_COOLANT) + TIME_TO_SEC(mach.WARMING_UP) + TIME_TO_SEC(mach.OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(mat.stock_waiting) + TIME_TO_SEC(mat.PARTIAL) + TIME_TO_SEC(mat.sortir) + TIME_TO_SEC(mat.innerpart_kosong) + TIME_TO_SEC(mat.repair_part) + TIME_TO_SEC(mat.trimming_part) + TIME_TO_SEC(mat.sto) + TIME_TO_SEC(mat.others_material)) AS totalmat, sum(TIME_TO_SEC(pro.SETTING_PROGRAM) + TIME_TO_SEC(pro.GANTI_TOOL) + TIME_TO_SEC(pro.TRIAL_MACHINING) + TIME_TO_SEC(pro.Q_TIME) + TIME_TO_SEC(pro.JIG_FIXTURE) + TIME_TO_SEC(pro.WAITING_CMM) + TIME_TO_SEC(pro.UKUR_MANUAL) + TIME_TO_SEC(pro.LT_IMPRAG) + TIME_TO_SEC(pro.GANTI_THREEBOND) + TIME_TO_SEC(pro.PERUBAHAN_PROSES) + TIME_TO_SEC(pro.JOB_SET_UP) + TIME_TO_SEC(pro.TRIAL_NON_MACH) + TIME_TO_SEC(pro.OTHERS_PROSES)) AS totalpro, sum(TIME_TO_SEC(oth.PERSIAPAN_PROD) + TIME_TO_SEC(oth.LISTRIK_MATI) + TIME_TO_SEC(oth.KURAS_WASHING) + TIME_TO_SEC(oth.P5M) + TIME_TO_SEC(oth.MP_SAKIT) + TIME_TO_SEC(oth.OTHERS)) AS totaloth FROM tb_dt_terplanning AS plan join tb_dt_auto AS auto ON auto.id = plan.id join tb_dt_proses AS pro ON pro.id = auto.id join tb_dt_material AS mat ON mat.id = pro.id join tb_dt_mesin AS mach ON mach.id = mat.id join tb_dt_others AS oth ON oth.id = mach.id JOIN tb_produksi AS prod ON prod.id = oth.id WHERE plan.NAMA_PART = ? AND plan.LINE = ? AND plan.tanggal = CURDATE() AND plan.SHIFT = 2;", [namapart, line], (err, r2) => {
                                conLocal.query("SELECT plan.id, sum(prod.TOTAL_PRODUKSI) AS totalprod, sum(prod.OK) AS ok, sum(prod.NG) AS ng, sum(TIME_TO_SEC(plan.`5R`) + TIME_TO_SEC(plan.MP_PENGGANTI) + TIME_TO_SEC(plan.CT_TIDAK_STANDART) + TIME_TO_SEC(plan.MP_DIALIHKAN) + TIME_TO_SEC(plan.DANDORY) + TIME_TO_SEC(plan.PREVENTIVE_MAINT) + TIME_TO_SEC(plan.PROD_PART_LAIN) + TIME_TO_SEC(plan.`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(plan.`PRODUKSI_1_M/P`) + TIME_TO_SEC(plan.`PRODUKSI_2_M/C`) + TIME_TO_SEC(plan.OVERLAP_LINE_LAIN) + TIME_TO_SEC(plan.LAYOFF_MANPOWER) + TIME_TO_SEC(plan.LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(plan.LAYOFF_KOMP_SPM) + TIME_TO_SEC(plan.LAYOFF_KOMP_CNC) + TIME_TO_SEC(plan.PACKAGING_KOSONG) + TIME_TO_SEC(plan.LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(auto.gagal_vacum) + TIME_TO_SEC(auto.gagal_ambil) + TIME_TO_SEC(auto.instocker) + TIME_TO_SEC(auto.outstocker) + TIME_TO_SEC(auto.feeder) + TIME_TO_SEC(auto.flipper) + TIME_TO_SEC(auto.robot)) AS totalauto, sum(TIME_TO_SEC(mach.MC_TROUBLE) + TIME_TO_SEC(mach.MC_ASSY_TROUBLE) + TIME_TO_SEC(mach.MC_SPM_DRILL) + TIME_TO_SEC(mach.LT_TROUBLE) + TIME_TO_SEC(mach.WASHING_TROUBLE) + TIME_TO_SEC(mach.ANGIN_DROP) + TIME_TO_SEC(mach.PENAMBAHAN_COOLANT) + TIME_TO_SEC(mach.WARMING_UP) + TIME_TO_SEC(mach.OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(mat.stock_waiting) + TIME_TO_SEC(mat.PARTIAL) + TIME_TO_SEC(mat.sortir) + TIME_TO_SEC(mat.innerpart_kosong) + TIME_TO_SEC(mat.repair_part) + TIME_TO_SEC(mat.trimming_part) + TIME_TO_SEC(mat.sto) + TIME_TO_SEC(mat.others_material)) AS totalmat, sum(TIME_TO_SEC(pro.SETTING_PROGRAM) + TIME_TO_SEC(pro.GANTI_TOOL) + TIME_TO_SEC(pro.TRIAL_MACHINING) + TIME_TO_SEC(pro.Q_TIME) + TIME_TO_SEC(pro.JIG_FIXTURE) + TIME_TO_SEC(pro.WAITING_CMM) + TIME_TO_SEC(pro.UKUR_MANUAL) + TIME_TO_SEC(pro.LT_IMPRAG) + TIME_TO_SEC(pro.GANTI_THREEBOND) + TIME_TO_SEC(pro.PERUBAHAN_PROSES) + TIME_TO_SEC(pro.JOB_SET_UP) + TIME_TO_SEC(pro.TRIAL_NON_MACH) + TIME_TO_SEC(pro.OTHERS_PROSES)) AS totalpro, sum(TIME_TO_SEC(oth.PERSIAPAN_PROD) + TIME_TO_SEC(oth.LISTRIK_MATI) + TIME_TO_SEC(oth.KURAS_WASHING) + TIME_TO_SEC(oth.P5M) + TIME_TO_SEC(oth.MP_SAKIT) + TIME_TO_SEC(oth.OTHERS)) AS totaloth FROM tb_dt_terplanning AS plan join tb_dt_auto AS auto ON auto.id = plan.id join tb_dt_proses AS pro ON pro.id = auto.id join tb_dt_material AS mat ON mat.id = pro.id join tb_dt_mesin AS mach ON mach.id = mat.id join tb_dt_others AS oth ON oth.id = mach.id JOIN tb_produksi AS prod ON prod.id = oth.id WHERE plan.NAMA_PART = ? AND plan.LINE = ? AND plan.tanggal = CURDATE() AND plan.SHIFT = 3;", [namapart, line], (err, r3) => {
                                    conLocal.query("SELECT (dimensi + blong + seret + dent + uncutting + step + kasar +NG_ASSY+RIVET+BIMETAL+JOINT_TUBE+PLATE+NO_JIG+OTHERS_P+KEROPOS+BOCOR+FLOWLINE+RETAK+GOMPAL+OVER_PROSES+KURANG_PROSES+JAMUR+UNDERCUT+DEKOK+TRIAL+UNCUT_MATERIAL+OTHERS_MATERIAL) AS ng FROM tb_rejection WHERE tanggal = CURDATE() and nama_part = ? AND line = ? AND shift = ? ", [namapart, line, shift], (err, resng) => {
                                        data = {
                                            r1,
                                            r2,
                                            r3,
                                            nrp1: result1[0].NRP1,
                                            nama1: resname[0].nama,
                                            totalp,
                                            totalok,
                                            ng,
                                            dtclick: global[`dtclick-${idlaporan}`] || false,
                                            idprod: idlaporan,
                                            line,
                                            namapart
                                        }
                                        res.render('info', data)
                                    })
                                })
                            })
                        })
                    }
                })
            }
        }
    })
})

app.get('/:part/:nomorlhp/:line/locsheet/:reject/:kodeloc/:kodeundo', (req, res) => {
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
        if (err) {res.send(err)}
        else {
            if (result1.length == 0) {
                res.send('Access Denied! 1')
            } else {
                updateshift()
                if (shift != result1[0].SHIFT) {
                    res.send('Access Denied! 2')
                } else {
                    conLogin.query('select nama from karyawan where nrp = ?', [result1[0].NRP1], (err, resname) => {
                        if (err) {throw err}
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
})

app.post('/:part/:nomorlhp/:line/locsheet/:reject/:kodeloc/:kodeundo', (req, res) => {
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
        if (err) {res.send(err)}
        else {
            if (result1.length == 0) {
                res.send('Access Denied!')
            } else {
                updateshift()
                if (shift != result1[0].SHIFT) {
                    res.send('Access Denied!')
                } else {
                    global[`undoTracker-${req.params.nomorlhp}`] = req.params.kodeundo
                    conLocal.query("update tb_rejection set "+ req.params.reject +" = "+ req.params.reject +" + 1 where ID = ?", [req.params.nomorlhp], (err, result) => {
                        if (err) {throw new Error('Failed')}
                        conLocal.query(`update tb_locsheet_1 set ${req.params.kodeloc}${body} = ${req.params.kodeloc}${body} + 1 where id = ?`, [req.params.nomorlhp], (err, resloc) => {
                            conLocal.query(`update tb_locsheet_2 set ${req.params.kodeloc}${body} = ${req.params.kodeloc}${body} + 1 where id = ?`, [req.params.nomorlhp], (err, resloc2) => {
                                conLocal.query(`update tb_locsheet_3 set ${req.params.kodeloc}${body} = ${req.params.kodeloc}${body} + 1 where id = ?`, [req.params.nomorlhp], (err, resloc3) => {
                                    res.redirect(`/${namapart}/${req.params.nomorlhp}/${line}`)
                                })
                                
                            })
                        })
                    })
                }
            }
        }
    })
})

//listen syntax
http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(new Date());
});

