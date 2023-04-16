jQuery("#formUpdateUser").submit(function(e){
    e.preventDefault()

    let row;
    if ($("#enabled").prop("checked") == true ) {
        row = 1
    } else if ($("#enabled").prop("checked") == false) {
        row = 0
    }

    var formData = {
        user_id: $("#id").val(),
        username: $("#username").val(),
        nama_depan: $("#nama_depan").val(),
        nama_belakang: $("#nama_belakang").val(),
        email: $("#email").val(),
        ttl: $("#ttl").val(),
        jenis_kelamin: $("#jenis_kelamin").val(),
        enabled: row
    }
    
    $.ajax({
      url: "/user/update",
      method: "post",
      data: formData,
      success: function (result) {
        if (result.status == 400) {
            Swal.fire({ icon: 'error', title: result.error })
        } else {
            Swal.fire({ icon: 'success', title: result.data.message })
            setTimeout(function (){
                window.location.href = '/user'
            }, 2000)
        }
      }
    })
})