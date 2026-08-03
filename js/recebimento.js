// CONFIGURAÇÕES DO SISTEMA
const CONFIG = {
  TAXA_FIXA: 3,
  VALOR_KM: 2,
  LIMITE_KM: 10,
  RESTAURANTE: "Raízes do Nordeste",
  ENDERECO: "Rua Rosa Clara, 70 - Cohab - Recife/PE",
};

// ELEMENTOS DA PÁGINA CAPTURADOS DO DOM PARA MANIPULACAO DE LOGISTICA E ENDEREÇO
const opcoesEntrega = document.querySelectorAll('input[name="tipoEntrega"]');
const dadosEntrega = document.getElementById("dadosEntrega");
const cep = document.getElementById("cep");
const rua = document.getElementById("rua");
const bairro = document.getElementById("bairro");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");
const numero = document.getElementById("numero");
const complemento = document.getElementById("complemento");
const distanciaCalculadaEl = document.getElementById("distanciaCalculada");
const taxaEntregaEl = document.getElementById("taxaEntrega");
const txtDistanciaEl = document.getElementById("txtDistancia");
const totalPedidoEl = document.getElementById("totalPedido");
const btnCalcular = document.getElementById("btnCalcular");
const btnContinuar = document.getElementById("btnContinuar");

// DADOS DO CARRINHO RECOLETADOS FINANCEIRAMENTE DA MEMORIA LOCAL WITH PARSE DE CONVERSAO DO FLOAT
const subtotal = parseFloat(localStorage.getItem("totalCompra")) || 0;

let tipoEntrega = "retirada";
let distanciaKm = 0;
let taxaEntrega = 0;

// ESCUTA A MUDANÇA DA FORMA DE RECEBIMENTO PARA EXIBIR OU OCULTAR O FORMULÁRIO DE ENDEREÇO E SALVAR O PREÇO ZERADO EM CASO DE RETIRADA
opcoesEntrega.forEach((opcao) => {
  opcao.addEventListener("change", () => {
    if (opcao.value === "retirada") {
      dadosEntrega.style.display = "none";
      tipoEntrega = "Retirada";
      distanciaKm = 0;
      taxaEntrega = 0;
      atualizarTela();
      localStorage.setItem("tipoEntrega", tipoEntrega);
      localStorage.setItem("taxaEntrega", taxaEntrega);
    } else {
      dadosEntrega.style.display = "block";
      tipoEntrega = "Entrega";
    }
  });
});

// COMEÇA ESCONDIDO O FORMULARIO DE DESPACHO PARA FORÇAR SELEÇÃO DO OPERADOR
dadosEntrega.style.display = "none";

// VIA CEP (AUTO PREENCHIMENTO ATRAVÉS DO CONSUMO INTEGRADO DE API EXTERNA NO METODO BLUR)
cep.addEventListener("blur", () => {
  const valor = cep.value.replace(/\D/g, "");

  if (valor.length !== 8) return;
  fetch(`https://viacep.com.br{valor}/json/`)
    .then((res) => res.json())
    .then((dados) => {
      // TRATAMENTO RESTRITO CASO A ENTRADA RECONHEÇA UM CEP INEXISTENTE NA BASE NACIONAL
      if (dados.erro) {
        aviso("CEP não encontrado.");
        return;
      }

      // INJETA AS INFORMACOES DE LOCALIDADE RETORNADAS DIRETAMENTE NOS INPUTS DA TELA
      rua.value = dados.logradouro;
      bairro.value = dados.bairro;
      cidade.value = dados.localidade;
      estado.value = dados.uf;
    });
});

