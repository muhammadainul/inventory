jQuery(document).ready(function() {
    var myTable = $('#userTable').DataTable({
        bAutoWidth: false,
        search: true,
        serverSide: true,
        ajax       : {
            type : "POST",
            url  : "/user/datatables",
            data : data => {
                // Read values
                let user_id = jQuery("#id").val()
                let start_date = jQuery("#start_date_user").val()
                let end_date = jQuery("#end_date_user").val()

                data.start_date = start_date
                data.end_date = end_date
                data.user_id = user_id
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
            { data: "username", orderable: false },
            { data: "nama_depan", orderable: false },
            { data: "nama_belakang", orderable: false },
            { data: "email", orderable: false },
            { data: "tempat_lahir", orderable: false },
            { data: "jenis_kelamin", orderable: false },
            { data: "id", orderable: false }
        ],
        columnDefs: [
            {
                targets     : 6,
                createdCell : (td, cellData, rowData, row, col) => {
                    if (cellData == 'l') jQuery(td).html(`<span>Laki-laki</span>`)
                    else if (cellData == 'p') jQuery(td).html(`<span>Perempuan</span>`);
                    else jQuery(td).html(`<span></span>`);
                }
            },
            {
                targets     : 7,
                createdCell : (td, cellData, rowData, row, col) => {
                    jQuery(td).html(`<center>
                    <a href='/user/edit/${cellData}' 
                    class='btn btn-success btn-sm
                    data-toggle='tooltip' data-placement='top' title='Edit User'>
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
                    <a href='#' class='btn btn-danger btn-sm deleteUser'
                    data-id=` + cellData + ` data-toggle='modal' data-target='
                    deleteUser' data-toggle='tooltip' data-placement='top' title='Hapus User'>
                    <i class="ace-icon fa fa-trash-o bigger-130" aria-hidden="true"></i></a>
                    </center>`);
                }
            }
        ]
    });
    jQuery("#buttonFilterUser").click(() => {
        myTable.draw()
    });
})