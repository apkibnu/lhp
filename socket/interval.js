const db = require('../config/db')
const updateShift = require('../config/shift')
const conLocal = db.conLocal;
const conTicket = db.conTicket
const conLocalP = db.conLocalP;
const conTicketP = db.conTicketP;

let shift = updateShift();
var lasttotal;
var lastng;
var lastok;
let resume;

exports.interval = (socket) => {
    socket.on('interval', (id, namapart, line) => {
        shift = updateShift()
        conLocal.query("select * from tb_produksi where id = ? and nama_part = ? and line = ? and tanggal = curdate()", [id, namapart, line], (err, result1) => {
            shift = updateShift()
            trackerTotal = result1[0].TOTAL_PRODUKSI
            if (shift != result1[0].SHIFT) {
                // clearInterval(global[`lt-${line}-${namapart}-${id}`])
                clearInterval(global[`trgt-${line}-${namapart}-${id}`])
                global[`trgt-${line}-${namapart}-${id}`] = null
                // global[`ln-${line}-${namapart}-${id}`] = null
            }
        })
        conTicket.query("select status from tb_line where nama_line = ? and nama_part = ?", [line, namapart], (err, rescheckdt) => {
            if (rescheckdt[0].status == 'layoff') {
                socket.emit(`noclick-${id}`, 'layoff')
            } else if (rescheckdt[0].status != 'normal') {
                conTicket.query("select ticketid, idsql, wakturesponstart from ticket JOIN problem ON ticket.problem = problem.namaproblem where tanggal = curdate() and nama_part = ? and lane = ? and statusticket = 'menunggu respon'", [namapart, line], (err, resticket) => {
                    if (resticket.length == 0) {
                        return
                    } else { socket.emit(`noclick-${id}`, resticket[0].idsql) }
                })
            }
        })
        function target(id) {
            shift = updateShift()
            conLocal.query("select * from tb_produksi where id = ? and tanggal = curdate()", [id], async (err, result1) => {
                var date = new Date()
                var now = (date.getHours() * 60) + date.getMinutes()
                if (result1.length == 0) {
                    clearInterval(global[`trgt-${line}-${namapart}-${id}`])
                    global[`trgt-${line}-${namapart}-${id}`] = null
                    return
                }
                let [stat, fields] = await conTicketP.execute("select status from tb_line where nama_line = ? and nama_part = ?", [result1[0].LINE, result1[0].NAMA_PART])
                let [check, f] = await conLocalP.execute("select id from tb_produksi where line = ? and nama_part = ? and tanggal = curdate() and shift = ?", [result1[0].LINE, result1[0].NAMA_PART, updateShift()])
                if (updateShift() != result1[0].SHIFT) {
                    clearInterval(global[`trgt-${line}-${namapart}-${id}`])
                    global[`trgt-${line}-${namapart}-${id}`] = null
                    console.log('int stop')
                } else if (stat[0].status == 'layoff') {
                    clearInterval(global[`trgt-${line}-${namapart}-${id}`])
                    global[`trgt-${line}-${namapart}-${id}`] = null
                    return
                } else if (check.length > 1) {
                    clearInterval(global[`trgt-${line}-${namapart}-${id}`])
                    global[`trgt-${line}-${namapart}-${id}`] = null
                    return
                } else if (((2 * 60) <= now && now < (2 * 60) + 10) || ((4 * 60) + 30 <= now && now < (5 * 60))) {
                    console.log('istirahat 1')
                    return
                } else if (((9 * 60) + 30 <= now && now < (9 * 60) + 40) || ((12 * 60) <= now && now < (12 * 60) + 40) || ((14 * 60) + 20 <= now && now < (14 * 60) + 30)) {
                    console.log('istirahat 2')
                    return
                } else if (((18 * 60) <= now && now < (18 * 60) + 15) || ((19 * 60) + 20 <= now && now < (20 * 60)) || ((21 * 60) + 50 <= now && now < (22 * 60))) {
                    console.log('istirahat 3')
                    return
                } else {
                    console.log('sql launched')
                    conLocal.query('update tb_produksi set target = target + 1 where id = ?', [id], (err, rut) => { })
                }
            })
        }
        // function lostTime(id) {
        //     shift = updateShift
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
        global[`interval ${socket.id}`] = setInterval(async function () {
            let [result12, fields] = await conLocalP.execute("select * from tb_produksi join tb_line on tb_produksi.line = tb_line.nama_line and tb_produksi.nama_part = tb_line.nama_part where tb_produksi.id = ?", [id])
            if (result12.length === 0) {
                console.log('LHP not found!')
                clearInterval(global[`interval ${socket.id}`])
                global[`interval ${socket.id}`] = null
            } else {
                shift = updateShift()
                conLocal.query('select disconnected as dc from tb_produksi where id = ?', [id], (err, resdc) => {
                    if (resdc[0].dc == 1) {
                        socket.emit('lhp-disconnected', result12[0].TOTAL_PRODUKSI)
                    } else {
                        return
                    }
                })
                let [reshour, fields1] = await conLocalP.execute("select * from tb_produksi where id = ?", [id])
                let [stat, fields] = await conTicketP.execute("select status from tb_line where nama_line = ? and nama_part = ?", [reshour[0].LINE, reshour[0].NAMA_PART])
                let [reshour1, fields2] = await conLocalP.execute("SELECT (TIME_TO_SEC(`5R`) + TIME_TO_SEC(MP_PENGGANTI) + TIME_TO_SEC(CT_TIDAK_STANDART) + TIME_TO_SEC(MP_DIALIHKAN) + TIME_TO_SEC(DANDORY) + TIME_TO_SEC(PREVENTIVE_MAINT) + TIME_TO_SEC(PROD_PART_LAIN) + TIME_TO_SEC(`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(`PRODUKSI_1_M/P`) + TIME_TO_SEC(`PRODUKSI_2_M/C`) + TIME_TO_SEC(OVERLAP_LINE_LAIN) + TIME_TO_SEC(LAYOFF_MANPOWER) + TIME_TO_SEC(LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(LAYOFF_KOMP_SPM) + TIME_TO_SEC(LAYOFF_KOMP_CNC) + TIME_TO_SEC(PACKAGING_KOSONG) + TIME_TO_SEC(LAYOFF_STOCK_WAITING)) AS totalplan,  (TIME_TO_SEC(gagal_vacum) + TIME_TO_SEC(gagal_ambil) + TIME_TO_SEC(instocker) + TIME_TO_SEC(outstocker) + TIME_TO_SEC(feeder) + TIME_TO_SEC(flipper) + TIME_TO_SEC(robot)) AS totalauto, (TIME_TO_SEC(MC_TROUBLE) + TIME_TO_SEC(MC_ASSY_TROUBLE) + TIME_TO_SEC(MC_SPM_DRILL) + TIME_TO_SEC(LT_TROUBLE) + TIME_TO_SEC(WASHING_TROUBLE) + TIME_TO_SEC(ANGIN_DROP) + TIME_TO_SEC(PENAMBAHAN_COOLANT) + TIME_TO_SEC(WARMING_UP) + TIME_TO_SEC(OTHERS_MC)) AS totalmesin, (TIME_TO_SEC(stock_waiting) + TIME_TO_SEC(PARTIAL) + TIME_TO_SEC(sortir) + TIME_TO_SEC(innerpart_kosong) + TIME_TO_SEC(repair_part) + TIME_TO_SEC(trimming_part) + TIME_TO_SEC(sto) + TIME_TO_SEC(others_material)) AS totalmat,  (TIME_TO_SEC(SETTING_PROGRAM) + TIME_TO_SEC(GANTI_TOOL) + TIME_TO_SEC(TRIAL_MACHINING) + TIME_TO_SEC(Q_TIME) + TIME_TO_SEC(JIG_FIXTURE) + TIME_TO_SEC(WAITING_CMM) + TIME_TO_SEC(UKUR_MANUAL) + TIME_TO_SEC(LT_IMPRAG) + TIME_TO_SEC(GANTI_THREEBOND) + TIME_TO_SEC(PERUBAHAN_PROSES) + TIME_TO_SEC(JOB_SET_UP) + TIME_TO_SEC(TRIAL_NON_MACH) + TIME_TO_SEC(OTHERS_PROSES)) AS totalpro, (TIME_TO_SEC(PERSIAPAN_PROD) + TIME_TO_SEC(LISTRIK_MATI) + TIME_TO_SEC(KURAS_WASHING) + TIME_TO_SEC(P5M) + TIME_TO_SEC(MP_SAKIT) + TIME_TO_SEC(OTHERS)) AS totaloth  FROM tb_dt_terplanning, tb_dt_auto, tb_dt_proses, tb_dt_material, tb_dt_mesin, tb_dt_others  WHERE tb_dt_terplanning.ID = ? AND tb_dt_auto.ID = ? AND tb_dt_mesin.ID = ? AND tb_dt_proses.ID = ? AND tb_dt_material.ID = ? AND tb_dt_others.ID = ?", [id, id, id, id, id, id])
                let totalDT = parseInt(reshour1[0].totalplan) + parseInt(reshour1[0].totalauto) + parseInt(reshour1[0].totalmesin) + parseInt(reshour1[0].totalmat) + parseInt(reshour1[0].totalpro) + parseInt(reshour1[0].totaloth)
                let ava = ((480 * 60) - totalDT) / (480 * 60)
                let per = (reshour[0].TOTAL_PRODUKSI) / ((480 * 60) / result12[0].CYCLE_TIME)
                let qua = (reshour[0].OK / reshour[0].TOTAL_PRODUKSI)
                let oee = ava * per * qua
                var date = new Date();
                var now = date.getHours()
                let resoee = await conLocalP.execute('update tb_produksi set ava = ?, per = ?, qua = ?, oee = ? where id = ?', [ava.toFixed(3), per.toFixed(3), qua.toFixed(3), oee.toFixed(3), id])
                let [resc, fields3] = await conLocalP.execute("select * from tb_data_hourly where tanggal = curdate() and shift = ? and jam = ? and nama_part = ? and line = ? and idlap = ?", [shift + "", now, namapart, line, id])
                if (shift != reshour[0].SHIFT) {
                    console.log(parseInt(reshour[0].SHIFT), shift)
                    clearInterval(global[`interval ${socket.id}`])
                    global[`interval ${socket.id}`] = null
                }
                else if (resc.length === 0) {
                    socket.emit(`update-total-${id}`, result12[0].TOTAL_PRODUKSI, result12[0].TARGET)
                    let [resch, fields4] = await conLocalP.execute("select sum(total_produksi) as total, sum(ok) as ok, sum(ng) as ng, sum(time_to_sec(dt_auto)) as totalauto,sum(time_to_sec(dt_material)) as totalmat, sum(time_to_sec(dt_mesin)) as totalmesin, sum(time_to_sec(dt_others)) as totalothers, sum(time_to_sec(dt_proses)) as totalproses, sum(time_to_sec(dt_terplanning)) as totalplan, sum(target) as target from tb_data_hourly where shift = ? and nama_part = ? and line = ? and tanggal = curdate() and idlap = ?", [shift, namapart, line, id])
                    lasttotal = resch[0].total
                    lastok = resch[0].ok
                    lastng = resch[0].ng
                    lasttotaln = reshour[0].TOTAL_PRODUKSI
                    lastokn = reshour[0].OK
                    lastngn = reshour[0].NG
                    let resinsert = await conLocalP.execute("insert into tb_data_hourly (TANGGAL, JAM, SHIFT, LINE, IDLAP, NAMA_PART, OK, NG, TOTAL_PRODUKSI, TARGET, DT_AUTO, DT_MATERIAL, DT_MESIN, DT_OTHERS, DT_PROSES, DT_TERPLANNING) values (curdate(), ?, ?, ?, ?, ?, ?, ?, ?, ?, sec_to_time(?), sec_to_time(?), sec_to_time(?), sec_to_time(?), sec_to_time(?), sec_to_time(?))", [now, shift + "", line, id, namapart, Math.max(lastokn - lastok, 0), Math.max(lastngn - lastng, 0), Math.max(lasttotaln - lasttotal, 0), Math.max(reshour[0].TARGET - resch[0].target, 0), Math.max(reshour1[0].totalauto - resch[0].totalauto, 0), Math.max(reshour1[0].totalmat - resch[0].totalmat, 0), Math.max(reshour1[0].totalmesin - resch[0].totalmesin, 0), Math.max(reshour1[0].totaloth - resch[0].totalothers, 0), Math.max(reshour1[0].totalpro - resch[0].totalproses, 0), Math.max(reshour1[0].totalplan - resch[0].totalplan, 0)])
                } else {
                    socket.emit(`update-total-${id}`, result12[0].TOTAL_PRODUKSI, result12[0].TARGET)
                    let [resch, fields4] = await conLocalP.execute("SELECT SUM(total_produksi) as total, SUM(ok) as ok, SUM(ng) as ng, sum(time_to_sec(dt_auto)) as totalauto,sum(time_to_sec(dt_material)) as totalmat, sum(time_to_sec(dt_mesin)) as totalmesin, sum(time_to_sec(dt_others)) as totalothers, sum(time_to_sec(dt_proses)) as totalproses, sum(time_to_sec(dt_terplanning)) as totalplan, sum(target) as target FROM tb_data_hourly WHERE shift = ? and nama_part = ? and line = ? AND tanggal = CURDATE() AND idlap = ? and id != (SELECT max(id) FROM tb_data_hourly WHERE shift = ? and nama_part = ? and line = ? and tanggal = CURDATE() and idlap = ?)", [shift, namapart, line, id, shift, namapart, line, id])
                    lasttotal = resch[0].total
                    lastok = resch[0].ok
                    lastng = resch[0].ng
                    let resinsert = await conLocalP.execute("update tb_data_hourly set total_produksi = ?, ok = ?, ng = ?, target = ?, dt_auto = sec_to_time(?), dt_material = sec_to_time(?), dt_mesin = sec_to_time(?), dt_others = sec_to_time(?), dt_proses = sec_to_time(?), dt_terplanning = sec_to_time(?) where tanggal = curdate() and shift = ? and jam = ? and nama_part = ? and line = ? and idlap = ?", [Math.max(reshour[0].TOTAL_PRODUKSI - lasttotal, 0), Math.max(reshour[0].OK - lastok, 0), Math.max(reshour[0].NG - lastng, 0), Math.max(reshour[0].TARGET - resch[0].target, 0), Math.max(reshour1[0].totalauto - resch[0].totalauto, 0), Math.max(reshour1[0].totalmat - resch[0].totalmat, 0), Math.max(reshour1[0].totalmesin - resch[0].totalmesin, 0), Math.max(reshour1[0].totaloth - resch[0].totalothers, 0), Math.max(reshour1[0].totalpro - resch[0].totalproses, 0), Math.max(reshour1[0].totalplan - resch[0].totalplan, 0), shift + "", now, namapart, line, id])
                }
                if (!global[`trgt-${line}-${namapart}-${id}`] && stat[0].status == 'normal') {
                    console.log('target done')
                    global[`trgt-${line}-${namapart}-${id}`] = setInterval(() => { target(id) }, result12[0].CYCLE_TIME * 1000)
                }
                // if (!global[`lt-${line}-${namapart}-${id}`]) {
                //     global[`lt-${line}-${namapart}-${id}`] = setInterval(() => {lostTime(id)}, 1000)
                // }
            }
        }, 1000)


        global[`resume ${socket.id}`] = setInterval(function () {
            shift = updateShift()
            for (let i = 1; i <= 3; i++) {
                conLocal.query('SELECT plan.id, sum(prod.TOTAL_PRODUKSI) AS totalprod, sum(prod.OK) AS ok, sum(prod.NG) AS ng, sum(TIME_TO_SEC(plan.`5R`) + TIME_TO_SEC(plan.MP_PENGGANTI) + TIME_TO_SEC(plan.CT_TIDAK_STANDART) + TIME_TO_SEC(plan.MP_DIALIHKAN) + TIME_TO_SEC(plan.DANDORY) + TIME_TO_SEC(plan.PREVENTIVE_MAINT) + TIME_TO_SEC(plan.PROD_PART_LAIN) + TIME_TO_SEC(plan.`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(plan.`PRODUKSI_1_M/P`) + TIME_TO_SEC(plan.`PRODUKSI_2_M/C`) + TIME_TO_SEC(plan.OVERLAP_LINE_LAIN) + TIME_TO_SEC(plan.LAYOFF_MANPOWER) + TIME_TO_SEC(plan.LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(plan.LAYOFF_KOMP_SPM) + TIME_TO_SEC(plan.LAYOFF_KOMP_CNC) + TIME_TO_SEC(plan.PACKAGING_KOSONG) + TIME_TO_SEC(plan.LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(auto.gagal_vacum) + TIME_TO_SEC(auto.gagal_ambil) + TIME_TO_SEC(auto.instocker) + TIME_TO_SEC(auto.outstocker) + TIME_TO_SEC(auto.feeder) + TIME_TO_SEC(auto.flipper) + TIME_TO_SEC(auto.robot)) AS totalauto, sum(TIME_TO_SEC(mach.MC_TROUBLE) + TIME_TO_SEC(mach.MC_ASSY_TROUBLE) + TIME_TO_SEC(mach.MC_SPM_DRILL) + TIME_TO_SEC(mach.LT_TROUBLE) + TIME_TO_SEC(mach.WASHING_TROUBLE) + TIME_TO_SEC(mach.ANGIN_DROP) + TIME_TO_SEC(mach.PENAMBAHAN_COOLANT) + TIME_TO_SEC(mach.WARMING_UP) + TIME_TO_SEC(mach.OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(mat.stock_waiting) + TIME_TO_SEC(mat.PARTIAL) + TIME_TO_SEC(mat.sortir) + TIME_TO_SEC(mat.innerpart_kosong) + TIME_TO_SEC(mat.repair_part) + TIME_TO_SEC(mat.trimming_part) + TIME_TO_SEC(mat.sto) + TIME_TO_SEC(mat.others_material)) AS totalmat, sum(TIME_TO_SEC(pro.SETTING_PROGRAM) + TIME_TO_SEC(pro.GANTI_TOOL) + TIME_TO_SEC(pro.TRIAL_MACHINING) + TIME_TO_SEC(pro.Q_TIME) + TIME_TO_SEC(pro.JIG_FIXTURE) + TIME_TO_SEC(pro.WAITING_CMM) + TIME_TO_SEC(pro.UKUR_MANUAL) + TIME_TO_SEC(pro.LT_IMPRAG) + TIME_TO_SEC(pro.GANTI_THREEBOND) + TIME_TO_SEC(pro.PERUBAHAN_PROSES) + TIME_TO_SEC(pro.JOB_SET_UP) + TIME_TO_SEC(pro.TRIAL_NON_MACH) + TIME_TO_SEC(pro.OTHERS_PROSES)) AS totalpro, sum(TIME_TO_SEC(oth.PERSIAPAN_PROD) + TIME_TO_SEC(oth.LISTRIK_MATI) + TIME_TO_SEC(oth.KURAS_WASHING) + TIME_TO_SEC(oth.P5M) + TIME_TO_SEC(oth.MP_SAKIT) + TIME_TO_SEC(oth.OTHERS)) AS totaloth FROM tb_dt_terplanning AS plan join tb_dt_auto AS auto ON auto.id = plan.id join tb_dt_proses AS pro ON pro.id = auto.id join tb_dt_material AS mat ON mat.id = pro.id join tb_dt_mesin AS mach ON mach.id = mat.id join tb_dt_others AS oth ON oth.id = mach.id JOIN tb_produksi AS prod ON prod.id = oth.id WHERE plan.NAMA_PART = ? AND plan.LINE = ? AND plan.tanggal = CURDATE() AND plan.SHIFT = ?;', [namapart, line, i], (err, rint) => {
                    if (!rint[0].totalprod) {
                        return
                    } else {
                        socket.emit(`update-resume-${id}`, i, rint[0].totalprod, rint[0].ok, rint[0].ng, rint[0].totalplan, rint[0].totalauto, rint[0].totalmesin, rint[0].totalmat, rint[0].totalpro, rint[0].totaloth)
                    }
                })
            }
            conLocal.query("select * from tb_data_hourly where nama_part = ? and line = ? and tanggal = curdate()", [namapart, line], (err, resl) => {
                if (resl.length === 0) {
                    console.log('jam kosong')
                } else {
                    for (let i = 0; i < resl.length; i++) {
                        socket.emit(`update-hourly-${id}`, resl[i].JAM, resl[i].TOTAL_PRODUKSI, Math.max(resl[i].OK, 0), resl[i].NG, resl[i].SHIFT)
                    }
                }
            })
        }, 2000)
    })
}

exports.disconnect = (socket) => {
    socket.on('disconnect', () => {
        clearInterval(global[`interval ${socket.id}`])
        clearInterval(global[`resume ${socket.id}`])
    })
}

exports.updateDcLHP = (socket) => {
    socket.on('update-disconnected-lhp', (val, id) => {
        conLocal.query('update tb_produksi set total_produksi = ?, ok = ? - ng where id = ?', [val, val, id], (err, resinsert) => {
            if (err) throw err
        })
    })
}