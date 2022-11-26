// Socket.io
const socket = io()
var t;
var minutetotal = Math.floor((secondauto + secondmach + secondmat + secondothers + secondplan + secondpro) / 60);
document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
var id;
var dtclick = false;
var $layoff = $('button.btn-secondary');

socket.emit('interval', idprod, namapart, line)

socket.on('disconnect')

if ($('#qyt-prod').length) {
    console.log('ada input')
    socket.on(`update-total-${idprod}`, (total, target) => {
        if (total > totalp && dtclick == true) {
            socket.emit('dt-selesai-auto', idprod)
            $inputs.prop('disabled', false);
        }
        totalp = total
        ok = totalp - ng
        document.getElementById("totalok").innerHTML = ok;
        document.getElementById("ng").innerHTML = ng;
        document.getElementById("target").innerHTML = target;
        socket.emit('update-ng', ng, ok, idprod);
    })
    $('#qyt-prod').on('input', function () {
        var val = $('#qyt-prod').val()
        socket.emit('update-disconnected-lhp', val, idprod)
        console.log(val)
    })
} else {
    socket.on(`update-total-${idprod}`, (total, target) => {
        if (total > totalp && dtclick == true) {
            socket.emit('dt-selesai-auto', idprod)
            $inputs.prop('disabled', false);
        }
        totalp = total
        ok = totalp - ng
        if (document.getElementById('totalp')) { document.getElementById("totalp").innerHTML = totalp; }
        document.getElementById("totalok").innerHTML = ok;
        document.getElementById("ng").innerHTML = ng;
        document.getElementById("target").innerHTML = target;
        socket.emit('update-ng', ng, ok, idprod);
    })
}

socket.on('lhp-disconnected', (total) => {
    if ($('#qyt-prod').length == false) {
        document.getElementById('div-totalp').innerHTML = `<input type="number" id="qyt-prod" name="production" class="m-0 no-outline" style="width: 150px;" value="${total}">`
        $('#qyt-prod').on('input', function () {
            var val = $('#qyt-prod').val()
            socket.emit('update-disconnected-lhp', val, idprod)
            console.log(val)
        })
    } else {
        console.log('already there!')
    }
})

socket.on(`noclick-${idprod}`, dtcheck => {
    document.getElementById(dtcheck).click()
})

$layoff.click(() => {
    $inputs.not(this).prop('disabled', true);
    layoff();
})

