// VERIFICA SE O USUÁRIO TEM PERMISSÃO PARA ACESSAR A ENTREGA
function verificarPermissao(perfilPermitido) {

  // LIBERA ADMINISTRADOR EM QUALQUER SETOR DE FORMA DIRETA E AUTOMATICA
  if (localStorage.getItem("adminLogado") === "true") {
      return true;
  }

  // CONTINUA O FLUXO NORMAL DE VALIDAÇAO CASO SEJA COLABORADOR OPERACIONAL
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

// RENDERIZA A TELA DE ENTREGAS AO CARREGAR A PÁGINA E DETERMINA SEU INTERVALO DE ATUALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  carregarEntrega();

  // ATUALIZAÇÃO AUTOMÁTICA CONSTANTE DO PAINEL DA LOGISTICA DE ENVIOS
  setInterval(carregarEntrega, 3000);
});

// FILTRA, CONTABILIZA E APRESENTA OS PEDIDOS ATIVOS QUE ESTÃO DISPONÍVEIS PARA ENTREGA
function carregarEntrega() {
  const lista = document.getElementById("listaEntrega");
  if (!lista) return;

  const pedidos = typeof buscarPedidos === "function" ? buscarPedidos() : [];
  
  // CONTADORES INDIVIDUAIS DE METRICAS OPERACIONAIS DO FLUXO
  const pendentes = pedidos.filter((p) => p.setor === "Entrega").length;
  const entregues = pedidos.filter((p) => p.status === "Entregue").length;

  // ATUALIZA OS BLOCOS TEXTUAIS DO CABEÇALHO DO DASHBOARD DA OPERACAO
  document.getElementById("pedidosPendentes").textContent = pendentes;
  document.getElementById("pedidosEntregues").textContent = entregues;
  
  const entrega = pedidos.filter((p) => p.setor === "Entrega");

  if (entrega.length === 0) {
    lista.innerHTML = "<p class='semPedidos'>Nenhum pedido pendente para entrega.</p>";
    return;
  }

  let novoHtml = "";
  entrega.forEach((pedido) => {
    let itens = "";
    if (pedido.itens) {
      pedido.itens.forEach((item) => {
        itens += `<li>${item.quantidade}x ${item.nome}</li>`;
      });
    }
    
    const totalPedido = pedido.pagamento && pedido.pagamento.total ? pedido.pagamento.total : (pedido.total || 0);
    const enderecoTexto = pedido.endereco || pedido.enderecoCliente || "Não informado";
    
    // RECUPERA O CEP INFORMADO OU ABRE CHAVE PADRAO NA AUSENCIA DE DADOS
    const cepTexto = pedido.cep || localStorage.getItem("cep") || "Não informado";

    // FORMATAÇÃO E REORGANIZACAO DE DATA E HORA DE CHEGADA DO PEDIDO
    let dataHoraFormatada = "Não informada";
    if (pedido.data) {
      const dataObjeto = new Date(pedido.data);
      if (!isNaN(dataObjeto)) {
        const data = dataObjeto.toLocaleDateString("pt-BR");
        const hora = dataObjeto.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        dataHoraFormatada = `${data} às ${hora}`;
      } else {
        dataHoraFormatada = pedido.data;
      }
    }

    const enderecoSeguro = enderecoTexto
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"');

    // FILTRO DE SEGURANÇA E INTEGRACAO PARA RETORNAR A MODALIDADE FINANCEIRA DO PEDIDO
    const formaPagamento = pedido.pagamento && pedido.pagamento.forma
        ? pedido.pagamento.forma
        : (pedido.tipoPagamento || "Definir no balcão");

    // VALIDACAO COMPORTAMENTAL DO TIPO DE TRANSPORTE
    const tipoEntregaNormalizado = pedido.tipoEntrega ? pedido.tipoEntrega.toLowerCase() : "";

    // INJETA O CODIGO HTML DINAMICO DOS CARDS DE DESPACHO ADICIONANDO TRAVA DE ESCAPE
    novoHtml += `
        <div class="card" data-id="${pedido.id}">
            <h3>Pedido #${pedido.id}</h3>
            <p><strong>Data/Hora:</strong> ${dataHoraFormatada}</p>
            <p><strong>Cliente:</strong> ${pedido.cliente || pedido.nomeCliente || "-"}</p>
            <p><strong>Telefone:</strong> ${pedido.telefone || "-"}</p>
            <p><strong>Entrega:</strong> ${pedido.tipoEntrega || "-"}</p>
            
            ${
              tipoEntregaNormalizado === "entrega"
                ? `
                <p><strong>Endereço:</strong> ${enderecoTexto}</p>
                <p><strong>CEP:</strong> ${cepTexto}</p>
                `
                : ""
            }
            
            <p><strong>Forma de pagamento:</strong> ${formaPagamento}</p>
            <p><strong>Status:</strong> <span class="status">${pedido.status}</span></p>
  
            <ul style="list-style-type: none; padding-left: 0; margin: 8px 0;">
                ${itens}
            </ul>
  
            <h4>
                Total: R$ ${totalPedido.toFixed(2).replace(".", ",")}
            </h4>
  
            <div class="botoes-acao-card">
                ${
                  pedido.status === "Saiu para entrega"
                    ? `<button class="btn-delivered" onclick="entregue(${pedido.id})">Entregue</button>`
                    : `<button class="btn-map" style="background:#e67e22; color:white;" onclick="saiu(${pedido.id})">Saiu para entrega</button>`
                }
                <button class="btn-whatsapp" onclick="whatsapp('${pedido.telefone}')">WhatsApp</button>
                <button class="btn-map" onclick="mapa('${enderecoSeguro}')">Abrir Mapa</button>
            </div>
        </div>
        `;
  });
  lista.innerHTML = novoHtml;
}

