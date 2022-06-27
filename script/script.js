// Objeto que representa o usuário
let pessoa = {
    name: ""
}

// Elemento que pega a última mensagem enviada para poder ir até ela depois
let ultimaMensagem = "";

// Variável que recolhe o forms da mensagem
let input = document.getElementById("msg");

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
    window.location.reload();
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

//Função que insere as mensagens na tela
function botarMensagens(msg) {
    let menu = document.querySelector(".menu");
    menu.innerHTML = "";
    quantidadeMensagens = msg.data.length;
    // Loop que define como cada mensagem recebida deve ser inserida de acordo com seu tipo
    for (let i = 0; i < quantidadeMensagens; i++) {
        switch (msg.data[i].type) {
            // Entrada/saída
            case "status":
                menu.innerHTML += `
                    <div class="mensagem">
                        <div class="entrada">
                            <p><div class="horario">(${msg.data[i].time})</div> <b>${msg.data[i].from}</b> ${msg.data[i].text}</p>
                        </div>
                    </div>
                    `;
                break;
            // Mensagem comum
            case "message":
                menu.innerHTML += `
                    <div class="mensagem">
                        <div class="normal">
                            <p><div class="horario">(${msg.data[i].time})</div> <b>${msg.data[i].from}</b> para <b>${msg.data[i].to}</b>: ${msg.data[i].text}</p>
                    </div>
                    `;
                break;
            // Mensagem reservada
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
    // Condicional que confere a última mensagem. Se for nova, move a tela até ela
    const todasMensagens = document.querySelectorAll(".mensagem");
    const ultimaEnviada = todasMensagens[todasMensagens.length - 1]
    if (ultimaMensagem !== ultimaEnviada.innerHTML) {
        ultimaMensagem = ultimaEnviada.innerHTML;
        ultimaEnviada.scrollIntoView();
    }
}

// Função que se comunica com a API para enviar uma mensagem
function enviarMensagem() {
    let mensagem = input.value;
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

// [BÔNUS] Função que habilita a tecla "Enter" para enviar mensagem
input.addEventListener("keypress", function (evento) {
    if (evento.key === "Enter") {
        evento.preventDefault();
        document.getElementById("button").click();
    }
});

// Função que se comunica com a API para manter o usuário conectado
function manterConectado() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', pessoa);
    promise.then();
    promise.catch(sair);
}

// Função que se comunica com a API para atualizar as mensagens recebidas
function atualizarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(botarMensagens);
    promise.catch(sair);
}

// ------------------------------------------------------------------------------------------------
// Script do projeto
iniciar();
const online = setInterval(manterConectado, 5000);
const atualizado = setInterval(atualizarMensagens, 3000);