$inputs.unbind().click(function () {
    $inputs.not(this).prop('disabled', true);
    $layoff.prop('disabled', true)
    id = this.id;
    if (id == 'material-stock_waiting') {
        dtticket('Stock Waiting', 'stock_waiting', 'mat-sw', 'material', secondmat)
    } else if (id == 'material-partial') {
        dtticket('Partial', 'partial', 'mat-partial', 'material', secondmat)
    } else if (id == 'material-sortir') {
        dtticket('Sortir', 'sortir', 'mat-sortir', 'material', secondmat)
    } else if (id == 'material-innerpart_kosong') {
        dtticket('Inner Part Kosong', 'innerpart_kosong', 'mat-innerpart_kos', 'material', secondmat)
    } else if (id == 'material-repair_part') {
        dtticket('Repair Part', 'repair_part', 'mat-repair_part', 'material', secondmat)
    } else if (id == 'material-trimming') {
        dtticket('Trimming Part', 'trimming_part', 'mat-trimming', 'material', secondmat)
    } else if (id == 'material-stock_opname') {
        dtticket('Stock Opname', 'sto', 'mat-stock_opname', 'material', secondmat)
    } else if (id == 'material-others') {
        dtticket('Lain Lain Material', 'others_material', 'mat-others_mat', 'material', secondmat)
    } else if (id == 'proses-set_program') {
        dtticket('Setting Program', 'setting_program', 'pro-set_program', 'proses', secondpro)
    } else if (id == 'proses-ganti_tool') {
        dtticket('Ganti Tool', 'ganti_tool', 'pro-ganti_tool', 'proses', secondpro)
    } else if (id == 'proses-trial_non_machining') {
        dtticket('Trial Non Machining', 'trial_non_mach', 'pro-trial_non_machining', 'proses', secondpro)
    } else if (id == 'proses-trial_machining') {
        dtticket('Trial Machining', 'trial_machining', 'pro-trial_machining', 'proses', secondpro)
    } else if (id == 'proses-q_time') {
        dtticket('Q - Time', 'q_time', 'pro-q_time', 'proses', secondpro)
    } else if (id == 'proses-jig_fixture') {
        dtticket('Jig & Fixture', 'jig_fixture', 'pro-jig_fixture', 'proses', secondpro)
    } else if (id == 'proses-waiting_cmm') {
        dtticket('Waiting CMM', 'waiting_cmm', 'pro-waiting_cmm', 'proses', secondpro)
    } else if (id == 'proses-ukur_manual') {
        dtticket('Ukur Manual', 'ukur_manual', 'pro-ukur_manual', 'proses', secondpro)
    } else if (id == 'proses-lt_part_imprag') {
        dtticket('Leaktest Part Imparge', 'lt_imprag', 'pro-lt_part_imprag', 'proses', secondpro)
    } else if (id == 'proses-ganti_treebond') {
        dtticket('Ganti Treebond', 'ganti_threebond', 'pro-ganti_treebond', 'proses', secondpro)
    } else if (id == 'proses-perubahan_proses') {
        dtticket('Perubahan Proses', 'perubahan_proses', 'pro-perubahan_proses', 'proses', secondpro)
    } else if (id == 'proses-job_setup') {
        dtticket('Job Set Up', 'job_set_up', 'pro-job_setup', 'proses', secondpro)
    } else if (id == 'proses-others') {
        dtticket('Lain Lain Proses', 'others_proses', 'pro-others', 'proses', secondpro)
    } else if (id == 'mach-mc_trouble') {
        dtticket('M/C Trouble', 'mc_trouble', 'machi-mc_trouble', 'mesin', secondmach)
    } else if (id == 'mach-mc_assy_trouble') {
        dtticket('M/C Assy', 'mc_assy_trouble', 'machi-mc_assy_trouble', 'mesin', secondmach)
    } else if (id == 'mach-mc_lt_trouble') {
        dtticket('Leaktest Trouble', 'lt_trouble', 'machi-mc_lt_trouble', 'mesin', secondmach)
    } else if (id == 'mach-washing_trouble') {
        dtticket('Washing Trouble', 'washing_trouble', 'mach-washing_trouble', 'mesin', secondmach)
    } else if (id == 'mach-warming_up') {
        dtticket('Warming Up', 'warming_up', 'machi-warming_up', 'mesin', secondmach)
    } else if (id == 'mach-angin_drop') {
        dtticket('Angin Drop', 'angin_drop', 'machi-angin_drop', 'mesin', secondmach)
    } else if (id == 'mach-penambahan_coolant') {
        dtticket('Penambahan Coolant', 'penambahan_coolant', 'machi-penambahan_coolant', 'mesin', secondmach)
    } else if (id == 'mach-others') {
        dtticket('Lain Lain Mesin', 'others_mc', 'machi-others', 'mesin', secondmach)
    } else if (id == 'auto-gagal_vacum') {
        dtticket('Gagal Vacum', 'gagal_vacum', 'aut-gagal_vacum', 'auto', secondauto)
    } else if (id == 'auto-gagal_ambil') {
        dtticket('Gagal Ambil', 'gagal_ambil', 'aut-gagal_ambil', 'auto', secondauto)
    } else if (id == 'auto-instocker_trouble') {
        dtticket('Instocker Trouble', 'instocker', 'aut-instocker_trouble', 'auto', secondauto)
    } else if (id == 'auto-outstocker_trouble') {
        dtticket('Outstocker Trouble', 'outstocker', 'aut-outstocker_trouble', 'auto', secondauto)
    } else if (id == 'auto-feeder_trouble') {
        dtticket('Feeder Trouble', 'feeder', 'aut-feeder_trouble', 'auto', secondauto)
    } else if (id == 'auto-flipper_trouble') {
        dtticket('Flipper Trouble', 'flipper', 'aut-flipper_trouble', 'auto', secondauto)
    } else if (id == 'auto-robot_trouble') {
        dtticket('Robot Trouble', 'robot', 'aut-robot_trouble', 'auto', secondauto)
    } else if (id == 'others-persiapan_produksi') {
        dtticket('Persiapan Produksi', 'persiapan_prod', 'other-persiapan_produksi', 'others', secondothers)
    } else if (id == 'others-listrik_mati') {
        dtticket('Listrik Mati', 'listrik_mati', 'other-listrik_mati', 'others', secondothers)
    } else if (id == 'others-kuras_washing') {
        dtticket('Kuras Washing', 'kuras_washing', 'other-kuras_washing', 'others', secondothers)
    } else if (id == 'others-p5m') {
        dtticket('P5M', 'p5m', 'other-p5m', 'others', secondothers)
    } else if (id == 'others-mp_sakit') {
        dtticket('M/P Sakit', 'mp_sakit', 'other-mp_sakit', 'others', secondothers)
    } else if (id == 'others-others') {
        dtticket('Lain Lain Others', 'others', 'other-others', 'others', secondothers)
    } else if (id == 'terplanning-5r') {
        dtticket('5R', '5r', 'planning-5r', 'terplanning', secondplan)
    } else if (id == 'terplanning-mp_pengganti') {
        dtticket('MP Pengganti', 'mp_pengganti', 'planning-mp_pengganti', 'terplanning', secondplan)
    } else if (id == 'terplanning-ct_tidak_standart') {
        dtticket('CT Tidak Standart', 'c/t_tidak_standart', 'planning-ct_tidak_standart', 'terplanning', secondplan)
    } else if (id == 'terplanning-mp_dialihkan') {
        dtticket('MP Dialihkan', 'mp_dialihkan', 'planning-mp_dialihkan', 'terplanning', secondplan)
    } else if (id == 'terplanning-dandori') {
        dtticket('Dandori', 'dandory', 'planning-dandori', 'terplanning', secondplan)
    } else if (id == 'terplanning-preventive_mt') {
        dtticket('Preventive Maintenance', 'preventive_maint', 'planning-preventive_mt', 'terplanning', secondplan)
    } else if (id == 'terplanning-prod_part_lain') {
        dtticket('Produksi Part Lain', 'prod_part_lain', 'planning-prod_part_lain', 'terplanning', secondplan)
    } else if (id == 'terplanning-prod_2/3_jig') {
        dtticket('Produksi 2/3 Jig', 'produksi_2/3_jig', 'planning-prod_2/3_jig', 'terplanning', secondplan)
    } else if (id == 'terplanning-prod_1_mp') {
        dtticket('Produksi 1 MP', 'produksi_1_m/p', 'planning-prod_1_mp', 'terplanning', secondplan)
    } else if (id == 'terplanning-prod_2_mc') {
        dtticket('Produksi 2 MC', 'produksi_2_m/c', 'planning-prod_2_mc', 'terplanning', secondplan)
    } else if (id == 'terplanning-overlap_line_lain') {
        dtticket('Overlap Line Lain', 'overlap_line_lain', 'planning-overlap_line_lain', 'terplanning', secondplan)
    } else if (id == 'terplanning-layoff_stock_waiting') {
        dtticket('Layoff Stock Waiting', 'layoff_stock_waiting', 'planning-layoff_stock_waiting', 'terplanning', secondplan)
    } else if (id == 'terplanning-layoff_mp') {
        dtticket('Layoff MP', 'layoff_stock_waiting', 'planning-layoff_mp', 'terplanning', secondplan)
    } else if (id == 'terplanning-layoff_tool_kosong') {
        dtticket('Layoff Tool Kosong', 'layoff_tool_kosong', 'planning-layoff_tool_kosong', 'terplanning', secondplan)
    } else if (id == 'terplanning-layoff_komp_spm') {
        dtticket('Layoff Komp. SPM', 'layoff_komp_spm', 'planning-layoff_komp_spm', 'terplanning', secondplan)
    } else if (id == 'terplanning-layoff_komp_cnc') {
        dtticket('Layoff Komp. CNC', 'layoff_komp_cnc', 'terplanning-layoff_komp_cnc', 'terplanning', secondplan)
    } else if (id == 'terplanning-packaging_kosong') {
        dtticket('Packaging Kosong', 'packaging_kosong', 'planning-packaging_kosong', 'terplanning', secondplan)
    }
});

