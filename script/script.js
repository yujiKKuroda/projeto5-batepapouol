// Objeto que representa o usuário
let pessoa = {
    name: ""
}

// Função que pede o nome do usuário e confere se ele já está na sala
function iniciar() {
    pessoa.name = prompt("Digite o seu nome");
    console.log(pessoa.name);
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
                        <p><div class="horario">(${msg[i].time})</div> <div>${msg[i].from}</b> ${msg[i].text}</p>
                    </div>
                </div>
                `;
                break;
            case "message":
                menu.innerHTML += `
                <div class="mensagem">
                    <div class="normal">
                        <p><div class="horario">(${msg[i].time})</div> <b>${msg[i].from}</b> para <b>${msg[i].to}</b>: ${msg[i].text}</p>
                </div>
                `;
                break;
            case "private_message":
                if (pessoa.nome === msg[i].to) {
                    menu.innerHTML += `
                    <div class="mensagem">
                        <div class="reservada">
                            <p><div class="horario">(${msg[i].time})</div> <b>${msg[i].from}</b> reservadamente para <b>${msg[i].to}</b>: ${msg[i].text}</p>
                        </div>
                    </div>
                    `;
                }                
                break;
            default:
                break;
        }
    }
}


iniciar();