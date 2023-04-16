jQuery("#formAddBarang").submit(function(e){
    e.preventDefault()

    var form = $("formAddBarang")[0]
    var formData = new FormData(form)
    formData.append("files", $("input[type=file]")[0].files[0])
    formData.append("kode_barang", $("#kode_barang").val())
    formData.append("nama_barang", $("#nama_barang").val())
    formData.append("harga", $("#harga").val())
    formData.append("harga_jual", $("#harga_jual").val())
    formData.append("keterangan", $("#keterangan").val())
    formData.append("kategori_id", $("#kategori_id").val())
    formData.append("tanggal_input", $("#tanggal_input").val())
    
    $.ajax({
      url: "/master_data/add",
      method: "post",
      data: formData,
      processData: false,
      contentType: false,
      success: function (result) {
        if (result.error) {
            Swal.fire({ icon: 'error', title: result.error })
        } else {
            Swal.fire({ icon: 'success', title: result.data.message })
            setTimeout(function (){
                window.location.href = '/master_data'
            }, 2000)
        }
      }
    })
})