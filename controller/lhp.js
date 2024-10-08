const db = require('../config/db')
const updateshift = require('../config/shift')
const conLocal = db.conLocal;
const conLocalP = db.conLocalP;
const conLoginP = db.conLoginP;
let shift;

exports.mainPage = async (req, res) => {
    var part = req.params.part
    var namapart = part.replace("+", "/")
    var idlaporan = req.params.nomorlhp
    var line = req.params.line
    shift = updateshift()
    let [result1, fields] = await conLocalP.execute("select * from tb_produksi where id = ? and nama_part = ? and line = ? and tanggal = curdate()", [req.params.nomorlhp, namapart, line])
    if (result1.length == 0) {
        res.redirect('/')
    } else {
        if (shift != parseInt(result1[0].SHIFT)) {
            res.redirect('/')
        } else {
            const ressql = async () => {
                try {
                    let [resname, fields4] = await conLoginP.execute('select nama from karyawan where nrp = ?', [result1[0].NRP1]);
                    let [result2, fields1] = await conLocalP.execute("select * from tb_rejection where id = ?", [idlaporan]);
                    let [result3, fields2] = await conLocalP.execute("SELECT (TIME_TO_SEC(`5R`) + TIME_TO_SEC(MP_PENGGANTI) + TIME_TO_SEC(CT_TIDAK_STANDART) + TIME_TO_SEC(MP_DIALIHKAN) + TIME_TO_SEC(DANDORY) + TIME_TO_SEC(PREVENTIVE_MAINT) + TIME_TO_SEC(PROD_PART_LAIN) + TIME_TO_SEC(`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(`PRODUKSI_1_M/P`) + TIME_TO_SEC(`PRODUKSI_2_M/C`) + TIME_TO_SEC(OVERLAP_LINE_LAIN) + TIME_TO_SEC(LAYOFF_MANPOWER) + TIME_TO_SEC(LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(LAYOFF_KOMP_SPM) + TIME_TO_SEC(LAYOFF_KOMP_CNC) + TIME_TO_SEC(PACKAGING_KOSONG) + TIME_TO_SEC(LAYOFF_STOCK_WAITING)) AS totalplan, (TIME_TO_SEC(gagal_vacum) + TIME_TO_SEC(gagal_ambil) + TIME_TO_SEC(instocker) + TIME_TO_SEC(outstocker) + TIME_TO_SEC(feeder) + TIME_TO_SEC(flipper) + TIME_TO_SEC(robot)) AS totalauto,(TIME_TO_SEC(MC_TROUBLE) + TIME_TO_SEC(MC_ASSY_TROUBLE) + TIME_TO_SEC(MC_SPM_DRILL) + TIME_TO_SEC(LT_TROUBLE) + TIME_TO_SEC(WASHING_TROUBLE) + TIME_TO_SEC(ANGIN_DROP) + TIME_TO_SEC(PENAMBAHAN_COOLANT) + TIME_TO_SEC(WARMING_UP) + TIME_TO_SEC(OTHERS_MC)) AS totalmesin,(TIME_TO_SEC(stock_waiting) + TIME_TO_SEC(PARTIAL) + TIME_TO_SEC(sortir) + TIME_TO_SEC(innerpart_kosong) + TIME_TO_SEC(repair_part) + TIME_TO_SEC(trimming_part) + TIME_TO_SEC(sto) + TIME_TO_SEC(others_material)) AS totalmat,(TIME_TO_SEC(SETTING_PROGRAM) + TIME_TO_SEC(GANTI_TOOL) + TIME_TO_SEC(TRIAL_MACHINING) + TIME_TO_SEC(Q_TIME) + TIME_TO_SEC(JIG_FIXTURE) + TIME_TO_SEC(WAITING_CMM) + TIME_TO_SEC(UKUR_MANUAL) + TIME_TO_SEC(LT_IMPRAG) + TIME_TO_SEC(GANTI_THREEBOND) + TIME_TO_SEC(PERUBAHAN_PROSES) + TIME_TO_SEC(JOB_SET_UP) + TIME_TO_SEC(TRIAL_NON_MACH) + TIME_TO_SEC(OTHERS_PROSES)) AS totalpro,(TIME_TO_SEC(PERSIAPAN_PROD) + TIME_TO_SEC(LISTRIK_MATI) + TIME_TO_SEC(KURAS_WASHING) + TIME_TO_SEC(P5M) + TIME_TO_SEC(MP_SAKIT) + TIME_TO_SEC(OTHERS)) AS totaloth FROM tb_dt_terplanning, tb_dt_auto, tb_dt_proses, tb_dt_material, tb_dt_mesin, tb_dt_others WHERE tb_dt_terplanning.ID = ? AND tb_dt_auto.ID = ? AND tb_dt_mesin.ID = ? AND tb_dt_proses.ID = ? AND tb_dt_material.ID = ? AND tb_dt_others.ID = ?;", [idlaporan, idlaporan, idlaporan, idlaporan, idlaporan, idlaporan]);
                    let [resng, fields3] = await conLocalP.execute("SELECT (dimensi + blong + seret + dent + uncutting + step + kasar +NG_ASSY+RIVET+BIMETAL+JOINT_TUBE+PLATE+NO_JIG+OTHERS_P+KEROPOS+BOCOR+FLOWLINE+RETAK+GOMPAL+OVER_PROSES+KURANG_PROSES+JAMUR+UNDERCUT+DEKOK+TRIAL+UNCUT_MATERIAL+OTHERS_MATERIAL) AS ng FROM tb_rejection WHERE tanggal = CURDATE() and nama_part = ? AND line = ? and id = ?", [namapart, line, req.params.nomorlhp])
                    return { result2, result3, resng, resname }
                } catch (error) {
                    throw error
                }
            }
            let hasil = await ressql()
            data = {
                totalp: result1[0].TOTAL_PRODUKSI,
                result2: hasil.result2,
                resulttotal: hasil.result3,
                totalok: result1[0].OK,
                ng: hasil.resng[0].ng,
                que: '',
                namapart,
                part,
                nama1: hasil.resname[0].nama,
                dtclick: global[`dtclick-${idlaporan}`] || false,
                nrp1: result1[0].NRP1,
                idprod: idlaporan,
                undoTracker: global[`undoTracker-${req.params.nomorlhp}`],
                line,
                target: result1[0].TARGET,
                connStatus: result1[0].DISCONNECTED
            }
            res.render('rejection', data)
        }
    }
}

