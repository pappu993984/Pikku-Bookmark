function toggleDark() {
  document.body.classList.toggle("dark");
}

function closePopup() {
  document.getElementById("popup").classList.remove("show");
  document.getElementById("blurBg").classList.remove("show");

  document.body.style.overflow = "auto"; // scroll ON
}

window.onload = function() {
  setTimeout(() => {
    document.getElementById("popup").classList.add("show");
    document.getElementById("blurBg").classList.add("show");

    document.body.style.overflow = "hidden"; // scroll OFF
  }, 800);
};