// VERIFICA PERMISSÃO DO SETOR COZINHA
function verificarPermissao(perfilPermitido) {

  // LIBERA ADMINISTRADOR EM QUALQUER SETOR DE FORMA DIRETA
  if (localStorage.getItem("adminLogado") === "true") {
      return true;
  }

  // CONTINUA O FLUXO NORMAL DE AUTENTICACAO CASO SEJA COLABORADOR
  const sessao = obterSessaoColaborador();

  if (!sessao) {
      alert("Faça login para acessar o sistema.");
      redirecionarParaLogin();
      return false;
  }

  if (sessao.perfil !== perfilPermitido) {
      alert("Você não possui permissão para acessar esta área.");
      redirecionarParaLogin();
      return false;
  }
  return true;
}

// INICIALIZA OS DADOS DA TELA DA COZINHA E CONFIGURA A ATUALIZAÇÃO AUTOMÁTICA
document.addEventListener("DOMContentLoaded", () => {
  carregarDisponibilidade();
  carregarPedidos();
  
  // EXECUTA A ATUALIZACAO CRONOMETRADA PARA MANTER O CORRELAÇÃO DE DADOS EM TEMPO REAL
  setInterval(() => {
    carregarDisponibilidade();
    carregarPedidos();
  }, 3000);
});

// FILTRA E EXIBE NA TELA TODOS OS PEDIDOS DESTINADOS AO PREPARO NA COZINHA
function carregarPedidos() {
  const lista = document.getElementById("listaCozinha");

  if (!lista) return;
  const pedidos = buscarPedidos();
  lista.innerHTML = "";
  
  // FILTRA OS COMPONENTES QUE ESTAO DESIGNADOS ATUALMENTE PARA O FLUXO DA COZINHA
  const cozinha = pedidos.filter((p) => p.setor === "Cozinha");

  if (cozinha.length === 0) {
    lista.innerHTML = `
      <div class="semPedidos">
          Nenhum pedido aguardando preparo.
      </div>
    `;
    return;
  }

  // PERCORRE A FILA AJUSTANDO AS CORES DAS BORDAS BASEADO NAS ETAPAS OPERACIONAIS
  cozinha.forEach((pedido) => {
    let cor = "#999";

    if (pedido.status === "Entregue") {
      cor = "#28a745";
    }

    if (pedido.status === "Cancelado") {
      cor = "#dc3545";
    }

    let itens = "";
    if (pedido.itens) {
      pedido.itens.forEach((item) => {
        itens += `<li>${item.quantidade}x ${item.nome}</li>`;
      });
    }

    const formaPagamento =
      pedido.pagamento && pedido.pagamento.forma
        ? pedido.pagamento.forma
        : "Definir no balcão";
    const totalPedido =
      pedido.pagamento && pedido.pagamento.total ? pedido.pagamento.total : (pedido.total || 0);

    // RECUPERA O CEP CADASTRA OU EMITE EM TEXTO CASO NAO ENCONTRE CHAVE CORRETA
    const cepTexto = pedido.cep || localStorage.getItem("cep") || "Não informado";
    const tipoEntregaNormalizado = pedido.tipoEntrega
      ? pedido.tipoEntrega.toLowerCase().trim()
      : "";

    // INJETA O CODIGO HTML DINAMICO DOS CARDS DE FILA DE ALIMENTOS
    lista.innerHTML += `
    <div class="card-pedido" style="border-left:8px solid ${cor};">
            <h2>Pedido #${pedido.id}</h2>
            <p><strong>Data/Hora:</strong> ${pedido.data || "Sem data"}</p>
            <p><strong>Cliente:</strong> ${pedido.cliente || "-"}</p>
            <p><strong>Entrega:</strong> ${pedido.tipoEntrega || "-"}</p>
            
            ${
              tipoEntregaNormalizado === "entrega"
                ? `
                <p><strong>Endereço:</strong> ${pedido.endereco || pedido.enderecoCliente || "Não informado"}</p>
                <p><strong>CEP:</strong> ${cepTexto}</p>
                `
                : ""
            }
            
            <p><strong>Pagamento:</strong> ${formaPagamento}</p>
            <p><strong>Status:</strong> <span class="status">${pedido.status}</span></p>

            <ul style="list-style-type: none; padding-left: 0; margin: 8px 0;">
                ${itens}
            </ul>

            <h3 style="font-size: 16px; margin: 10px 0;">
                Total: R$ ${totalPedido.toFixed(2).replace(".", ",")}
            </h3>

            <!-- AJUSTE ESTRUTURAL: Agrupa botões para caberem no grid de 4 por linha sem esmagar -->
            <div style="display: flex; flex-direction: column; gap: 6px; width: 100%; margin-top: auto;">
                ${
                  pedido.status === "Recebido"
                    ? `
                      <button style="width: 100%; margin-top: 0;" onclick="iniciar(${pedido.id})">
                          Iniciar Preparo
                      </button>
                      <button
                          style="width: 100%; margin-top: 0; background:red; color:white;"
                          onclick="cancelar(${pedido.id})">
                           Cancelar 
                      </button>
                    `
                    : ""
                }
                
                ${
                  pedido.status === "Preparando"
                    ? `
                      <button
                          style="width: 100%; margin-top: 0; background:green; color:white;"
                          onclick="pronto(${pedido.id})">
                          Pedido Pronto
                      </button>
                    `
                    : ""
                }
            </div>
        </div>
        `;
  });
}