exports.DTPage = async (req, res) => {
    var part = req.params.part
    var namapart = part.replace("+", "/")
    var lhpid = req.params.nomorlhp
    var line = req.params.line
    conLocal.query("select * from tb_produksi where id = ? and nama_part = ? and tanggal = curdate()", [lhpid, namapart], async (err, result1) => {
        if (err) { throw err }
        else if (result1.length == 0) {
            res.redirect('/')
        } else {
            shift = updateshift()
            if (shift != parseInt(result1[0].SHIFT)) {
                res.redirect('/')
            } else {
                let ressql = async () => {
                    try {
                        let [resauto, fields] = await conLocalP.execute("SELECT TIME_TO_SEC(gagal_vacum) AS gagal_vacum, TIME_TO_SEC(gagal_ambil) AS gagal_ambil, TIME_TO_SEC(instocker) AS instocker, TIME_TO_SEC(outstocker) AS outstocker,TIME_TO_SEC(feeder) AS feeder, TIME_TO_SEC(flipper) AS flipper, TIME_TO_SEC(robot) AS robot FROM tb_dt_auto where id = ?", [lhpid]);
                        let [resmat, fields1] = await conLocalP.execute("SELECT TIME_TO_SEC(stock_waiting) AS stock_waiting, TIME_TO_SEC(partial) AS partial, TIME_TO_SEC(sortir) AS sortir, TIME_TO_SEC(innerpart_kosong) AS innerpart_kosong,TIME_TO_SEC(repair_part) AS repair_part, TIME_TO_SEC(trimming_part) AS trimming_part, TIME_TO_SEC(sto) AS sto, TIME_TO_SEC(others_material) AS others_material FROM tb_dt_material WHERE id = ?;", [lhpid])
                        let [resmach, fields2] = await conLocalP.execute("SELECT TIME_TO_SEC(MC_TROUBLE) AS mc_trouble, TIME_TO_SEC(MC_ASSY_TROUBLE) AS mc_assy_trouble, TIME_TO_SEC(MC_SPM_DRILL) AS mc_spm_drill, TIME_TO_SEC(LT_TROUBLE) AS lt_trouble,TIME_TO_SEC(WASHING_TROUBLE) AS washing_trouble, TIME_TO_SEC(ANGIN_DROP) AS angin_drop, TIME_TO_SEC(PENAMBAHAN_COOLANT) AS penambahan_coolant, TIME_TO_SEC(WARMING_UP) AS warming_up, TIME_TO_SEC(OTHERS_MC) AS others_mc FROM tb_dt_mesin WHERE id = ?;", [lhpid])
                        let [resoth, fields3] = await conLocalP.execute("SELECT TIME_TO_SEC(PERSIAPAN_PROD) AS persiapan_prod, TIME_TO_SEC(LISTRIK_MATI) AS listrik_mati, TIME_TO_SEC(KURAS_WASHING) AS kuras_washing, TIME_TO_SEC(P5M) AS p5m,TIME_TO_SEC(MP_SAKIT) AS mp_sakit, TIME_TO_SEC(OTHERS) AS others FROM tb_dt_others WHERE id = ?;", [lhpid])
                        let [respro, fields4] = await conLocalP.execute("SELECT TIME_TO_SEC(SETTING_PROGRAM) AS setting_program, TIME_TO_SEC(GANTI_TOOL) AS ganti_tool, TIME_TO_SEC(TRIAL_MACHINING) AS trial_machining, TIME_TO_SEC(Q_TIME) AS q_time,TIME_TO_SEC(JIG_FIXTURE) AS jig_fixture, TIME_TO_SEC(WAITING_CMM) AS waiting_cmm, TIME_TO_SEC(UKUR_MANUAL) AS ukur_manual, TIME_TO_SEC(LT_IMPRAG) AS lt_imprag, TIME_TO_SEC(GANTI_THREEBOND) AS ganti_treebond, TIME_TO_SEC(PERUBAHAN_PROSES) AS perubahan_proses, TIME_TO_SEC(JOB_SET_UP) AS job_setup, TIME_TO_SEC(TRIAL_NON_MACH) AS trial_non_mach, TIME_TO_SEC(OTHERS_PROSES) AS others_proses FROM tb_dt_proses WHERE id = ?;", [lhpid])
                        let [resplan, fields5] = await conLocalP.execute("SELECT TIME_TO_SEC(5R) AS 5r, TIME_TO_SEC(MP_PENGGANTI) AS mp_pengganti, TIME_TO_SEC(CT_TIDAK_STANDART) AS ct_tidak_standart, TIME_TO_SEC(MP_DIALIHKAN) AS mp_dialihkan, TIME_TO_SEC(DANDORY) AS dandori, TIME_TO_SEC(PREVENTIVE_MAINT) AS preventive_maint, TIME_TO_SEC(PROD_PART_LAIN) AS prod_part_lain, TIME_TO_SEC(`PRODUKSI_2/3_JIG`) AS 'produksi_2/3_jig', TIME_TO_SEC(`PRODUKSI_1_M/P`) AS 'produksi_1_m/p', TIME_TO_SEC(`PRODUKSI_2_M/C`) AS 'produksi_2_m/c', TIME_TO_SEC(OVERLAP_LINE_LAIN) AS overlap_line_lain, TIME_TO_SEC(LAYOFF_MANPOWER) AS layoff_manpower, TIME_TO_SEC(LAYOFF_TOOL_KOSONG) AS layoff_tool_kosong, TIME_TO_SEC(LAYOFF_KOMP_SPM) AS layoff_komp_spm, TIME_TO_SEC(LAYOFF_KOMP_CNC) AS layoff_komp_cnc, TIME_TO_SEC(PACKAGING_KOSONG) AS packaging_kosong, TIME_TO_SEC(LAYOFF_STOCK_WAITING) AS layoff_stock_waiting FROM tb_dt_terplanning WHERE id = ?;", [lhpid])
                        let [restotal, fields6] = await conLocalP.execute("SELECT (TIME_TO_SEC(`5R`) + TIME_TO_SEC(MP_PENGGANTI) + TIME_TO_SEC(CT_TIDAK_STANDART) + TIME_TO_SEC(MP_DIALIHKAN) + TIME_TO_SEC(DANDORY) + TIME_TO_SEC(PREVENTIVE_MAINT) + TIME_TO_SEC(PROD_PART_LAIN) + TIME_TO_SEC(`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(`PRODUKSI_1_M/P`) + TIME_TO_SEC(`PRODUKSI_2_M/C`) + TIME_TO_SEC(OVERLAP_LINE_LAIN) + TIME_TO_SEC(LAYOFF_MANPOWER) + TIME_TO_SEC(LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(LAYOFF_KOMP_SPM) + TIME_TO_SEC(LAYOFF_KOMP_CNC) + TIME_TO_SEC(PACKAGING_KOSONG) + TIME_TO_SEC(LAYOFF_STOCK_WAITING)) AS totalplan, (TIME_TO_SEC(gagal_vacum) + TIME_TO_SEC(gagal_ambil) + TIME_TO_SEC(instocker) + TIME_TO_SEC(outstocker) + TIME_TO_SEC(feeder) + TIME_TO_SEC(flipper) + TIME_TO_SEC(robot)) AS totalauto,(TIME_TO_SEC(MC_TROUBLE) + TIME_TO_SEC(MC_ASSY_TROUBLE) + TIME_TO_SEC(MC_SPM_DRILL) + TIME_TO_SEC(LT_TROUBLE) + TIME_TO_SEC(WASHING_TROUBLE) + TIME_TO_SEC(ANGIN_DROP) + TIME_TO_SEC(PENAMBAHAN_COOLANT) + TIME_TO_SEC(WARMING_UP) + TIME_TO_SEC(OTHERS_MC)) AS totalmesin,(TIME_TO_SEC(stock_waiting) + TIME_TO_SEC(PARTIAL) + TIME_TO_SEC(sortir) + TIME_TO_SEC(innerpart_kosong) + TIME_TO_SEC(repair_part) + TIME_TO_SEC(trimming_part) + TIME_TO_SEC(sto) + TIME_TO_SEC(others_material)) AS totalmat,(TIME_TO_SEC(SETTING_PROGRAM) + TIME_TO_SEC(GANTI_TOOL) + TIME_TO_SEC(TRIAL_MACHINING) + TIME_TO_SEC(Q_TIME) + TIME_TO_SEC(JIG_FIXTURE) + TIME_TO_SEC(WAITING_CMM) + TIME_TO_SEC(UKUR_MANUAL) + TIME_TO_SEC(LT_IMPRAG) + TIME_TO_SEC(GANTI_THREEBOND) + TIME_TO_SEC(PERUBAHAN_PROSES) + TIME_TO_SEC(JOB_SET_UP) + TIME_TO_SEC(TRIAL_NON_MACH) + TIME_TO_SEC(OTHERS_PROSES)) AS totalpro,(TIME_TO_SEC(PERSIAPAN_PROD) + TIME_TO_SEC(LISTRIK_MATI) + TIME_TO_SEC(KURAS_WASHING) + TIME_TO_SEC(P5M) + TIME_TO_SEC(MP_SAKIT) + TIME_TO_SEC(OTHERS)) AS totaloth FROM tb_dt_terplanning, tb_dt_auto, tb_dt_proses, tb_dt_material, tb_dt_mesin, tb_dt_others WHERE tb_dt_terplanning.ID = ? AND tb_dt_auto.ID = ? AND tb_dt_mesin.ID = ? AND tb_dt_proses.ID = ? AND tb_dt_material.ID = ? AND tb_dt_others.ID = ?;", [lhpid, lhpid, lhpid, lhpid, lhpid, lhpid])
                        let [resng, fields7] = await conLocalP.execute("SELECT (dimensi + blong + seret + dent + uncutting + step + kasar +NG_ASSY+RIVET+BIMETAL+JOINT_TUBE+PLATE+NO_JIG+OTHERS_P+KEROPOS+BOCOR+FLOWLINE+RETAK+GOMPAL+OVER_PROSES+KURANG_PROSES+JAMUR+UNDERCUT+DEKOK+TRIAL+UNCUT_MATERIAL+OTHERS_MATERIAL) AS ng FROM tb_rejection WHERE tanggal = CURDATE() and nama_part = ? AND line = ? AND shift = ? and id = ?", [namapart, line, shift, req.params.nomorlhp])
                        let [resct, fields8] = await conLocalP.execute("SELECT tb_line.cycle_time, target FROM tb_produksi JOIN tb_line ON tb_produksi.LINE = tb_line.NAMA_LINE AND tb_produksi.NAMA_PART = tb_line.NAMA_PART WHERE tb_produksi.ID = ?", [lhpid])
                        let [resname, fields9] = await conLoginP.execute('select nama from karyawan where nrp = ?', [result1[0].NRP1]);
                        return { resauto, resmach, resmat, resname, resng, resoth, resplan, respro, restotal, resct, resname }
                    } catch (error) {
                        throw error
                    }
                }
                let hasil = await ressql()
                data = {
                    totalp: result1[0].TOTAL_PRODUKSI,
                    totalok: result1[0].OK,
                    ng: hasil.resng[0].ng,
                    resultauto: hasil.resauto,
                    resultmac: hasil.resmach,
                    resultmat: hasil.resmat,
                    resultoth: hasil.resoth,
                    resultplan: hasil.resplan,
                    resultpro: hasil.respro,
                    resulttotal: hasil.restotal,
                    dtcheck: '',
                    namapart,
                    part,
                    nama1: hasil.resname[0].nama,
                    nrp1: result1[0].NRP1,
                    idprod: lhpid,
                    line,
                    cycletime: hasil.resct[0].cycle_time,
                    target: hasil.resct[0].target,
                    connStatus: result1[0].DISCONNECTED
                }
                res.render('downtime', data)
            }
        }
    })
}

