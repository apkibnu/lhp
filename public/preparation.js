const socket = io() 

$('#formprep').on("keypress", function(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
    }
});

$('#nrp1').keyup(function(e) {
    var val = $('#nrp1').val() 
    cariNama(val, 'nama1')
});
$('#nrp2').keyup(function(e) {
    var val = $('#nrp2').val() 
    cariNama(val, 'nama2')
});
$('#nrp3').keyup(function(e) {
    var val = $('#nrp3').val() 
    cariNama(val, 'nama3')
});
$('#nrp4').keyup(function(e) {
    var val = $('#nrp4').val() 
    cariNama(val, 'nama4')
});
$("#nama1").on('keydown paste focus mousedown', function(e){
    if(e.keyCode != 9) {
        e.preventDefault();
    }
});
$("#nama2").on('keydown paste focus mousedown', function(e){
    if(e.keyCode != 9) {
        e.preventDefault();
    }
});
$("#nama3").on('keydown paste focus mousedown', function(e){
    if(e.keyCode != 9) {
        e.preventDefault();
    }
});
$("#nama4").on('keydown paste focus mousedown', function(e){
    if(e.keyCode != 9) {
        e.preventDefault();
    }
});

function cariNama(nrp, id) {
    socket.emit('search-nrp', nrp, id);
    socket.on('nama', (nrp, id) => {
        document.getElementById(id).value = nrp
    })    
}
