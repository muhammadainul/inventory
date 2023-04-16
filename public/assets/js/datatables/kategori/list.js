jQuery(document).ready(function() {
    var myTable = $('#kategoriTable').DataTable({
        bAutoWidth: false,
        search: true,
        serverSide: true,
        ajax       : {
            type : "POST",
            url  : "/kategori/datatables",
            data : data => {
                // Read values
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
            { data: "kategori", orderable: false },
            { data: "deskripsi", orderable: false },
            { data: "createdAt", orderable: true },
            { data: "id", orderable: false }
        ],
        columnDefs: [
            {
                targets     : 3,
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
            },
            {
                targets     : 4,
                createdCell : (td, cellData, rowData, row, col) => {
                    jQuery(td).html(`<center>
                    <a href='/kategori/edit/${cellData}' 
                    class='btn btn-success btn-sm
                    data-toggle='tooltip' data-placement='top' title='Edit Kategori'>
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
                    <a href='#' class='btn btn-danger btn-sm openDeleteConfirmation'
                    data-id=` + cellData + ` data-toggle='modal' data-target='
                    deleteKategori' data-toggle='tooltip' data-placement='top' title='Hapus Kategori'>
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
    // $.fn.dataTable.Buttons.defaults.dom.container.className = 'dt-buttons btn-overlap btn-group btn-overlap';
    
    // new $.fn.dataTable.Buttons( myTable, {
    //     buttons: [
    //       {
    //         "extend": "colvis",
    //         "text": "<i class='fa fa-search bigger-110 blue'></i> <span class='hidden'>Show/hide columns</span>",
    //         "className": "btn btn-white btn-primary btn-bold",
    //         columns: ':not(:first):not(:last)'
    //       },
    //       {
    //         "extend": "copy",
    //         "text": "<i class='fa fa-copy bigger-110 pink'></i> <span class='hidden'>Copy to clipboard</span>",
    //         "className": "btn btn-white btn-primary btn-bold"
    //       },
    //       {
    //         "extend": "csv",
    //         "text": "<i class='fa fa-database bigger-110 orange'></i> <span class='hidden'>Export to CSV</span>",
    //         "className": "btn btn-white btn-primary btn-bold"
    //       },
    //       {
    //         "extend": "excel",
    //         "text": "<i class='fa fa-file-excel-o bigger-110 green'></i> <span class='hidden'>Export to Excel</span>",
    //         "className": "btn btn-white btn-primary btn-bold"
    //       },
    //       {
    //         "extend": "pdf",
    //         "text": "<i class='fa fa-file-pdf-o bigger-110 red'></i> <span class='hidden'>Export to PDF</span>",
    //         "className": "btn btn-white btn-primary btn-bold"
    //       },
    //       {
    //         "extend": "print",
    //         "text": "<i class='fa fa-print bigger-110 grey'></i> <span class='hidden'>Print</span>",
    //         "className": "btn btn-white btn-primary btn-bold",
    //         autoPrint: false,
    //         message: 'This print was produced using the Print button for DataTables'
    //       }		  
    //     ]
    // } );
    // myTable.buttons().container().appendTo( $('.tableTools-container') );
    
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