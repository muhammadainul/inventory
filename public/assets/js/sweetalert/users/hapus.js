jQuery(document).on('click', '.deleteUser', function() {
    let formData = {
        user_id: jQuery(this).attr("data-id")
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
                url: "/user/delete",
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
        },
        allowOutsideClick: false 
    })
});