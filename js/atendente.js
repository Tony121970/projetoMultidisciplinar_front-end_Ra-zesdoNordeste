// VERIFICA SE O USUÁRIO TEM PERMISSÃO PARA ACESSAR O ATENDIMENTO
function verificarPermissao(perfilPermitido) {
  // LIBERA ADMINISTRADOR EM QUALQUER SETOR DE FORMA DIRETA
  if (localStorage.getItem("adminLogado") === "true") {
    return true;
  }

  // CONTINUA O FLUXO NORMAL DE VALIDAÇAO CASO SEJA UM COLABORADOR COMUM
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

// ESCUTA O CARREGAMENTO DO DOM PARA CONFIGURAR AS ROTINAS INTERNAS E CRONOMETROS
document.addEventListener("DOMContentLoaded", () => {
  carregarPedidos();

  // ATUALIZA AUTOMATICAMENTE APENAS SE NÃO ESTIVER MEXENDO NO CAMPO DE PAGAMENTO
  setInterval(() => {
    if (
      !document.activeElement ||
      !document.activeElement.id.startsWith("pagamento-")
    ) {
      carregarPedidos();
    }
  }, 3000);

  // CONFIGURAÇÃO INICIAL E ACIONAMENTO DO MODAL DE NOVO PEDIDO PRESENCIAL
  console.log("ATENDENTE.JS CARREGOU");
  const modal = document.getElementById("modalPedido");
  const btnNovoPedido = document.getElementById("btnNovoPedido");

  // AJUSTE: REMOVIDO ENTRADA REPETIDA E DUPLICADA DE "BTNNOVOPEDIDO.ONCLICK"
  if (btnNovoPedido && modal) {
    console.log("Botão e modal encontrados.");
    btnNovoPedido.onclick = () => {
      console.log("Clique no Novo Pedido.");
      modal.style.display = "flex";
      carregarProdutosPresencial();
    };
  } else {
    console.error("Não encontrou botão ou modal.");
  }

  // ESCUTA O EVENTO DE CLIQUE DO BOTAO X PARA OCULTAR O POPUP
  const fechar = document.getElementById("fecharModal");
  if (fechar) {
    fechar.onclick = fecharModal;
  }

  // ESCUTA O BOTAO DE CANCELAMENTO LIMPA O FORMULARIO E RECOLETA OS DADOS DO CARRINHO
  const cancelar = document.getElementById("cancelarPedido");
  if (cancelar) {
    cancelar.onclick = () => {
      document.getElementById("clientePresencial").value = "";
      document.getElementById("telefonePresencial").value = "";
      document.getElementById("enderecoPresencial").value = "";
      document.getElementById("cepPresencial").value = "";
      document.getElementById("tipoPedido").value = "local";

      // ESVAZIA O CARRINHO E ZERA O TEXTO TOTAL
      carrinhoPresencial = [];
      document.getElementById("totalPresencial").textContent = "R$ 0,00";
      fecharModal();
    };
  }

  // CONTINUAR E SALVAR PEDIDO PRESENCIAL
  const continuar = document.getElementById("continuarPedido");
  if (continuar) {
    continuar.onclick = () => {
      // VALIDAÇÃO SIMPLES DE QUANTIDADE MINIMA DE ITENS NO CARRINHO
      if (carrinhoPresencial.length === 0) {
        aviso("Por favor, adicione pelo menos um produto ao pedido!");
        return;
      }

      // COLETA OS DADOS DOS CAMPOS INTERNOS DO MODAL DE CADASTRO
      const nomeCliente = document
        .getElementById("clientePresencial")
        .value.trim();
      const telefoneCliente = document
        .getElementById("telefonePresencial")
        .value.trim();
      const enderecoCliente = document
        .getElementById("enderecoPresencial")
        .value.trim();
      const cepCliente = document.getElementById("cepPresencial").value.trim();
      const tipoAtendimento = document.getElementById("tipoPedido").value;

      // AGRUPA OS PEDIDOS REPETIDOS DO CARRINHO PARA CALCULAR A QUANTIDADE CORRETA
      const itensAgrupados = [];
      carrinhoPresencial.forEach((prod) => {
        const itemExistente = itensAgrupados.find(
          (item) => item.id === prod.id
        );
        if (itemExistente) {
          itemExistente.quantidade += 1;
        } else {
          itensAgrupados.push({
            id: prod.id,
            nome: prod.nome,
            preco: Number(prod.preco),
            quantidade: 1,
          });
        }
      });

      // CALCULA O MONTANTE FINANCEIRO TOTAL DO PEDIDO
      let valorTotal = 0;
      itensAgrupados.forEach((item) => {
        valorTotal += item.preco * item.quantidade;
      });

      // CAPTURA O INPUT DE EMAIL DO CLIENTE CASO EXISTA NO SEU HTML MODAL
      const inputEmailCliente = document.getElementById("emailClientePresencial");
      const emailCliente = inputEmailCliente ? inputEmailCliente.value.trim() : "";

      // MONTA A ESTRUTURA IDENTICA AO PADRAO DOS PEDIDOS DO SISTEMA central
      const novoPedido = {
        id: Date.now(),
        cliente: nomeCliente || "Consumidor Presencial",
        telefone: telefoneCliente || "Não informado",
        endereco: enderecoCliente || "Não informado",
        cep: cepCliente || "Não informado",
        
        // ALTERAÇÃO CIRÚRGICA: Evita usar o email do admin/atendente logado. Usa o do cliente ou vazio.
        clienteEmail: emailCliente,
        
        tipoEntrega:
          tipoAtendimento === "local"
            ? "Consumo no Local"
            : tipoAtendimento === "retirada"
            ? "Retirada"
            : "Entrega",
        itens: itensAgrupados,
        pagamento: {
          total: valorTotal,
        },
        status: "Recebido",
        setor: "Atendente",
      };

      // REALIZA O ACIONAMENTO E SALVAMENTO SEGURO NA BASE DO NAVEGADOR
      if (typeof salvarNovoPedido === "function") {
        salvarNovoPedido(novoPedido);
        sucesso("Pedido presencial criado com sucesso!");
      } else {
        erro(
          "Erro: A função salvarNovoPedido não foi encontrada no arquivo pedidos.js."
        );
      }

      // LIMPA TOTALMENTE OS DADOS INTERNOS DO FORMULARIO E ESVAZIA A FILA
      document.getElementById("clientePresencial").value = "";
      document.getElementById("telefonePresencial").value = "";
      document.getElementById("enderecoPresencial").value = "";
      document.getElementById("cepPresencial").value = "";
      document.getElementById("tipoPedido").value = "local";
      if (inputEmailCliente) inputEmailCliente.value = ""; // Limpa o campo de email adicionado
      carrinhoPresencial = [];
      if (typeof atualizarTotalPresencial === "function")
        atualizarTotalPresencial();

      // FECHA A TELA DO MODAL FLUTUANTE E ATUALIZA IMEDIATAMENTE O GRID DE VISUALIZACAO
      fecharModal();
      carregarPedidos();
    };
  }
});

// OCULTA E FECHA O MODAL DE CADASTRO DE NOVO PEDIDO DA TELA
function fecharModal() {
  const modal = document.getElementById("modalPedido");
  if (modal) modal.style.display = "none";
}
// RECUPERA E RENDERIZA A LISTA DE PEDIDOS ATIVOS DIRETAMENTE NO PAINEL DO ATENDENTE
function carregarPedidos() {
  const lista = document.getElementById("listaPedidos");
  if (!lista) return;

  // RECOLHE A LISTA ATUAL DE COMPRAS E VALIDA SE A FUNÇAO DE BUSCA ESTA DISPONIVEL
  const pedidos = typeof buscarPedidos === "function" ? buscarPedidos() : [];
  atualizarResumo(pedidos);
  lista.innerHTML = "";

  // TRATAMENTO SEGURO CASO A BASE DE PEDIDOS ESTEJA COMPLETAMENTE VAZIA
  if (pedidos.length === 0) {
    lista.innerHTML = `
      <div class="semPedidos">
        Nenhum pedido encontrado.
      </div>
    `;
    return;
  }

  // FILTRA OS CARDS OCULTANDO AQUELES QUE JA FORAM ENTREGUES OU CANCELADOS DO FLUXO
  pedidos
    .filter((p) => p.status !== "Entregue" && p.status !== "Cancelado")
    .forEach((pedido) => {
      let itens = "";

      // CONCATENA OS ITENS DO PEDIDO MONTANDO RECURSIVAMENTE A LISTAGEM COM OS VALORES FORMATADOS
      if (pedido.itens) {
        pedido.itens.forEach((item) => {
          itens += `
            <li>
              ${item.quantidade}x ${item.nome}
              <strong>
              R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
              </strong>
            </li>
          `;
        });
      }

      // CAPTURA O VALOR TOTAL DO PEDIDO E A MODALIDADE DE PAGAMENTO COM VALIDAÇOES PADRAO
      const totalPedido =
        pedido.pagamento && pedido.pagamento.total ? pedido.pagamento.total : 0;
      const formaPagamento =
        pedido.pagamento && pedido.pagamento.forma
          ? pedido.pagamento.forma
          : "";

      // INJETA O CODIGO HTML DINAMICO DO CARD DO PEDIDO COM TODAS AS INFORMAÇOES E ACOES DO ATENDENTE
      lista.innerHTML += `
    <div class="card-pedido">
      <h3>Pedido #${pedido.id}</h3>
      <p><strong>Data/Hora:</strong> ${pedido.data || "Sem data"}</p>
      <p><strong>Cliente:</strong> ${pedido.cliente}</p>
      <p><strong>Telefone:</strong> ${pedido.telefone}</p>
      <p><strong>Entrega:</strong> ${pedido.tipoEntrega}</p>
      
      <!-- ADICIONADO: Exibição de Endereço e CEP no painel do atendente -->
      <p><strong>Endereço:</strong> ${pedido.endereco || "Não informado"}</p>
      <p><strong>CEP:</strong> ${pedido.cep || "Não informado"}</p>
      ${
        formaPagamento
          ? `
            <p><strong>Forma de pagamento:</strong> ${formaPagamento}</p>
          `
          : `
            <p><strong>Forma de pagamento:</strong></p>
      
            <select 
            id="pagamento-${pedido.id}"
            onchange="definirPagamento(${pedido.id})">
            <option value="">Selecione</option>
            <option value="Pix">Pix</option>
            <option value="Cartão">Cartão</option>
            <option value="Dinheiro">Dinheiro</option>
            </select>

          `
      }
      <p>
      <strong>Status:</strong>
      <span class="status ${pedido.status}">
      ${pedido.status}
      </span>
      </p>

      <ul>
      ${itens}
      </ul>

      <h2>
      Total: R$ ${totalPedido.toFixed(2).replace(".", ",")}
      </h2>

      ${
        pedido.status === "Recebido" && pedido.setor === "Atendente"
          ? `<button style="margin-top:10px;background:green;color:white;" onclick="enviarCozinha(${pedido.id})">Enviar/Cozinha</button>`
          : ""
      }
      ${
        pedido.status === "Recebido" && pedido.setor === "Atendente"
          ? `<button style="margin-top:10px;background:red;color:white;" onclick="cancelar(${pedido.id})">Cancelar</button>`
          : ""
      }
      
      <!-- INCLUSÃO EXCLUSIVA: Botão de confirmação de entrega física no balcão que aciona a entrada das moedas -->
      ${
        pedido.status === "Pronto para retirada" && pedido.setor === "Atendente"
          ? `<button style="margin-top:10px;background:#28a745;color:white;font-weight:bold;" onclick="finalizarEntregaBalcao(${pedido.id})">Confirmar Entrega (Dar Moedas)</button>`
          : ""
      }
    </div>
    `;
    });
}

// EXECUTA A ENTREGA, ATUALIZA O STATUS INTERNO E ACIONA A INJEÇÃO DE FIDELIDADE PELO EMAIL
function finalizarEntregaBalcao(id) {
  const pedido = buscarPedido(id);
  if (!pedido) {
    erro("Pedido não encontrado.");
    return;
  }

  // DESPACHA O PEDIDO PARA HISTÓRICO COM A FLAG CONCLUÍDA
  atualizarStatus(id, "Entregue");
  atualizarSetor(id, "Historico");

  // GATILHO SEGURO DO PROGRAMA DE FIDELIDADE: VALIDA SE HÁ UM EMAIL DE CLIENTE ATRELADO
  if (pedido.clienteEmail && typeof adicionarMoedasFidelidade === "function") {
    const totalPedido = pedido.pagamento && pedido.pagamento.total ? pedido.pagamento.total : 0;
    adicionarMoedasFidelidade(pedido.clienteEmail, totalPedido);
    sucesso(`Pedido #${id} entregue! Moedas inseridas na conta: ${pedido.clienteEmail}`);
  } else {
    sucesso(`Pedido #${id} entregue! (Nenhuma moeda somada pois o pedido não possui e-mail de cliente).`);
  }

  carregarPedidos();
}


// FUNÇÃO COMPLEMENTAR: EXECUTA A ENTREGA FÍSICA, MOVE PARA O HISTÓRICO E INJETA AS MOEDAS PELO E-MAIL DO CLIENTE
function finalizarEntregaBalcao(id) {
  const pedido = buscarPedido(id);
  if (!pedido) {
    erro("Pedido não encontrado.");
    return;
  }

  // ATUALIZA O ESTADO DO PEDIDO PARA FINALIZAR O CICLO OPERACIONAL
  atualizarStatus(id, "Entregue");
  atualizarSetor(id, "Historico");

  // EXECUTA O CRÉDITO DAS MOEDAS APENAS SE O CLIENTE TIVER UM E-MAIL VÁLIDO ASSOCIADO AO PEDIDO
  if (pedido.clienteEmail && typeof adicionarMoedasFidelidade === "function") {
    const totalPedido = pedido.pagamento && pedido.pagamento.total ? pedido.pagamento.total : 0;
    adicionarMoedasFidelidade(pedido.clienteEmail, totalPedido);
    sucesso(`Pedido #${id} entregue com sucesso! Moedas creditadas para: ${pedido.clienteEmail}`);
  } else {
    sucesso(`Pedido #${id} entregue! (Nenhuma moeda adicionada pois o pedido não possui e-mail de cliente).`);
  }

  carregarPedidos();
}


// ADICIONADO: FUNÇÃO QUE O ATENDENTE CLICA PARA ENTREGAR O PEDIDO, MANDAR PRO HISTÓRICO E CREDITAR AS MOEDAS PELO E-MAIL
function finalizarEntregaBalcao(id) {
  const pedido = buscarPedido(id);
  if (!pedido) {
    erro("Pedido não encontrado.");
    return;
  }

  // ATUALIZA OS STATUS OPERACIONAIS DO SISTEMA
  atualizarStatus(id, "Entregue");
  atualizarSetor(id, "Historico");

  // DISPARADOR DO PROGRAMA DE FIDELIDADE: BASEADO 100% NO E-MAIL DO CLIENTE
  if (pedido.clienteEmail && typeof adicionarMoedasFidelidade === "function") {
    const valorTotal = pedido.pagamento && pedido.pagamento.total ? pedido.pagamento.total : (pedido.total || 0);
    adicionarMoedasFidelidade(pedido.clienteEmail, valorTotal);
    sucesso(`Pedido #${id} entregue! Moedas creditadas para: ${pedido.clienteEmail}`);
  } else {
    sucesso(`Pedido #${id} entregue! (Nenhuma moeda adicionada pois o cliente não informou e-mail).`);
  }

  carregarPedidos();
}


// FUNÇAO RESPONSAVEL POR ENCAMINHAR O PEDIDO PARA PREPARAÇAO NA FILA DA COZINHA
function enviarCozinha(id) {
  const pedido = buscarPedido(id);
  console.log(pedido);

  // INTERROMPE A OPERAÇAO CASO O IDENTIFICADOR DO PEDIDO NAO CONDIZA COM A BASE DE DADOS
  if (!pedido) {
    erro("Pedido não encontrado.");
    return;
  }
  console.log("Pagamento:", pedido.pagamento);

  // TRAVA DE SEGURANÇA QUE IMPEDE O ENVIO SE A MODALIDADE FINANCEIRA NAO ESTIVER DEFINIDA
  if (!pedido.pagamento || !pedido.pagamento.forma) {
    console.log("Entrou na validação");
    aviso("Defina a forma de pagamento antes de enviar para a cozinha.");
    return;
  }

  // TRANSMITE O PEDIDO DE SETOR ATUALIZANDO AS CHAVES E ATUALIZA A TELA DO PAINEL
  atualizarStatus(id, "Recebido");
  atualizarSetor(id, "Cozinha");
  aviso("Pedido enviado para a cozinha.");
  carregarPedidos();
}

// ATUALIZA A FORMA DE PAGAMENTO ESCOLHIDA PARA O PEDIDO NO BANCO DE DADOS LOCAL
function definirPagamento(id) {
  const pedido = buscarPedido(id);

  // INTERROMPE A OPERAÇÃO CASO O IDENTIFICADOR DO PEDIDO NÃO EXISTA NO LOCALSTORAGE
  if (!pedido) {
    erro("Pedido não encontrado.");
    return;
  }
  const select = document.getElementById("pagamento-" + id);

  // ABORTA O FLUXO SE NENHUMA OPÇÃO DE PAGAMENTO VÁLIDA TIVER SIDO SELECIONADA
  if (!select.value) {
    return;
  }

  // CRIA O OBJETO DE PAGAMENTO CASO ELE AINDA NÃO TENHA SIDO INICIALIZADO NO PEDIDO
  if (!pedido.pagamento) {
    pedido.pagamento = {};
  }

  // INSERE A MODALIDADE DE LIQUIDAÇÃO FINANCEIRA INFORMADA E RECARREGA A GRAVAÇÃO E TELA
  pedido.pagamento.forma = select.value;
  atualizarPedido(pedido);
  carregarPedidos();
}

// SOLICITA CONFIRMAÇÃO DO ATENDENTE E EFETUA O CANCELAMENTO DEFINITIVO DO PEDIDO
async function cancelar(id) {
  // CONFIRMA CANCELAMENTO DO PEDIDO EXIBINDO O ALERTA ASSÍNCRONO DA NOSSA BLINDAGEM VISUAL
  if (!(await confirmar("Cancelar pedido?"))) return;

  // COMUNICA A INTENÇÃO À FUNÇÃO DE PERSISTÊNCIA CENTRAL DO PEDIDOS.JS
  if (typeof cancelarPedido === "function") {
    cancelarPedido(id);
    carregarPedidos();
  }
}

// CALCULA E EXIBE NA TELA A CONTAGEM CONSOLIDADA DE TODOS OS PEDIDOS DO PAINEL
function atualizarResumo(pedidos) {
  const totalPedidos = document.getElementById("totalPedidos");
  const recebidos = document.getElementById("recebidos");
  const preparo = document.getElementById("preparo");
  const prontos = document.getElementById("prontos");
  const cancelados = document.getElementById("cancelados");

  // ATUALIZA VISUALMENTE A CONTAGEM METRICA BRUTA DO NOSSO COMPONENTE DE DESTAQUES
  if (totalPedidos) totalPedidos.textContent = pedidos.length;
  if (recebidos)
    recebidos.textContent = pedidos.filter(
      (p) => p.status === "Recebido"
    ).length;
  if (preparo)
    preparo.textContent = pedidos.filter(
      (p) => p.status === "Preparando"
    ).length;
  if (prontos)
    prontos.textContent = pedidos.filter(
      (p) =>
        p.status === "Pronto para retirada" || p.status === "Saiu para entrega"
    ).length;
  if (cancelados)
    cancelados.textContent = pedidos.filter(
      (p) => p.status === "Cancelado"
    ).length;
}

// RECUPERA E RENDERIZA OS PRODUTOS DISPONÍVEIS PARA A CRIAÇÃO DE UM PEDIDO PRESENCIAL
let carrinhoPresencial = [];
function carregarProdutosPresencial() {
  const lista = document.getElementById("listaProdutosPedido");
  if (!lista) return;

  // RECOLHE AS CONFIGURAÇÕES E CATÁLOGO GERAL DE MERCADORIAS REGISTRADAS
  const produtos = JSON.parse(localStorage.getItem("produtosRaizes")) || [];
  lista.innerHTML = "";

  // TRATAMENTO DE INTERFACE PARA AMBIENTES SEM MERCADORIAS CADASTRADAS NO SISTEMA
  if (produtos.length === 0) {
    lista.innerHTML = "Nenhum produto cadastrado no sistema.";
    return;
  }

  // PERCORRE O CATÁLOGO E INJETA DINAMICAMENTE AS LINHAS E O BOTÃO DE ADIÇÃO DO ITEM
  produtos.forEach((produto) => {
    lista.innerHTML += `
      <div class="produto-item"> 
        <div> 
          <strong>${produto.nome}</strong> 
          <br> 
          R$ ${Number(produto.preco).toFixed(2).replace(".", ",")} 
        </div> 
        <button class="btnAdicionar" onclick="adicionarProdutoPresencial('${produto.id}')"> + </button> 
      </div>
    `;
  });
}

// ADICIONA O PRODUTO SELECIONADO AO CARRINHO TEMPORÁRIO DO ATENDIMENTO PRESENCIAL
function adicionarProdutoPresencial(id) {
  const produtos = JSON.parse(localStorage.getItem("produtosRaizes")) || [];
  const produto = produtos.find((p) => String(p.id) === String(id));

  // INSRE O ITEM SELECIONADO NO MAPA E RECALCULA O SUBOTAL FINANCEIRO DA OPERAÇÃO
  if (produto) {
    carrinhoPresencial.push(produto);
    atualizarTotalPresencial();
  }
}

// SOMA OS VALORES DE TODOS OS ITENS DO CARRINHO PRESENCIAL E ATUALIZA O TOTAL NA TELA
function atualizarTotalPresencial() {
  let total = 0;
  carrinhoPresencial.forEach((produto) => {
    total += Number(produto.preco);
  });

  // FORMATA COM DUAS CASAS DECIMAIS E EXIBE O VALOR DO COMPONENTE DO MODAL
  const campo = document.getElementById("totalPresencial");
  if (campo) {
    campo.innerHTML = "R$ " + total.toFixed(2).replace(".", ",");
  }
}

// CORREÇÃO DOS PRODUTOS: GARANTE QUE O CARRINHO EXISTA GLOBALMENTE E EXIBE O AVISO VISUAL DE ADIÇÃO
if (typeof window.carrinhoPresencial === "undefined") {
  window.carrinhoPresencial = [];
}

// INTERCEPTA O CLIQUE DO BOTÃO "➕" PARA FORÇAR A EXIBIÇÃO DA MENSAGEM SUAVE NA TELA
document.addEventListener("click", (event) => {
  const botao = event.target.closest(".btnAdicionar");
  if (!botao) return;

  // CAPTURA O NOME DO PRODUTO DIRETO DA LINHA ONDER ELE ESTÁ LOCALIZADO
  const itemElemento = botao.closest(".produto-item");

  if (!itemElemento) return;
  const nomeElemento = itemElemento.querySelector("strong");
  const nomeProduto = nomeElemento ? nomeElemento.textContent.trim() : "Produto";

  // CRIA A CÁPSULA VERDE DE ALERTA DO TIPO TOAST CONFORME AS IDENTIDADES DO SISTEMA
  const alerta = document.createElement("div");
  alerta.className = "alerta-adicionado";
  alerta.textContent = `${nomeProduto} adicionado!`;
  document.body.appendChild(alerta);

  // LOGO APÓS A ANIMAÇÃO DO TOAST ROLAR, DELETA O ELEMENTO REMOVENDO DO HTML
  setTimeout(() => {
    alerta.remove();
  }, 2000);
});