// function dtmaterial(api, mysql, idsec, key) {
//     var namasql = mysql;
//     var namaapi = api;
//     function timerdt() {
//         secondmat++;
//         second1++;
//         document.getElementById('material-timer').innerHTML = secondmat + " sec";
//         if (second1 % 60 == 0) {
//             minute++;
//             minutetotal++;
//             document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
//             document.getElementById(idsec).innerHTML = minute + " mnt";
//         }
//     }
//     if (dtclick == false) {
//         var second1;
//         var minute;
//         socket.emit('update-dt-api', nrp, api, 'asddasdasd', namapart, line) 
//         socket.emit('update-dt-mysql', namasql, key, id, idprod)
//         socket.on('send-dt-value', (res) => {
//             second1 = res;
//             minute = Math.floor(second1/60);
//             console.log(second1);
//         })
//         t = setInterval(timerdt, 1000);
//         dtclick = true
//     } 
//     // else {
//     //     socket.emit('selesai-dt')
//     //     clearInterval(t);
//     //     $inputs.prop('disabled', false);
//     //     dtclick = false;
//     // }  
// }

// function dtproses(api, mysql, idsec, key) {
//     var namasql = mysql;
//     var namaapi = api;
//     function timerdt() {
//         secondpro++;
//         second1++;
//         document.getElementById('proses-timer').innerHTML = secondpro + " sec";
//         if (second1 % 60 == 0) {
//             minute++;
//             minutetotal++;
//             document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
//             document.getElementById(idsec).innerHTML = minute + " mnt";
//         }
//     }
//     if (dtclick == false) {
//         var second1;
//         var minute;
//         socket.emit('update-dt-api', nrp, api, 'asddasdasd', namapart, line) 
//         socket.emit('update-dt-mysql', namasql, 'proses', id, idprod)
//         socket.on('send-dt-value', (res) => {
//             second1 = res;
//             minute = Math.floor(second1/60);
//             console.log(second1);
//         })
//         t = setInterval(timerdt, 1000);
//         dtclick = true
//     } 
//     // else {
//     //     socket.emit('selesai-dt')
//     //     clearInterval(t);
//     //     $inputs.prop('disabled', false);
//     //     dtclick = false;
//     // }  
// }