// ATUALIZA O STATUS DO PEDIDO INDICANDO QUE FOI DESPACHADO E EXIBE NOTIFICAÇÃO DO PROCESSO
function saiu(id) {
  if (
    typeof atualizarStatus === "function" &&
    typeof atualizarSetor === "function"
  ) {
    // ALTERA AS CHAVES INTERNAS RESTRITAS DE PROGRESSO LOGISTICO
    atualizarStatus(id, "Saiu para entrega");
    atualizarSetor(id, "Entrega");
    
    // NOTIFICA A SAIDA ATRAVES DO TOAST DE INFORMAÇÃO DO ARQUIVO DE ALERTAS
    info(`Pedido #${id} saiu para entrega!`);
    carregarEntrega();
  }
}

// FINALIZA O PEDIDO COMO ENTREGUE, ENCAMINHA PARA O HISTÓRICO E EXIBE ALERTA DE SUCESSO
function entregue(id) {
  if (
    typeof atualizarStatus === "function" &&
    typeof atualizarSetor === "function"
  ) {
    // RECUPERA OS DADOS DO PEDIDO ANTES DE MUDAR O STATUS PARA PEGAR O EMAIL E O VALOR
    const pedido = typeof buscarPedido === "function" ? buscarPedido(id) : null;

    // ARQUIVA O PEDIDO MUDANDO AS VALIDAÇOES PARA HISTORICO DEFINITIVO
    atualizarStatus(id, "Entregue");
    atualizarSetor(id, "Historico");
    
    // DISPARADOR EXCLUSIVO DO PROGRAMA DE FIDELIDADE (APENAS APÓS CONFIRMAÇÃO DA ENTREGA DO DELIVERY)
    if (pedido && pedido.clienteEmail && typeof adicionarMoedasFidelidade === "function") {
      const totalPedido = pedido.pagamento && pedido.pagamento.total ? pedido.pagamento.total : (pedido.total || 0);
      adicionarMoedasFidelidade(pedido.clienteEmail, totalPedido);
    }

    // EXIBE CAPSULA DE SUCESSO DO SISTEMA DE TOAST NOTIFICANDO A CONCLUSÃO
    sucesso(`Pedido #${id} entregue e enviado para o Histórico!`);
    carregarEntrega();
  }
}
