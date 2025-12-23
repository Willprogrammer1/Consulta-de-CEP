/* ================= MAPA ================= */

const map = L.map('mapa').setView([-19.9245, -43.9352], 13); // Brasil inicial

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let marcador;

/* ================= CEP ================= */

function buscarCep() {
    let cep = document.getElementById('cep').value;
    cep = cep.replace(/\D/g, '');

    if (cep.length !== 8) {
        document.getElementById('resultado').textContent =
            "Digite um CEP válido.";
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {

            if (data.erro) {
                document.getElementById('resultado').textContent =
                    "CEP inválido ou genérico.";
                return;
            }

            document.getElementById('resultado').innerHTML =
                `<b>${data.logradouro}</b><br>
                 ${data.bairro}<br>
                 ${data.localidade} - ${data.uf}`;

            let endereco =
                `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brasil`;

            buscarLocalizacao(endereco);
        });
}

/* ================= GEOLOCALIZAÇÃO ================= */

function buscarLocalizacao(endereco) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`)
        .then(res => res.json())
        .then(loc => {
            if (!loc.length) return;

            const lat = loc[0].lat;
            const lon = loc[0].lon;

            map.setView([lat, lon], 17);

            if (marcador) map.removeLayer(marcador);

            marcador = L.marker([lat, lon]).addTo(map);
        });
}

/* ================= PAINEL ARRASTÁVEL ================= */

const painel = document.getElementById("painel");
const titulo = painel.querySelector(".titulo");

let arrastando = false;
let offsetX, offsetY;

titulo.addEventListener("mousedown", e => {
    arrastando = true;
    offsetX = e.clientX - painel.offsetLeft;
    offsetY = e.clientY - painel.offsetTop;
});

document.addEventListener("mousemove", e => {
    if (!arrastando) return;

    painel.style.left = (e.clientX - offsetX) + "px";
    painel.style.top = (e.clientY - offsetY) + "px";
    painel.style.transform = "none";
});

document.addEventListener("mouseup", () => {
    arrastando = false;
});
