//socket.io
const socket = io();
 
var minutetotal = Math.floor((secondauto + secondmach + secondmat + secondothers + secondplan + secondpro)/60);
document.getElementById('totaldt').innerHTML = minutetotal + " mnt";
console.log(undoTracker)

socket.emit('interval', idprod, namapart, line)

socket.on(`update-total-${idprod}`, (total, target) => {
    if(total > totalp && dtclick == true) {
        socket.emit('dt-selesai-auto', idprod)
        $inputs.prop('disabled', false);
    }
    totalp = total
    ok = totalp - ng
    document.getElementById("totalp").innerHTML = totalp;
    document.getElementById("totalok").innerHTML = ok;
    document.getElementById("ng").innerHTML = ng;
    document.getElementById("target").innerHTML = target;
    socket.emit('update-ng', ng, ok, idprod);
})

socket.on(`noclick-${idprod}`, (status) => {
    $('button.btn-danger').prop('disabled', true)
})

socket.on('disconnect')

function dimensi() {
    undoTracker = 1
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/dimensi/dm/1`
}

function blong() {
    undoTracker = 2
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/blong/bl/2`
}

function seret() {
    undoTracker = 3
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/seret/sr/3` 
}

function dent() {
    undoTracker = 4
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/dent/dn/4`
}

function uncutting() {
    undoTracker = 5
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/uncutting/uc/5`
}

function step() {
    undoTracker = 6 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/step/st/6`
}

function kasar() {
    undoTracker = 7 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/kasar/ks/7`
}

function ngassy() {
    undoTracker = 8 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/ng_assy/na/8`
}

function rivet() {
    undoTracker = 9 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/rivet/rv/9`
}

function bimetal() {
    undoTracker = 10 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/bimetal/bm/10`
}

function jointt() {
    undoTracker = 11 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/joint_tube/jt/11`
}

function plate() {
    undoTracker = 12 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/plate/pl/12`
}

function nojig() {
    undoTracker = 13 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/no_jig/nj/13`
}

function othersp() {
    undoTracker = 14 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/others_p/op/14`
}

function keropos() {
    undoTracker = 15 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/keropos/kr/15` 
}

function bocor() {
    undoTracker = 16 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/bocor/bc/16`
}

function flowline() {
    undoTracker = 17 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/flowline/fl/17`
}

function retak() {
    undoTracker = 18 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/retak/rt/18`
}

function gompal() {
    undoTracker = 19 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/gompal/gp/19`
}

function overp() {
    undoTracker = 20 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/over_proses/ov/20`
}

function kurangp() {
    undoTracker = 21 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/kurang_proses/kp/21` 
}

function jamur() {
    undoTracker = 22 
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/jamur/jm/22`
}

function undercut() {
    undoTracker = 23
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/undercut/un/23` 
}

function dekok() {
    undoTracker = 24
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/dekok/dk/24`
}

function trial() {
    undoTracker = 25
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/trial/tr/25` 
}

function uncutm() {
    undoTracker = 26
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/uncut_material/um/26`
}

function othersm() {
    undoTracker = 27
    location.href = `http://10.14.20.212:3000/${namapart}/${idprod}/${line}/locsheet/others_material/om/27`
}

function undo() {
    console.log(undoTracker)
    switch(undoTracker) {
        case 1:
            totaldimensi--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('dimensi').innerHTML = totaldimensi + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "dimensi", totaldimensi, idprod)
            break;
        case 2:
            totalblong--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('blong').innerHTML = totalblong + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "blong", totalblong, idprod)
            break;
        case 3:
            totalseret--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('seret').innerHTML = totalseret + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "seret", totalseret, idprod)
            break;
        case 4:
            totaldent--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('dent').innerHTML = totaldent + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "dent", totaldent, idprod)
            break;
        case 5:
            totaluncutting--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('uncutting').innerHTML = totaluncutting + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "uncutting", totaluncutting, idprod)
            break;
        case 6:
            totalstep--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('step').innerHTML = totalstep + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "step", totalstep, idprod)
            break;
        case 7:
            totalkasar--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('kasar').innerHTML = totalkasar + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "kasar", totalkasar, idprod)
            break;
        case 8:
            totalngassy--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('ngassy').innerHTML = totalngassy + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "ng_assy", totalngassy, idprod)
            break;
        case 9:
            totalrivet--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('rivet').innerHTML = totalrivet + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "rivet", totalrivet, idprod)
            break;
        case 10:
            totalbimetal--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('bimetal').innerHTML = totalbimetal + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "bimetal", totalbimetal, idprod)
            break;
        case 11:
            totaljointt--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('jointt').innerHTML = totaljointt + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "joint_tube", totaljointt, idprod)
            break;   
        case 12:
            totalplate--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('plate').innerHTML = totalplate + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "plate", totalplate, idprod)
            break;
        case 13:
            totalnojig--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('nojig').innerHTML = totalnojig + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "no_jig", totalnojig, idprod)
            break;
        case 14:
            totalothersp--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('othersp').innerHTML = totalothersp + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "others_p", totalothersp, idprod)
            break;
        case 15:
            totalkeropos--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('keropos').innerHTML = totalkeropos + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "keropos", totalkeropos, idprod)
            break;
        case 16:
            totalbocor--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('bocor').innerHTML = totalbocor + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "bocor", totalbocor, idprod)
            break;
        case 17:
            totalflowline--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('flowline').innerHTML = totalflowline + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "flowline", totalflowline, idprod)
            break;
        case 18:
            totalretak--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('retak').innerHTML = totalretak + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "retak", totalretak, idprod)
            break;
        case 19:
            totalgompal--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('gompal').innerHTML = totalgompal + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "gompal", totalgompal, idprod)
            break;
        case 20:
            totaloverp--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('overp').innerHTML = totaloverp + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "over_proses", totaloverp, idprod)
            break;
        case 21:
            totalkurangp--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('kurangp').innerHTML = totalkurangp + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "kurang_proses", totalkurangp, idprod)
            break;
        case 22:
            totaljamur--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('jamur').innerHTML = totaljamur + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "jamur", totaljamur, idprod)
            break;
        case 23:
            totalundercut--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('undercut').innerHTML = totalundercut + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "undercut", totalundercut, idprod)
            break;
        case 24:
            totaldekok--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('dekok').innerHTML = totaldekok + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "dekok", totaldekok, idprod)
            break;
        case 25:
            totaltrial--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('trial').innerHTML = totaltrial + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "trial", totaltrial, idprod)
            break;
        case 26:
            totaluncutm--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('uncutm').innerHTML = totaluncutm + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "uncut_material", totaluncutm, idprod)
            break;
        case 27:
            totalothersm--;
            ng--;
            document.getElementById('ng').innerHTML = ng;
            document.getElementById('othersm').innerHTML = totalothersm + " pcs";
            undoTracker = 0;
            socket.emit('update-reject', "others_material", totaluncutm, idprod)
            break;
    }
}