// function dtmesin(api, mysql, idsec, key) {
//     var namasql = mysql;
//     var namaapi = api;
//     function timerdt() {
//         secondmach++;
//         second1++;
//         document.getElementById('mesin-timer').innerHTML = secondmach + " sec";
//         if (second1 % 60 == 0) {
//             minute++;
//             minutetotal++;
//             document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
//             document.getElementById(idsec).innerHTML = minute + " mnt";
//         }
//     }
//     if (dtclick == false) {
//         var second1;
//         var minute;
//         socket.emit('update-dt-api', nrp, api, 'asddasdasd', namapart, line) 
//         socket.emit('update-dt-mysql', namasql, 'mesin', id, idprod)
//         socket.on('send-dt-value', (res) => {
//             second1 = res;
//             minute = Math.floor(second1/60);
//             console.log(second1);
//         })
//         t = setInterval(timerdt, 1000);
//         dtclick = true
//     } 
//     // else {
//     //     socket.emit('selesai-dt')
//     //     clearInterval(t);
//     //     $inputs.prop('disabled', false);
//     //     dtclick = false;
//     // }  
// }


function dtticket(api, mysql, idsec, key, timer) {
    var namasql = mysql;
    var namaapi = api;
    function timerdt() {
        timer++;
        second1++;
        document.getElementById(`${key}-timer`).innerHTML = timer + " sec";
        if (second1 % 60 == 0) {
            minute++;
            minutetotal++;
            document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
            document.getElementById(idsec).innerHTML = minute + " mnt";
        }
    }
    if (dtclick == false) {
        var second1;
        var minute;
        socket.emit('update-dt', nrp, namaapi, 'asddasdasd', namapart, line, namasql, key, id, idprod)
        socket.off().on('send-dt-value', (res) => {
            second1 = res;
            minute = Math.floor(second1 / 60);
            console.log('get second done')
            window[`int-${key}-${mysql}`] = setInterval(() => {
                switch (key) {
                    case 'auto':
                        timer = secondauto++
                        break
                    case 'material':
                        timer = secondmat++
                        break
                    case 'proses':
                        timer = secondpro++
                        break
                    case 'mesin':
                        timer = secondmach++
                        break
                    case 'others':
                        timer = secondothers++
                        break
                    case 'terplanning':
                        timer = secondplan++
                        break
                }
                second1 += 1;
                document.getElementById(`${key}-timer`).innerHTML = timer + " sec";
                if (second1 % 60 == 0) {
                    minute += 1;
                    minutetotal += 1;
                    document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
                    document.getElementById(idsec).innerHTML = minute + " mnt";
                }
            }, 1000);
        })
        dtclick = true
    }
    else {
        $('#exampleModal').modal('show');
        $('#modal-ya').click(() => {
            socket.emit('selesai-dt', idprod)
            clearInterval(window[`int-${key}-${mysql}`]);
            window[`int-${key}-${mysql}`] = undefined
            $inputs.prop('disabled', false);
            dtclick = false;
            $('#exampleModal').modal('hide');
        })
        $('#modal-no').on('click', () => {
            $('#exampleModal').modal('hide');
        });
    }
}

