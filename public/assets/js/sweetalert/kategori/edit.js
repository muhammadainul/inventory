jQuery("#formUpdateKategori").submit(function(e){
    e.preventDefault()

    var formData = {
        kategori_id: $("#id").val(),
        kategori: $("#kategori").val(),
        deskripsi: $("#deskripsi").val()
    }
    
    $.ajax({
      url: "/kategori/update",
      method: "post",
      data: formData,
      success: function (result) {
        if (result.status == 400) {
            Swal.fire({ icon: 'error', title: result.data.message })
        } else {
            Swal.fire({ icon: 'success', title: result.data.message })
            setTimeout(function (){
                window.location.href = '/kategori'
            }, 2000)
        }
      }
    })
})