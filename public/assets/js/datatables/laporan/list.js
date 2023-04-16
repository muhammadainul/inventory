jQuery(document).ready(function() {
    var myTable = $('#laporanBarangTable').DataTable({
        bAutoWidth: false,
        search: true,
        serverSide: true,
        ajax       : {
            type : "POST",
            url  : "/laporan/datatables",
            data : data => {
                // Read values
                var start_date = jQuery("#start_date").val()
                var end_date = jQuery("#end_date").val()
                var kategori_id = jQuery("#kategori_id").val()

                data.start_date = start_date
                data.end_date = end_date
                data.kategori_id = kategori_id
                data.urutan = 'desc'
            }
        },
        orderCellsTop : true,
        fixedHeader   : true,
        columns       : [
            { "data": null,"sortable": false, 
                    render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1
                }  
            },
            { data: "barang.kode_barang", orderable: false },
            { data: "barang.nama_barang", orderable: false },
            { data: "barang.kategori.kategori", orderable: false },
            { data: "masuk", orderable: false },
            { data: "keluar", orderable: false },
            { data: "barang.harga_beli", orderable: false },
            { data: "barang.harga_jual", orderable: false },
            { data: "total_harga_beli", orderable: false },
            { data: "total_harga_jual", orderable: false },
            { data: "stok_tersedia", orderable: false },
            { data: "updatedAt", orderable: true }
        ],
        columnDefs: [
            {
                targets     : 6,
                createdCell : (td, cellData, rowData, row, col) => {
                    let price = new Intl.NumberFormat().format(cellData)
                    jQuery(td).html(`<span>Rp. </span>${price}`)
                }
            },
            {
                targets     : 7,
                createdCell : (td, cellData, rowData, row, col) => {
                    let price = new Intl.NumberFormat().format(cellData)
                    jQuery(td).html(`<span>Rp. </span>${price}`)
                }
            },
            {
                targets     : 8,
                createdCell : (td, cellData, rowData, row, col) => {
                    let price = new Intl.NumberFormat().format(cellData)
                    jQuery(td).html(`<span>Rp. </span>${price}`)
                }
            },
            {
                targets     : 9,
                createdCell : (td, cellData, rowData, row, col) => {
                    let price = new Intl.NumberFormat().format(cellData)
                    jQuery(td).html(`<span>Rp. </span>${price}`)
                }
            },
            {
                targets     : 11,
                createdCell : (td, cellData, rowData, row, col) => {
                    let date = new Date(cellData).toLocaleString(
                        'en-US', 
                        { 
                            timeZone: 'Asia/Jakarta', 
                            hour12: false 
                        }
                    )
                    jQuery(td).html(date)
                }
            }
        ]
        //"bProcessing": true,
        //"bServerSide": true,
        //"sAjaxSource": "http://127.0.0.1/table.php"	,

        //,
        //"sScrollY": "200px",
        //"bPaginate": false,

        //"sScrollX": "100%",
        //"sScrollXInner": "120%",
        //"bScrollCollapse": true,
        //Note: if you are applying horizontal scrolling (sScrollX) on a ".table-bordered"
        //you may want to wrap the table inside a "div.dataTables_borderWrap" element

        //"iDisplayLength": 50
    });
    jQuery("#buttonFilterLaporan").click(() => {
        myTable.draw()
    })
    
    // //style the message box
    // var defaultCopyAction = myTable.button(1).action();
    // myTable.button(1).action(function (e, dt, button, config) {
    //     defaultCopyAction(e, dt, button, config);
    //     $('.dt-button-info').addClass('gritter-item-wrapper gritter-info gritter-center white');
    // });
    
    
    // var defaultColvisAction = myTable.button(0).action();
    // myTable.button(0).action(function (e, dt, button, config) {
        
    //     defaultColvisAction(e, dt, button, config);
        
        
    //     if($('.dt-button-collection > .dropdown-menu').length == 0) {
    //         $('.dt-button-collection')
    //         .wrapInner('<ul class="dropdown-menu dropdown-light dropdown-caret dropdown-caret" />')
    //         .find('a').attr('href', '#').wrap("<li />")
    //     }
    //     $('.dt-button-collection').appendTo('.tableTools-container .dt-buttons')
    // });

    // ////

    // setTimeout(function() {
    //     $($('.tableTools-container')).find('a.dt-button').each(function() {
    //         var div = $(this).find(' > div').first();
    //         if(div.length == 1) div.tooltip({container: 'body', title: div.parent().text()});
    //         else $(this).tooltip({container: 'body', title: $(this).text()});
    //     });
    // }, 500);
})