jQuery(document).ready(function() {
    var myTable = $('#barangTable').DataTable({
        bAutoWidth: false,
        search: true,
        serverSide: true,
        ajax       : {
            type : "POST",
            url  : "/master_data/datatables",
            data : data => {
                // Read values
                var start_date_barang = jQuery("#start_date_barang").val()
                var end_date_barang = jQuery("#end_date_barang").val()
                var kategori_id = jQuery("#kategori_id").val()

                data.start_date_barang = start_date_barang
                data.end_date_barang = end_date_barang
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
            { data: "kode_barang", orderable: false },
            { data: "nama_barang", orderable: false },
            { data: "harga_beli", orderable: false },
            { data: "harga_jual", orderable: false },
            { data: "keterangan", orderable: false },
            { data: "kategori.kategori", orderable: false },
            { data: "filename", orderable: false },
            { data: "id", orderable: false }
        ],
        columnDefs: [
            {
                targets     : 3,
                createdCell : (td, cellData, rowData, row, col) => {
                    let price = new Intl.NumberFormat().format(cellData)
                    jQuery(td).html(`<span>Rp. </span>${price}`)
                }
            },
            {
                targets     : 4,
                createdCell : (td, cellData, rowData, row, col) => {
                    let price = new Intl.NumberFormat().format(cellData)
                    jQuery(td).html(`<span>Rp. </span>${price}`)
                }
            },
            {
                targets     : 7,
                createdCell : (td, cellData, rowData, row, col) => {
                    jQuery(td).html(`
                        <center>
                        <img width='70px' src='/assets/upload/images/${cellData}'>
                        </center>`)
                }
            },
            {
                targets     : 8,
                createdCell : (td, cellData, rowData, row, col) => {
                    jQuery(td).html(`<center>
                    <a href='/master_data/edit/${cellData}' 
                    class='btn btn-success btn-sm
                    data-toggle='tooltip' data-placement='top' title='Edit Barang'>
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
                    <a href='#' class='btn btn-danger btn-sm deleteBarang'
                    data-id=` + cellData + ` data-toggle='modal' data-target='
                    deleteBarang' data-toggle='tooltip' data-placement='top' title='Hapus Barang'>
                    <i class="ace-icon fa fa-trash-o bigger-130" aria-hidden="true"></i></a>
                    </center>`);
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
    jQuery("#buttonFilterMasterBarang").click(() => {
        myTable.draw()
    })
})