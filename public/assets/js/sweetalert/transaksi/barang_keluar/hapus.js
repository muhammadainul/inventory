jQuery(document).on('click', '.deleteBarangKeluar', function() {
    let formData = {
        id: jQuery(this).attr("data-id"),
        jumlah: jQuery(this).attr("data-total"),
        barang_id: jQuery(this).attr("data-barang")
    }
    Swal.fire({ 
        icon: 'question',
        title: 'Apakah anda yakin ingin menghapus data ini?',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Ya",
        cancelButtonText: "Kembali",
        closeOnConfirm: false,
        closeOnCancel: false,
        preConfirm: function () {
            $.ajax({
                url: "/transaksi/barang_keluar/delete",
                method: "post",
                data: formData,
                success: function (result) {
                    if (result.status == 400) {
                        Swal.fire({ icon: 'error', title: result.data.message })
                    } else {
                        Swal.fire({ icon: 'success', title: result.data.message })
                        setTimeout(function (){
                            window.location.href = '/transaksi/barang_keluar'
                        }, 2000)
                    }
                }
            })
        },
        allowOutsideClick: false 
    })
});