const layoff = () => {
    if (dtclick == false) {
        socket.emit('layoff', namapart, line)
        dtclick = true
    }
    else {
        // var myModal = new bootstrap.Modal(document.getElementById('exampleModal'))
        $('#exampleModal').modal('show');
        // myModal.show()
        $('#modal-ya').click(() => {
            socket.emit('selesaiLayoff', line, namapart)
            $inputs.prop('disabled', false);
            dtclick = false;
            $('#exampleModal').modal('hide');
        })
        $('#modal-no').on('click', () => {
            $('#exampleModal').modal('hide');
        });
    }
}

function dtnoticket(api, mysql, idsec, key) {
    var namasql = mysql;
    var namaapi = api;
    function timerdt() {
        secondauto++;
        second1++;
        document.getElementById(`${key}-timer`).innerHTML = secondauto + " sec";
        if (second1 % 60 == 0) {
            minute++;
            minutetotal++;
            document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
            document.getElementById(idsec).innerHTML = minute + " mnt";
        }
    }
    if (dtclick == false) {
        var second1;
        var minute;
        socket.emit('update-dt-mysql', namasql, key, id, idprod)
        socket.on('send-dt-value', (res) => {
            second1 = res;
            minute = Math.floor(second1 / 60);
            console.log(second1);
        })
        t = setInterval(timerdt, 1000);
        dtclick = true
    }
    else {
        $('#exampleModal').modal('show');
        $('#modal-ya').click(() => {
            socket.emit('selesai-noticket-dt')
            clearInterval(t);
            $inputs.prop('disabled', false);
            $layoff.prop('disabled', false)
            dtclick = false;
            $('#exampleModal').modal('hide');
        })
        $('#modal-no').on('click', () => {
            $('#exampleModal').modal('hide');
        });
    }
}
// ganti id plan-timer di downtime.ejs


// function dtothers(api, mysql, idsec, key) {
//     var namasql = mysql;
//     var namaapi = api;
//     function timerdt() {
//         secondothers++;
//         second1++;
//         document.getElementById('others-timer').innerHTML = secondothers + " sec";
//         if (second1 % 60 == 0) {
//             minute++;
//             minutetotal++;
//             document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
//             document.getElementById(idsec).innerHTML = minute + " mnt";
//         }
//     }
//     if (dtclick == false) {
//         var second1;
//         var minute;
//         socket.emit('update-dt-api', nrp, api, 'asddasdasd', namapart, line)
//         socket.emit('update-dt-mysql', namasql, 'others', id, idprod)
//         socket.on('send-dt-value', (res) => {
//             second1 = res;
//             minute = Math.floor(second1/60);
//         })
//         t = setInterval(timerdt, 1000);
//         dtclick = true
//     }
//     // else {
//     //     socket.emit('selesai-dt')
//     //     clearInterval(t);
//     //     $inputs.prop('disabled', false);
//     //     dtclick = false;
//     // }
// }

// function dtplan(api, mysql, idsec, key) {
//     var namasql = mysql;
//     var namaapi = api;
//     function timerdt() {
//         secondplan++;
//         second1++;
//         document.getElementById('plan-timer').innerHTML = secondplan + " sec";
//         if (second1 % 60 == 0) {
//             minute++;
//             minutetotal++;
//             document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
//             document.getElementById(idsec).innerHTML = minute + " mnt";
//         }
//     }
//     if (dtclick == false) {
//         var second1;
//         var minute;
//         socket.emit('update-dt-api', nrp, api, 'asddasdasd', namapart, line)
//         socket.emit('update-dt-mysql', namasql, 'terplanning', id, idprod)
//         socket.on('send-dt-value', (res) => {
//             second1 = res;
//             minute = Math.floor(second1/60);
//             console.log(second1);
//         })
//         t = setInterval(timerdt, 1000);
//         dtclick = true
//     }
//     // else {
//     //     socket.emit('selesai-dt')
//     //     clearInterval(t);
//     //     $inputs.prop('disabled', false);
//     //     dtclick = false;
//     // }
// }



