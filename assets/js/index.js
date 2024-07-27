const btn = document.getElementById("hamIcon");
const navHam = document.getElementById("hamList")
btn.addEventListener("click",function () {
    navHam.classList.toggle("show")
})