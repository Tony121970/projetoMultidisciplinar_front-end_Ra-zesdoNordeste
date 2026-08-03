// RECUPERA E CONVERTE EM ARRAY A LISTA COMPLETA DE PEDIDOS ARMAZENADOS NO LOCALSTORAGE
function buscarPedidos() {
  return JSON.parse(localStorage.getItem("pedidos")) || [];
}

// TRANSFORMA A LISTA ATUALIZADA DE PEDIDOS EM STRING E A ARMAZENA NO LOCALSTORAGE
function salvarPedidos(lista) {
  localStorage.setItem("pedidos", JSON.stringify(lista));
}

// LOCALIZA UM PEDIDO ESPECÍFICO NO REGISTRO GERAL COMPRANDO O NÚMERO DE IDENTIFICAÇÃO INDICADO
function buscarPedido(id) {
  const pedidos = buscarPedidos();
  return pedidos.find((p) => Number(p.id) === Number(id));
}

// ARMAZENA AS INFORMAÇÕES DE UM NOVO PEDIDO, VINCULA OS DADOS DO USUÁRIO LOGADO E REGISTRA A DATA
function salvarNovoPedido(pedido) {
  const pedidos = buscarPedidos();

  // RECUPERA OS DADOS DE SESSAO DO USUARIO LOGADO NA INTERFACE
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  // INJETA OS METADADOS CADASTRAIS DO CLIENTE CASO NAO ESTEJAM DECLARADOS NO PARAMETRO DO PEDIDO
  if (usuarioLogado && !pedido.cliente) {
    pedido.cliente = usuarioLogado.nome;
    pedido.enderecoCliente = usuarioLogado.endereco;
    pedido.cep = usuarioLogado.cep;
    pedido.emailCliente = usuarioLogado.email;
    pedido.telefone = usuarioLogado.telefone;
  }
  pedido.id = Number(pedido.id);
  const agora = new Date();
  pedido.dataCriacao = agora.toLocaleString("pt-BR");
  pedido.ultimaAtualizacao = agora.toLocaleString("pt-BR");

  // SALVA A DATA E O HORÁRIO JUNTOS EM FORMATACAO BRASILEIRA PADRAO
  pedido.data =
    agora.toLocaleDateString("pt-BR") +
    " " +
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  pedido.status = pedido.status || "Recebido";
  pedido.setor = pedido.setor || "Atendente";

  // INICIALIZA O OBJETO DE PAGAMENTO CASO ELE SE ENCONTRE AUSENTE NA ESTRUTURA DO PEDIDO
  if (!pedido.pagamento) {
    pedido.pagamento = { total: 0 };
  }
  pedidos.push(pedido);
  salvarPedidos(pedidos);

  // GUARDA O OBJETO DO PEDIDO ATUAL ISOLADAMENTE NA MEMORIA DE SESSAO DO NAVEGADOR
  localStorage.setItem("pedidoAtual", JSON.stringify(pedido));

  return pedido;
}

// ENCONTRA O PEDIDO MODIFICADO NA LISTA GERAL, ATUALIZA SUAS PROPRIEDADES E SALVA NO STORAGE
function atualizarPedido(pedidoAtualizado) {
  const pedidos = buscarPedidos();
  const indice = pedidos.findIndex(
    (p) => Number(p.id) === Number(pedidoAtualizado.id)
  );

  // RETORNA FALSO SE O IDENTIFICADOR NUMERICO DO PEDIDO NAO CONDIZ COM A BASE DE DADOS
  if (indice === -1) return false;
  pedidoAtualizado.ultimaAtualizacao = new Date().toLocaleString("pt-BR");
  pedidos[indice] = pedidoAtualizado;
  salvarPedidos(pedidos);
  localStorage.setItem("pedidoAtual", JSON.stringify(pedidoAtualizado));

  return true;
}

// ATUALIZA VISUALMENTE APENAS O STATUS OPERACIONAL DA ETAPA DO PEDIDO NA LISTA GERAL
function atualizarStatus(id, status) {
  const pedido = buscarPedido(id);

  if (!pedido) return false;
  pedido.status = status;

 // GRAVA AS ALTERACOES PROVENIENTES DA MUDANCA DE STATUS NA MEMORIA LOCAL
  return atualizarPedido(pedido);
}

// TRANSFERE O ENCAMINHAMENTO DE LOGÍSTICA DO PEDIDO PARA UM NOVO SETOR DE ATENDIMENTO
function atualizarSetor(id, setor) {
  const pedido = buscarPedido(id);
  if (!pedido) return false;
  pedido.setor = setor;
  return atualizarPedido(pedido);
}

// ALTERA O STATUS DO PEDIDO PARA CANCELADO E ATRIBUI UMA JUSTIFICATIVA DE MOTIVAÇÃO
function cancelarPedido(id, motivo = "") {
  const pedido = buscarPedido(id);
  if (!pedido) return false;
  pedido.status = "Cancelado";
  pedido.motivoCancelamento = motivo;
  return atualizarPedido(pedido);
}

// RETIRA O REGISTRO DO PEDIDO ISOLADO E ATUALIZA AS CHAVES DA HISTORIA DE ACESSO
function excluirPedido(id) {
  let pedidos = buscarPedidos();
  pedidos = pedidos.filter((p) => Number(p.id) !== Number(id));
  salvarPedidos(pedidos);
  const atual = JSON.parse(localStorage.getItem("pedidoAtual"));

  // DELETA A CHAVE DE SESSÃO INDIVIDUAL CASO ELA SEJA A MESMA DO ITEM REMOVIDO
  if (atual && Number(atual.id) === Number(id)) {
    localStorage.removeItem("pedidoAtual");
  }
}

// ELIMINA DEFINITIVAMENTE O REGISTRO DO PEDIDO DO STORAGE DO NAVEGADOR ATRAVÉS DO SEU ID
function pedidosPorStatus(status) {
  return buscarPedidos().filter((p) => p.status === status);
}