/// CALCULA A DISTÂNCIA AUTOMATICAMENTE PELO CEP DE ACORDO COM AS REGRAS E SIMULAÇÕES DO SITE
btnCalcular.addEventListener("click", () => {
 const cepCliente = cep.value.replace(/\D/g, "");

  if (cepCliente.length !== 8) {
    aviso("Informe um CEP válido.");
    return;
  }
  let km = 0;

  // CEPs DE TESTE ACADÊMICO
  if (cepCliente === "50000000") {
    km = 5;
  }

  else if (cepCliente === "51000000") {
    km = 8;
  }

  else if (cepCliente === "52000000") {
    km = 12;
  }

  else {
    // DISTÂNCIA PADRAO FICTICIA RESTRITA PARA TESTES GERAIS DA TELA
    km = 10;
  }

  // TRAVA RESTRITA LOGISTICA QUE REJEITA CASO A KM EXCEDA O LIMITE ESTABELECIDO NAS CONFIGURAÇÕES
  if (km > CONFIG.LIMITE_KM) {
    aviso("Este endereço está fora da área de entrega (máximo 10 km).");
    distanciaKm = 0;
    taxaEntrega = 0;
    atualizarTela();
    return;
  }

  // COMPUTA VISUALMENTE OS PREÇOS E ATUALIZA AS GRAVAÇÕES NO LOCALSTORAGE
  distanciaKm = km;
  taxaEntrega =
    CONFIG.TAXA_FIXA + km * CONFIG.VALOR_KM;
  atualizarTela();
  localStorage.setItem("distancia", distanciaKm);
  localStorage.setItem("taxaEntrega", taxaEntrega);
  localStorage.setItem("tipoEntrega", tipoEntrega);
});

// ATUALIZA VISUALMENTE OS TEXTOS DE DISTÂNCIA, FRETE E VALOR TOTAL SOMADO COM O SUBTOTAL DO CARRINHO NA INTERFACE DO USUÁRIO
function atualizarTela() {
  txtDistanciaEl.textContent = distanciaKm + " km";

  if(distanciaCalculadaEl){
    distanciaCalculadaEl.textContent = distanciaKm + " km";
  }
  taxaEntregaEl.textContent = "R$ " + taxaEntrega.toFixed(2);
  totalPedidoEl.textContent = "R$ " + (subtotal + taxaEntrega).toFixed(2);
}

// EXECUÇÃO INICIAL INVERTIDA PARA RENDERIZAR OS COMPONENTES DA TELA DE IMEDIATO
atualizarTela();

// SOMA OS DADOS E DIRECIONA O USUARIO SEGURO PARA ENTRAR NO FECHAMENTO DE LIQUIDACAO FINANCEIRA
btnContinuar.addEventListener("click", () => {
  localStorage.setItem("totalFinal", (subtotal + taxaEntrega).toFixed(2));
  window.location.href = "pagamento.html";
});


// GARANTE O EMAIL MAPEADO NAS DUAS PROPRIEDADES USADASPELAS TELAS DE ENTREGA
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const emailClienteIdentificador = usuarioLogado?.email || localStorage.getItem("emailClienteLogado") || "";

const pedido = {
  id: Date.now(),
  
  // FORÇA O EMAIL NAS DUAS VAREÁVEIS PARA O PAINEL DE ENTREGA SER SEM FALHAS
  clienteEmail: emailClienteIdentificador,
  emailCliente: emailClienteIdentificador,
  
  data: new Date().toLocaleString(),
  status: "Recebido",
  setor: "Cozinha", 
  tipoEntrega: tipoEntrega,
  cliente: {
    nome: usuarioLogado?.nome || localStorage.getItem("nome") || "Cliente",
    telefone: usuarioLogado?.telefone || localStorage.getItem("telefone") || "",
  },

  endereco: {
    rua: rua?.value || "",
    numero: numero?.value || "",
    bairro: bairro?.value || "",
    cidade: city => cidade?.value || "",
    estado: estado?.value || "",
    complemento: complemento?.value || "",
  },
  itens: JSON.parse(localStorage.getItem("carrinho")) || [],
  pagamento: {
    forma: "",
    total: (subtotal + taxaEntrega),
  },
};

