function displayMenu() {
  var x = document.getElementById("adminMenu");
  console.log(x.style.display);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
