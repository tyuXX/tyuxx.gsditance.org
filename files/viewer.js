const iframe = document.getElementById("page");
iframe.src = new URLSearchParams(window.location.search).get("render") || "./files/placeholder.html";

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = './'
});

document.getElementById("tab-btn").addEventListener("click", () => {
    window.open(iframe.src, "_blank");
});