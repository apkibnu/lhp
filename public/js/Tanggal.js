var date = new Date();
                    var tahun = date.getFullYear();
                    var bulan = date.getMonth();
                    var tanggal = date.getDate();
                    var hari = date.getDay();
                    var jam = date.getHours();
                    var menit = date.getMinutes();
                    var detik = date.getSeconds();
                    switch (hari) {
                      case 0:
                        hari = 'Minggu';
                        break;
                      case 1:
                        hari = 'Senin';
                        break;
                      case 2:
                        hari = 'Selasa';
                        break;
                      case 3:
                        hari = 'Rabu';
                        break;
                      case 4:
                        hari = 'Kamis';
                        break;
                      case 5:
                        hari = "Jum'at";
                        break;
                      case 6:
                        hari = 'Sabtu';
                        break;
                    }
                    switch (bulan) {
                      case 0:
                        bulan = 'Jan';
                        break;
                      case 1:
                        bulan = 'Feb';
                        break;
                      case 2:
                        bulan = 'Mar';
                        break;
                      case 3:
                        bulan = 'Apr';
                        break;
                      case 4:
                        bulan = 'Mei';
                        break;
                      case 5:
                        bulan = 'Jun';
                        break;
                      case 6:
                        bulan = 'Jul';
                        break;
                      case 7:
                        bulan = 'Ags';
                        break;
                      case 8:
                        bulan = 'Sep';
                        break;
                      case 9:
                        bulan = 'Okt';
                        break;
                      case 10:
                        bulan = 'Nov';
                        break;
                      case 11:
                        bulan = 'Des';
                        break;
                    }
                    var tampilTanggal = tanggal + ' ' + bulan + ' ' + tahun;
                    document.getElementById('date-container').innerHTML = tampilTanggal;