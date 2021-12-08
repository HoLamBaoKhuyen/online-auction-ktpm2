function displayMenu() {
  var x = document.getElementById("adminMenu");
  var y = document.getElementById("adminContent");
  console.log(x.style.display);
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
  } else {
    x.style.display = "none";
    y.style.display = "block";
  }
}
