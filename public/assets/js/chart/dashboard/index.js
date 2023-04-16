jQuery(document).ready(function () { 
    const socket = io('http://localhost:3000', { transports : ['websocket'] });
    
    // socket.on('user connected', function (data){
    //     $("#connected").html('User connected: ' + data);
    // });

    var dataBarangMasuk;
    var dataBarangKeluar;
    var contextBarangMasuk;
    var contextBarangKeluar;
    var chartBarangMasuk;
    var chartBarangKeluar;

    socket.on('user online', function (data) {
        tata.info('Login', `${data.online} online`);
    });

    socket.on('user logout', function (data) {
        tata.error('Logout', `${data.offline} offline`);
    });

    socket.on('report', function (response){
        // data barang masuk
        dataBarangMasuk.labels = response.labelsBarangMasuk;
        dataBarangMasuk.datasets[0].data = response.countsBarangMasuk;

        // data barang keluar
        dataBarangKeluar.labels = response.labelsBarangKeluar;
        dataBarangKeluar.datasets[0].data = response.countsBarangKeluar;

        chartBarangMasuk.update();
        chartBarangKeluar.update();

        $("#totalBarangMasuk").html(response.totalBarangMasuk);
        $("#totalBarangKeluar").html(response.totalBarangKeluar);
        $("#totalStokTersedia").html(response.totalStokTersedia);

        let ids = [
            "#totalBarangMasuk",
            "#totalBarangKeluar",
            "#totalStokTersedia"
        ]
    
        for (let o of ids) {
            $(o).each(function () {
                var $this = $(this);
                jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
                    duration: 1000,
                    easing: "swing",
                    step: function () {
                    $this.text(Math.ceil(this.Counter));
                    }
                });
            });
        }
    });

    // Type
    contextBarangMasuk = $("#chartTotalBarangMasuk").get(0).getContext("2d")

    dataBarangMasuk = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    "#33A1FD",
                    "#F79824",
                    "#FDCA40",
                    "#2176FF", 
                    "#7FB685", 
                    "#E3BC95",
                    "#FFB100",
                    "#FFEBC6",
                    "#F7EE7F",
                    "#8EEDF7",
                    "#A1CDF1",
                    "#C2D3CD",
                    "#F45866",
                    "#ACF39D",
                    "#387780",
                    "#104911",
                    "#4C5667", 
                ],
            },
        ],
    }
    
    var typeOptions = {
        elements: {
            arc: {
            borderWidth: 0,
            },
        },
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: 'Barang Masuk'
        }
    }
    
    chartBarangMasuk = new Chart(contextBarangMasuk, {
        type: "pie",
        data: dataBarangMasuk,
        options: typeOptions,
    })

    // Type
    contextBarangKeluar = $("#chartTotalBarangKeluar").get(0).getContext("2d")

    dataBarangKeluar = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    "#F45866",
                    "#33A1FD",
                    "#F79824",
                    "#FDCA40",
                    "#2176FF", 
                    "#7FB685", 
                    "#E3BC95",
                    "#FFB100",
                    "#FFEBC6",
                    "#F7EE7F",
                    "#8EEDF7",
                    "#A1CDF1",
                    "#C2D3CD",
                    "#ACF39D",
                    "#387780",
                    "#104911",
                    "#4C5667", 
                ],
            },
        ],
    }
    
    var typeOptions = {
        elements: {
            arc: {
            borderWidth: 0,
            },
        },
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: 'Barang Keluar'
        }
    }
    
    chartBarangKeluar = new Chart(contextBarangKeluar, {
        type: "pie",
        data: dataBarangKeluar,
        options: typeOptions,
    });
});