exports.resumePage = (req, res) => {
    var part = req.params.part
    var namapart = part.replace("+", "/")
    var idlaporan = req.params.nomorlhp
    var line = req.params.line
    conLocal.query("select * from tb_produksi join tb_line on tb_produksi.nama_part = tb_line.nama_part and tb_produksi.line = tb_line.nama_line where tb_produksi.id = ? and tb_produksi.nama_part = ? and tb_produksi.tanggal = curdate()", [req.params.nomorlhp, namapart], async (err, result1) => {
        if (err) { throw err }
        else if (result1.length == 0) {
            res.redirect('/')
        } else {
            shift = updateshift()
            if (shift != parseInt(result1[0].SHIFT)) {
                res.redirect('/')
            } else {
                const ressql = async () => {
                    try {
                        let [resname, fields] = await conLoginP.execute('select nama from karyawan where nrp = ?', [result1[0].NRP1]);
                        let [r1, fields1] = await conLocalP.execute("SELECT plan.id, sum(prod.TOTAL_PRODUKSI) AS totalprod, sum(prod.OK) AS ok, sum(prod.NG) AS ng, sum(TIME_TO_SEC(plan.`5R`) + TIME_TO_SEC(plan.MP_PENGGANTI) + TIME_TO_SEC(plan.CT_TIDAK_STANDART) + TIME_TO_SEC(plan.MP_DIALIHKAN) + TIME_TO_SEC(plan.DANDORY) + TIME_TO_SEC(plan.PREVENTIVE_MAINT) + TIME_TO_SEC(plan.PROD_PART_LAIN) + TIME_TO_SEC(plan.`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(plan.`PRODUKSI_1_M/P`) + TIME_TO_SEC(plan.`PRODUKSI_2_M/C`) + TIME_TO_SEC(plan.OVERLAP_LINE_LAIN) + TIME_TO_SEC(plan.LAYOFF_MANPOWER) + TIME_TO_SEC(plan.LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(plan.LAYOFF_KOMP_SPM) + TIME_TO_SEC(plan.LAYOFF_KOMP_CNC) + TIME_TO_SEC(plan.PACKAGING_KOSONG) + TIME_TO_SEC(plan.LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(auto.gagal_vacum) + TIME_TO_SEC(auto.gagal_ambil) + TIME_TO_SEC(auto.instocker) + TIME_TO_SEC(auto.outstocker) + TIME_TO_SEC(auto.feeder) + TIME_TO_SEC(auto.flipper) + TIME_TO_SEC(auto.robot)) AS totalauto, sum(TIME_TO_SEC(mach.MC_TROUBLE) + TIME_TO_SEC(mach.MC_ASSY_TROUBLE) + TIME_TO_SEC(mach.MC_SPM_DRILL) + TIME_TO_SEC(mach.LT_TROUBLE) + TIME_TO_SEC(mach.WASHING_TROUBLE) + TIME_TO_SEC(mach.ANGIN_DROP) + TIME_TO_SEC(mach.PENAMBAHAN_COOLANT) + TIME_TO_SEC(mach.WARMING_UP) + TIME_TO_SEC(mach.OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(mat.stock_waiting) + TIME_TO_SEC(mat.PARTIAL) + TIME_TO_SEC(mat.sortir) + TIME_TO_SEC(mat.innerpart_kosong) + TIME_TO_SEC(mat.repair_part) + TIME_TO_SEC(mat.trimming_part) + TIME_TO_SEC(mat.sto) + TIME_TO_SEC(mat.others_material)) AS totalmat, sum(TIME_TO_SEC(pro.SETTING_PROGRAM) + TIME_TO_SEC(pro.GANTI_TOOL) + TIME_TO_SEC(pro.TRIAL_MACHINING) + TIME_TO_SEC(pro.Q_TIME) + TIME_TO_SEC(pro.JIG_FIXTURE) + TIME_TO_SEC(pro.WAITING_CMM) + TIME_TO_SEC(pro.UKUR_MANUAL) + TIME_TO_SEC(pro.LT_IMPRAG) + TIME_TO_SEC(pro.GANTI_THREEBOND) + TIME_TO_SEC(pro.PERUBAHAN_PROSES) + TIME_TO_SEC(pro.JOB_SET_UP) + TIME_TO_SEC(pro.TRIAL_NON_MACH) + TIME_TO_SEC(pro.OTHERS_PROSES)) AS totalpro, sum(TIME_TO_SEC(oth.PERSIAPAN_PROD) + TIME_TO_SEC(oth.LISTRIK_MATI) + TIME_TO_SEC(oth.KURAS_WASHING) + TIME_TO_SEC(oth.P5M) + TIME_TO_SEC(oth.MP_SAKIT) + TIME_TO_SEC(oth.OTHERS)) AS totaloth FROM tb_dt_terplanning AS plan join tb_dt_auto AS auto ON auto.id = plan.id join tb_dt_proses AS pro ON pro.id = auto.id join tb_dt_material AS mat ON mat.id = pro.id join tb_dt_mesin AS mach ON mach.id = mat.id join tb_dt_others AS oth ON oth.id = mach.id JOIN tb_produksi AS prod ON prod.id = oth.id WHERE plan.NAMA_PART = ? AND plan.LINE = ? AND plan.tanggal = CURDATE() AND plan.SHIFT = 1;", [namapart, line])
                        let [r2, fields2] = await conLocalP.execute("SELECT plan.id, sum(prod.TOTAL_PRODUKSI) AS totalprod, sum(prod.OK) AS ok, sum(prod.NG) AS ng, sum(TIME_TO_SEC(plan.`5R`) + TIME_TO_SEC(plan.MP_PENGGANTI) + TIME_TO_SEC(plan.CT_TIDAK_STANDART) + TIME_TO_SEC(plan.MP_DIALIHKAN) + TIME_TO_SEC(plan.DANDORY) + TIME_TO_SEC(plan.PREVENTIVE_MAINT) + TIME_TO_SEC(plan.PROD_PART_LAIN) + TIME_TO_SEC(plan.`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(plan.`PRODUKSI_1_M/P`) + TIME_TO_SEC(plan.`PRODUKSI_2_M/C`) + TIME_TO_SEC(plan.OVERLAP_LINE_LAIN) + TIME_TO_SEC(plan.LAYOFF_MANPOWER) + TIME_TO_SEC(plan.LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(plan.LAYOFF_KOMP_SPM) + TIME_TO_SEC(plan.LAYOFF_KOMP_CNC) + TIME_TO_SEC(plan.PACKAGING_KOSONG) + TIME_TO_SEC(plan.LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(auto.gagal_vacum) + TIME_TO_SEC(auto.gagal_ambil) + TIME_TO_SEC(auto.instocker) + TIME_TO_SEC(auto.outstocker) + TIME_TO_SEC(auto.feeder) + TIME_TO_SEC(auto.flipper) + TIME_TO_SEC(auto.robot)) AS totalauto, sum(TIME_TO_SEC(mach.MC_TROUBLE) + TIME_TO_SEC(mach.MC_ASSY_TROUBLE) + TIME_TO_SEC(mach.MC_SPM_DRILL) + TIME_TO_SEC(mach.LT_TROUBLE) + TIME_TO_SEC(mach.WASHING_TROUBLE) + TIME_TO_SEC(mach.ANGIN_DROP) + TIME_TO_SEC(mach.PENAMBAHAN_COOLANT) + TIME_TO_SEC(mach.WARMING_UP) + TIME_TO_SEC(mach.OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(mat.stock_waiting) + TIME_TO_SEC(mat.PARTIAL) + TIME_TO_SEC(mat.sortir) + TIME_TO_SEC(mat.innerpart_kosong) + TIME_TO_SEC(mat.repair_part) + TIME_TO_SEC(mat.trimming_part) + TIME_TO_SEC(mat.sto) + TIME_TO_SEC(mat.others_material)) AS totalmat, sum(TIME_TO_SEC(pro.SETTING_PROGRAM) + TIME_TO_SEC(pro.GANTI_TOOL) + TIME_TO_SEC(pro.TRIAL_MACHINING) + TIME_TO_SEC(pro.Q_TIME) + TIME_TO_SEC(pro.JIG_FIXTURE) + TIME_TO_SEC(pro.WAITING_CMM) + TIME_TO_SEC(pro.UKUR_MANUAL) + TIME_TO_SEC(pro.LT_IMPRAG) + TIME_TO_SEC(pro.GANTI_THREEBOND) + TIME_TO_SEC(pro.PERUBAHAN_PROSES) + TIME_TO_SEC(pro.JOB_SET_UP) + TIME_TO_SEC(pro.TRIAL_NON_MACH) + TIME_TO_SEC(pro.OTHERS_PROSES)) AS totalpro, sum(TIME_TO_SEC(oth.PERSIAPAN_PROD) + TIME_TO_SEC(oth.LISTRIK_MATI) + TIME_TO_SEC(oth.KURAS_WASHING) + TIME_TO_SEC(oth.P5M) + TIME_TO_SEC(oth.MP_SAKIT) + TIME_TO_SEC(oth.OTHERS)) AS totaloth FROM tb_dt_terplanning AS plan join tb_dt_auto AS auto ON auto.id = plan.id join tb_dt_proses AS pro ON pro.id = auto.id join tb_dt_material AS mat ON mat.id = pro.id join tb_dt_mesin AS mach ON mach.id = mat.id join tb_dt_others AS oth ON oth.id = mach.id JOIN tb_produksi AS prod ON prod.id = oth.id WHERE plan.NAMA_PART = ? AND plan.LINE = ? AND plan.tanggal = CURDATE() AND plan.SHIFT = 2;", [namapart, line])
                        let [r3, fields3] = await conLocalP.execute("SELECT plan.id, sum(prod.TOTAL_PRODUKSI) AS totalprod, sum(prod.OK) AS ok, sum(prod.NG) AS ng, sum(TIME_TO_SEC(plan.`5R`) + TIME_TO_SEC(plan.MP_PENGGANTI) + TIME_TO_SEC(plan.CT_TIDAK_STANDART) + TIME_TO_SEC(plan.MP_DIALIHKAN) + TIME_TO_SEC(plan.DANDORY) + TIME_TO_SEC(plan.PREVENTIVE_MAINT) + TIME_TO_SEC(plan.PROD_PART_LAIN) + TIME_TO_SEC(plan.`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(plan.`PRODUKSI_1_M/P`) + TIME_TO_SEC(plan.`PRODUKSI_2_M/C`) + TIME_TO_SEC(plan.OVERLAP_LINE_LAIN) + TIME_TO_SEC(plan.LAYOFF_MANPOWER) + TIME_TO_SEC(plan.LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(plan.LAYOFF_KOMP_SPM) + TIME_TO_SEC(plan.LAYOFF_KOMP_CNC) + TIME_TO_SEC(plan.PACKAGING_KOSONG) + TIME_TO_SEC(plan.LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(auto.gagal_vacum) + TIME_TO_SEC(auto.gagal_ambil) + TIME_TO_SEC(auto.instocker) + TIME_TO_SEC(auto.outstocker) + TIME_TO_SEC(auto.feeder) + TIME_TO_SEC(auto.flipper) + TIME_TO_SEC(auto.robot)) AS totalauto, sum(TIME_TO_SEC(mach.MC_TROUBLE) + TIME_TO_SEC(mach.MC_ASSY_TROUBLE) + TIME_TO_SEC(mach.MC_SPM_DRILL) + TIME_TO_SEC(mach.LT_TROUBLE) + TIME_TO_SEC(mach.WASHING_TROUBLE) + TIME_TO_SEC(mach.ANGIN_DROP) + TIME_TO_SEC(mach.PENAMBAHAN_COOLANT) + TIME_TO_SEC(mach.WARMING_UP) + TIME_TO_SEC(mach.OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(mat.stock_waiting) + TIME_TO_SEC(mat.PARTIAL) + TIME_TO_SEC(mat.sortir) + TIME_TO_SEC(mat.innerpart_kosong) + TIME_TO_SEC(mat.repair_part) + TIME_TO_SEC(mat.trimming_part) + TIME_TO_SEC(mat.sto) + TIME_TO_SEC(mat.others_material)) AS totalmat, sum(TIME_TO_SEC(pro.SETTING_PROGRAM) + TIME_TO_SEC(pro.GANTI_TOOL) + TIME_TO_SEC(pro.TRIAL_MACHINING) + TIME_TO_SEC(pro.Q_TIME) + TIME_TO_SEC(pro.JIG_FIXTURE) + TIME_TO_SEC(pro.WAITING_CMM) + TIME_TO_SEC(pro.UKUR_MANUAL) + TIME_TO_SEC(pro.LT_IMPRAG) + TIME_TO_SEC(pro.GANTI_THREEBOND) + TIME_TO_SEC(pro.PERUBAHAN_PROSES) + TIME_TO_SEC(pro.JOB_SET_UP) + TIME_TO_SEC(pro.TRIAL_NON_MACH) + TIME_TO_SEC(pro.OTHERS_PROSES)) AS totalpro, sum(TIME_TO_SEC(oth.PERSIAPAN_PROD) + TIME_TO_SEC(oth.LISTRIK_MATI) + TIME_TO_SEC(oth.KURAS_WASHING) + TIME_TO_SEC(oth.P5M) + TIME_TO_SEC(oth.MP_SAKIT) + TIME_TO_SEC(oth.OTHERS)) AS totaloth FROM tb_dt_terplanning AS plan join tb_dt_auto AS auto ON auto.id = plan.id join tb_dt_proses AS pro ON pro.id = auto.id join tb_dt_material AS mat ON mat.id = pro.id join tb_dt_mesin AS mach ON mach.id = mat.id join tb_dt_others AS oth ON oth.id = mach.id JOIN tb_produksi AS prod ON prod.id = oth.id WHERE plan.NAMA_PART = ? AND plan.LINE = ? AND plan.tanggal = CURDATE() AND plan.SHIFT = 3;", [namapart, line])
                        let [resng, fields4] = await conLocalP.execute("SELECT (dimensi + blong + seret + dent + uncutting + step + kasar +NG_ASSY+RIVET+BIMETAL+JOINT_TUBE+PLATE+NO_JIG+OTHERS_P+KEROPOS+BOCOR+FLOWLINE+RETAK+GOMPAL+OVER_PROSES+KURANG_PROSES+JAMUR+UNDERCUT+DEKOK+TRIAL+UNCUT_MATERIAL+OTHERS_MATERIAL) AS ng FROM tb_rejection WHERE tanggal = CURDATE() and nama_part = ? AND line = ? AND shift = ? ", [namapart, line, shift])
                        return { resname, r1, r2, r3, resng }
                    } catch (error) {
                        throw error
                    }
                }
                let hasil = await ressql()
                data = {
                    r1: hasil.r1,
                    r2: hasil.r2,
                    r3: hasil.r3,
                    nrp1: result1[0].NRP1,
                    nama1: hasil.resname[0].nama,
                    totalp: result1[0].OK,
                    totalok: result1[0].TOTAL_PRODUKSI,
                    ng: hasil.resng[0].ng,
                    dtclick: global[`dtclick-${idlaporan}`] || false,
                    idprod: idlaporan,
                    line,
                    namapart
                }
                res.render('info', data)
            }
        }
    })
}