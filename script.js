function toggleDark() {
  document.body.classList.toggle("dark");
}

function closePopup() {
  document.getElementById("popup").classList.remove("show");
  document.body.classList.remove("blur");
}

window.onload = function() {
  setTimeout(() => {
    document.getElementById("popup").classList.add("show");
    document.body.classList.add("blur");
  }, 800);
};