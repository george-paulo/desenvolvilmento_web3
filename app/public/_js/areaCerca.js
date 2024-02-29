function calcularArea() {
  
    let inputNome = document.querySelector('[name=nome]');
    let nome = inputNome.value;
    let inputLado = document.querySelector('[name=lado]');
    let lado = parseFloat(inputLado.value);
    
    inserir({ 
        nome, lado 
    });
    listar();
}

let traducoes = {
    'pt-BR': {
        'senha_em_branco': 'A senha não pode ser em branco!',
        'cerca_cadastrada': 'Cerca cadastrada com sucesso!',
        'cerca_apagada': 'Cerca apagada com sucesso!'
    },
    'en': {
        'senha_em_branco': 'Password cannot be empty!'
    }
};

async function inserir(triacontagono) {
    console.log('Inserindo', triacontagono);
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams(triacontagono);
    console.log(dados);
    let resposta = await fetch('/triacontagono', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },   
        body: dados
    });
    
    if (resposta.status === 200) {
        divResposta.classList.add('padrao');
        divResposta.classList.remove('npadrao');
    } else {
        divResposta.classList.add('npadrao');
        divResposta.classList.remove('padrao');
    }
    
    let respostaJson = await resposta.json();
    let mensagem = respostaJson.mensagem;
    divResposta.innerText = traducoes['pt-BR'][mensagem];
}

async function listar() {
    let divTriacontagono = document.querySelector('#triacontagono');
    divTriacontagono.innerText = 'Carregando...';
    let resposta = await fetch('triacontagono');
    let triacontagono = await resposta.json();
    console.log('ERRO JSON') 
    divTriacontagono.innerHTML = '';
    
    for (let Triacontagono of Triacontagono) {
        let linha = document.createElement('tr');
        let colunaId = document.createElement('td');
        let colunaNome = document.createElement('td');
        let colunaLado = document.createElement('td');
        let colunaAcoes = document.createElement('td');
        let botaoEditar = document.createElement('button');
        let botaoApagar = document.createElement('button');
        
        colunaId.innerText = Triacontagono.id;
        colunaNome.innerText = Triacontagono.nome;
        colunaLado.innerText = Triacontagono.lado;
        
        botaoEditar.innerText = 'Editar';
        botaoEditar.onclick = function () {
            editar(Triacontagono.id);
        };
        
        botaoApagar.onclick = function () {
            apagar(Triacontagono.id);
        };
        botaoApagar.innerText = 'Apagar';
        
        linha.appendChild(colunaId);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaLado);
        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoApagar);
        linha.appendChild(colunaAcoes);
        divTriacontagono.appendChild(linha);
    }
 }

async function editar(id) {
    alert('Editar #' + id);
}

async function apagar(id) {
    let divResposta = document.querySelector('#resposta');
    
    if (confirm('Quer apagar o #' + id + '?')) {
        let resposta = await fetch('/triacontagono/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        
        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
        await listar();
    }
}
