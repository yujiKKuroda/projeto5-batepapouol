let ultimaMensagem = "";

// Objeto que representa o usuário
let pessoa = {
    name: ""
}

// Função que pede o nome do usuário e confere se ele já está na sala
function iniciar() {
    pessoa.name = prompt("Digite o seu nome");
    const usuario = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', pessoa);
    usuario.then(entrarSala);
    usuario.catch(naoEntrar);
}

//Função que avisa caso um usuário com o mesmo nome já exista e pede outro nome
function naoEntrar(erro) {
    if (erro.response.status === 400) {
        alert(`Erro ${erro.response.status}: este usuário já está na sala! Por favor, digite outro nome.`);
    }
    iniciar();
}

// Função que deixa o usuário entrar na sala
function entrarSala() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(botarMensagens);
}

//Função que avisa caso um usuário com o mesmo nome já exista e pede outro nome
function sair() {
    alert("Sessão expirada! Por favor logue novamente!");
    window.location.reload();
}

function botarMensagens(msg) {
    let menu = document.querySelector(".menu");
    menu.innerHTML = "";
    quantidadeMensagens = msg.data.length;
    for (let i = 0; i < quantidadeMensagens; i++) {
        switch (msg.data[i].type) {
            case "status":
                menu.innerHTML += `
                    <div class="mensagem">
                        <div class="entrada">
                            <p><div class="horario">(${msg.data[i].time})</div> <b>${msg.data[i].from}</b> ${msg.data[i].text}</p>
                        </div>
                    </div>
                    `;
                break;
            case "message":
                menu.innerHTML += `
                    <div class="mensagem">
                        <div class="normal">
                            <p><div class="horario">(${msg.data[i].time})</div> <b>${msg.data[i].from}</b> para <b>${msg.data[i].to}</b>: ${msg.data[i].text}</p>
                    </div>
                    `;
                break;
            case "private_message":
                if (pessoa.name === msg.data[i].to) {
                    menu.innerHTML += `
                        <div class="mensagem">
                            <div class="reservada">
                                <p><div class="horario">(${msg.data[i].time})</div> <b>${msg.data[i].from}</b> reservadamente para <b>${msg.data[i].to}</b>: ${msg.data[i].text}</p>
                            </div>
                        </div>
                        `;
                }
                break;
            default:
                break;
        }
    }
    const todasMensagens = document.querySelectorAll(".mensagem");
    console.log(todasMensagens[todasMensagens.length - 1].innerHTML);
    if (ultimaMensagem !== todasMensagens[todasMensagens.length - 1].innerHTML) {
        ultimaMensagem = todasMensagens[todasMensagens.length - 1].innerHTML;
        todasMensagens[todasMensagens.length - 1].scrollIntoView();
    }
}

function enviarMensagem() {
    let mensagem = document.getElementById("msg").value;
    if (mensagem !== "") {
        let envio = {
            from: pessoa.name,
            to: "Todos",
            text: mensagem,
            type: "message"
        };
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', envio);
        promise.then(botarMensagens);
        promise.catch(sair);
    }
}

function manterConectado() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', pessoa);
    promise.then();
    promise.catch(sair);
}

function atualizarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(botarMensagens);
    promise.catch(sair);
}

iniciar();
const online = setInterval(manterConectado, 5000);
const atualizado = setInterval(atualizarMensagens, 3000);