// ALTERA O STATUS DO PEDIDO PARA PREPARANDO E EMITE UM TOAST DE INFORMAÇÃO NA COZINHA
function iniciar(id) {
  const pedido = buscarPedido(id);

  if (!pedido || pedido.status === "Cancelado") {
    erro("Este pedido foi cancelado ou não existe.");
    return;
  }

  // TRANSMITE O PEDIDO DE ETAPA ATUALIZANDO AS CHAVES E DISPARA ALERTA VISUAL NO TOAST
  atualizarStatus(id, "Preparando");
  info(`Pedido #${id} entrou em preparação!`);
  carregarPedidos();
}

// MODIFICA O STATUS DO PEDIDO PARA CANCELADO E O ENCAMINHA DIRETAMENTE PARA O HISTÓRICO
function cancelar(id) {
  const pedido = buscarPedido(id);

  if (!pedido) {
    erro("Pedido não encontrado.");
    return;
  }

  // INTERROMPE A OPERAÇÃO ENCAMINHANDO OS METADADOS DIRETAMENTE PARA EXPURGO OPERACIONAL
  atualizarStatus(id, "Cancelado");
  atualizarSetor(id, "Historico");

  // NOTIFICA COM SUCESSO A EXCLUSAO ATRAVES DO NOSSO CONTAINER DE ALERTAS
  sucesso(`Pedido #${id} cancelado com sucesso!`);
  carregarPedidos();
}

// DIRECIONA O PEDIDO FINALIZADO PARA O SETOR DE ENTREGA OU DE VOLTA AO ATENDENTE NO BALCÃO
function pronto(id) {
  const pedido = buscarPedido(id);

  if (!pedido) {
    erro("Pedido não encontrado.");
    return;
  }

  console.log("Tipo de entrega:", pedido.tipoEntrega);
  const tipoEntrega = (pedido.tipoEntrega || "").toLowerCase().trim();

  // VERIFICA SE A ROTA CONDIZ COM DESPACHO LOGISTICO OU SE RETORNA DISPONIVEL PARA BALCAO
  if (tipoEntrega === "entrega") {
    atualizarStatus(id, "Saiu para entrega");
    atualizarSetor(id, "Entrega");
    info(`Pedido #${id} enviado para o setor de Entrega!`);
  } else {
    // DEVOLVE O PEDIDO AO ATENDENTE COM STATUS PRONTO PARA QUE ELE CONFIRME A ENTREGA FÍSICA E DÊ AS MOEDAS
    atualizarStatus(id, "Pronto para retirada");
    atualizarSetor(id, "Atendente");
    sucesso(`Pedido #${id} enviado para o Balcão do Atendente!`);
  }

  carregarPedidos();
}

const CHAVE_PRODUTOS = "produtosRaizes";

// MONITORA E RENDERIZA A LISTA DE DISPONIBILIDADE DOS ITENS DO CARDÁPIO NA TELA DA COZINHA
function carregarDisponibilidade() {
  const lista = document.getElementById("listaDisponibilidade");

  if (!lista) return;
  const produtos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS)) || [];
  lista.innerHTML = "";
  
  // PERCORRE O CATALOGO ALTERNANDO DINAMICAMENTE OS BOTOES E ICONES DE ALERTA DE FLUXO
  produtos.forEach((produto) => {
    const cor = produto.disponivel ? "#28a745" : "#dc3545";
    const corBotao = produto.disponivel ? "#dc3545" : "#28a745";
    const texto = produto.disponivel ? "Indisponível" : "Disponível";
    lista.innerHTML += `
    <div class="produtoDisponibilidade" style="border-left:8px solid ${cor};">
        <span>
            ${produto.disponivel ? "🟢" : "🔴"}
            ${produto.nome}
        </span>
        <button
            style="background:${corBotao};color:white"
            onclick="alterarDisponibilidade('${produto.id}')">
            ${texto}
        </button>
    </div>
    `;
  });
}

// ALTERNA O ESTADO ATUAL DE DISPONIBILIDADE DO ITEM SELECIONADO NO LOCALSTORAGE
function alterarDisponibilidade(id) {
  const produtos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS)) || [];
  const produto = produtos.find((p) => String(p.id) === String(id));

  if (!produto) return;
  
  // INVERTE A FLAG LOGICA DO PRODUTO E GRAVA REFRESCANDO OS COMPONENTES NA TELA
  produto.disponivel = !produto.disponivel;
  localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
  carregarDisponibilidade();
}
