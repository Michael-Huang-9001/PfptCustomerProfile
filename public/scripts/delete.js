function delete_customer(customer_name) {

    if (confirm("Delete entry for " + customer_name + "?")) {
        $.ajax({
            type: 'POST',
            timeout: 3000,
            url: "/index/" + customer_name + "?_method=DELETE",
            data: {},
            success: function () {
                alert("Customer " + customer_name + " deleted.");
                location.href = "/index";
            },
            error: function () {
                alert("Error deleting customer " + customer_name);
            }
        });
    }
}