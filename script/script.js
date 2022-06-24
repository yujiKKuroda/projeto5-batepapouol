// Objeto que representa o usuário
let pessoa = {
    nome: ""
}

// Função que pede o nome do usuário e confere se ele já está na sala
function iniciar() {
    pessoa.nome = prompt("Digite o seu nome");
    console.log(pessoa.nome);
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
function entrarSala(pessoa) {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(botarMensagens);
}

function botarMensagens(msg) {
    let menu = document.querySelector(".menu");
    menu.innerHTML = "";
    for (let i = 0; i < msg.length; i++) {
        switch (msg[i].type) {
            case "status":
                menu.innerHTML += `
                <div class="mensagem">
                    <div class="entrada">
                        <div class="horario">(${msg[i].time})</div> <b>${msg[i].from}</b> ${msg[i].text}
                    </div>
                </div>
                `;
                break;
            default:
                break;
        }
    }
}


iniciar();