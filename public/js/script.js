function showInforTable() {
    var x = document.getElementById("InforTable");
    
    if (x.style.display === "none") {
        $("#InforTable").slideDown();
        $("#chevron-sight").removeClass("fa fa-chevron-right").addClass("fa fa-chevron-down");

    } else {
        $("#InforTable").slideUp();
        $("#chevron-sight").removeClass("fa fa-chevron-down").addClass("fa fa-chevron-right");
    }
}