const socket = io()

socket.on(`update-total-${idprod}`, (total) => {
    if(total > totalp && dtclick == true) {
        socket.emit('dt-selesai-auto')
    }
    totalp = total
    ok = totalp - ng
    socket.emit('update-ng', ng, ok, idprod);
})


socket.emit('interval', idprod, namapart, line)


socket.on(`update-resume-${idprod}`, (shift, prod, ok, ng, totalplan, totalauto, totalmesin, totalmat, totalpro, totaloth) => {
    if (shift === 1) {
        document.getElementById('totalprod-1').innerHTML = prod + " pcs"
        document.getElementById('ok-1').innerHTML = ok + " pcs"
        document.getElementById('reject-1').innerHTML = ng + " pcs"
        document.getElementById('dtmat-1').innerHTML = Math.floor(totalmat/60) + " mnt"
        document.getElementById('dtpro-1').innerHTML = Math.floor(totalpro/60) + " mnt"
        document.getElementById('dtmach-1').innerHTML = Math.floor(totalmesin/60) + " mnt"
        document.getElementById('dtauto-1').innerHTML = Math.floor(totalauto/60) + " mnt"
        document.getElementById('dtplan-1').innerHTML = Math.floor(totalplan/60) + " mnt"
        document.getElementById('dtoth-1').innerHTML = Math.floor(totaloth/60) + " mnt"
    } else if (shift === 2) {
        document.getElementById('totalprod-2').innerHTML = prod + " pcs"
        document.getElementById('ok-2').innerHTML = ok + " pcs"
        document.getElementById('reject-2').innerHTML = ng + " pcs"
        document.getElementById('dtmat-2').innerHTML = Math.floor(totalmat/60) + " mnt"
        document.getElementById('dtpro-2').innerHTML = Math.floor(totalpro/60) + " mnt"
        document.getElementById('dtmach-2').innerHTML = Math.floor(totalmesin/60) + " mnt"
        document.getElementById('dtauto-2').innerHTML = Math.floor(totalauto/60) + " mnt"
        document.getElementById('dtplan-2').innerHTML = Math.floor(totalplan/60) + " mnt"
        document.getElementById('dtoth-2').innerHTML = Math.floor(totaloth/60) + " mnt"
    } else if (shift === 3) {
        document.getElementById('totalprod-3').innerHTML = prod + " pcs"
        document.getElementById('ok-3').innerHTML = ok + " pcs"
        document.getElementById('reject-3').innerHTML = ng + " pcs"
        document.getElementById('dtmat-3').innerHTML = Math.floor(totalmat/60) + " mnt"
        document.getElementById('dtpro-3').innerHTML = Math.floor(totalpro/60) + " mnt"
        document.getElementById('dtmach-3').innerHTML = Math.floor(totalmesin/60) + " mnt"
        document.getElementById('dtauto-3').innerHTML = Math.floor(totalauto/60) + " mnt"
        document.getElementById('dtplan-3').innerHTML = Math.floor(totalplan/60) + " mnt"
        document.getElementById('dtoth-3').innerHTML = Math.floor(totaloth/60) + " mnt"
    }
})

socket.on(`update-hourly-${idprod}`, (jam, total, ok, ng, shift) => {
    document.getElementById(`total-${shift}-${jam}`).innerHTML = `${total} PCS`
    document.getElementById(`ok-${shift}-${jam}`).innerHTML = `${ok} PCS`
    document.getElementById(`ng-${shift}-${jam}`).innerHTML = `${ng} PCS`
})

document.getElementById('back-b').addEventListener('click', () => {
    history.back();
});