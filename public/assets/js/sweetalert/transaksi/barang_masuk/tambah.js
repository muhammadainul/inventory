jQuery("#formAddBarangMasuk").submit(function(e){
    e.preventDefault()

    var formData = {
        barang_id: $("#barang_id").val(),
        jumlah: $("#jumlah").val(),
        tanggal_input: $("#tanggal_input").val(),
    }
    
    $.ajax({
      url: "/transaksi/barang_masuk/add",
      method: "post",
      data: formData,
      success: function (result) {
        if (result.status == 400) {
            Swal.fire({ icon: 'error', title: result.error })
        } else {
            Swal.fire({ icon: 'success', title: result.data.message })
            setTimeout(function (){
                window.location.href = '/transaksi/barang_masuk'
            }, 2000)
        }
      }
    })
})