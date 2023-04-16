jQuery("#formLogin").submit(function(e){
    e.preventDefault()

    var formData = {
        username: $("#username").val(),
        password: $("#password").val()
    }
    
    $.ajax({
      url: "/user/login",
      method: "post",
      data: formData,
      success: function (result) {
        if (result.status == 400) {
            Swal.fire({ icon: 'error', title: result.data })
        } else {
            Swal.fire({ icon: 'success', title: result.data })
            setTimeout(function (){
                window.location.href = '/user/profile'
            }, 2000)
        }
      }
    })
})