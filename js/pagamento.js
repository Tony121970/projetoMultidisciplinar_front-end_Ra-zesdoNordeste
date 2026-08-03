// REUNE AS INFORMAÇÕES DE VALORES DO NAVEGADOR E RETORNA O CALCULO DETALHADO DO FINANCIAMENTO DO PEDIDO
function calcularPedido() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const subtotal = Number(localStorage.getItem("totalCompra")) || 0;
  const tipoEntrega = (
    localStorage.getItem("tipoEntrega") || "retirada"
  ).toLowerCase();
  const taxaEntrega = tipoEntrega === "entrega" ? 23 : 0;
  const descontoAplicado = Number(localStorage.getItem("desconto")) || 0;
  const total = subtotal + taxaEntrega - descontoAplicado;

  return {
    carrinho,
    subtotal,
    taxaEntrega,
    descontoAplicado,
    total,
    tipoEntrega,
  };
}

// INICIALIZAÇÃO E MONITORAMENTO DE EVENTOS DA INTERFACE DE PAGAMENTO
document.addEventListener("DOMContentLoaded", () => {
  const btnWhatsapp = document.getElementById("btnWhatsapp");

  // CONFIGURA O DISPARO E ESTRUTURAÇÃO DO TEXTO DO PEDIDO ADAPTADO PARA ENVIO VIA COMPARTILHAMENTO
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener("click", () => {
      const dados = calcularPedido();
      let mensagem = `*Raízes do Nordeste*\n\n`;
      mensagem += `*Itens do Pedido:*\n`;

      dados.carrinho.forEach((item) => {
        mensagem += `- ${item.quantidade}x ${item.nome} (R$ ${(
          item.preco * item.quantidade
        ).toFixed(2)})\n`;
      });

      mensagem += `\n*Resumo:*\n`;
      mensagem += `Subtotal: R$ ${dados.subtotal.toFixed(2)}\n`;
      mensagem += `Entrega: R$ ${dados.taxaEntrega.toFixed(2)}\n`;
      mensagem += `Desconto: R$ ${dados.descontoAplicado.toFixed(2)}\n`;
      mensagem += `\n*Entrega:* ${dados.tipoEntrega}\n`;

      if (dados.tipoEntrega === "entrega") {
        mensagem += `Distância: ${
          localStorage.getItem("distancia") || 0
        } km\n`;
      }

      mensagem += `\n*Total: R$ ${dados.total.toFixed(2)}*\n\n`;
      mensagem += `Obrigado pela preferência!`;

      const numeroWhatsApp = "5581999999999";
      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        mensagem
      )}`;

      window.open(url, "_blank");
    });
  }

  // RECUPERA O EMAIL LOGADO PARA CARREGAR O SALDO CORRETO ISOLADO NA CONTA DESTE CLIENTE
  const emailLogado = localStorage.getItem("emailClienteLogado") || "";
  if (typeof carregarSaldo === "function" && emailLogado) {
    carregarSaldo(emailLogado);
  }

  // ATUALIZA IMEDIATAMENTE OS ELEMENTOS OPERACIONAIS E PREÇOS NA TELA DO USUÁRIO
  atualizarTela();
});

// CAPTURA OS RESULTADOS CALCULADOS DO PEDIDO E RENDERIZA TODOS OS VALORES FORMATADOS NA TELA
function atualizarTela() {
  const dados = calcularPedido();

  document.getElementById("valorCompra").textContent =
    "R$ " + dados.subtotal.toFixed(2).replace(".", ",");

  document.getElementById("valorDesconto").textContent =
    "R$ " + dados.descontoAplicado.toFixed(2).replace(".", ",");

  document.getElementById("valorTotal").textContent =
    "R$ " + dados.total.toFixed(2).replace(".", ",");

  document.getElementById("valorEntrega").textContent =
    "R$ " + dados.taxaEntrega.toFixed(2).replace(".", ",");

  // PROJETA O RETORNO DO CASHBACK SEGUINDO A REGRA DE DOIS POR CENTO FIXADA NO SISTEMA
  document.getElementById("cashback").textContent =
    (dados.total * 0.02).toFixed(2).replace(".", ",") + " moedas";
}

// ESCUTA O CLICK PARA CONSUMIR OS CREDITOS ACUMULADOS E CONVERTER EM ABATIMENTO FINANCEIRO
document.getElementById("btnUsarMoedas").addEventListener("click", () => {
  const dados = calcularPedido();
  
  // PASSA O EMAIL LOGADO COMO IDENTIFICADOR PARA CONSULTAR MOEDAS DA CONTA CERTA
  const emailLogado = localStorage.getItem("emailClienteLogado") || "";
  const desconto = typeof consultarMoedas === "function" ? consultarMoedas(emailLogado, dados.subtotal) : 0;

  // INTERROMPE A OPERAÇÃO VISUAL CASO O CLIENTE NAO POSSUA MOEDAS DE RECOMPENSA DISPONIVEIS
  if (desconto <= 0) {
    aviso("Você não possui moedas.");
    return;
  }

  // GRAVA O VALOR DO DESCONTO E ATUALIZA DINAMICAMENTE OS COMPONENTES DO DOCUMENTO
  localStorage.setItem("desconto", desconto);
  atualizarTela();

  sucesso("Desconto aplicado com sucesso!");
});

// CAPTURA O FECHAMENTO DO PROCESSO EXECUTANDO A MONTAGEM DO PEDIDO E ATUALIZANDO AS BASE DE DADOS
document.getElementById("btnConfirmar").addEventListener("click", () => {
  console.log("CONFIRMAR PAGAMENTO");

  // LOCALIZA QUAL FOI A MODALIDADE DE LIQUIDACAO FINANCEIRA MARCADA PELO USUARIO
  const forma = document.querySelector('input[name="pagamento"]:checked');

  if (!forma) {
    aviso("Selecione a forma de pagamento.");
    return;
  }

  const dados = calcularPedido();

  // VALIDACAO DE SEGURANÇA QUE REJEITA OPERACOES CASO O CARRINHO SE ENCONTRE ZERADO
  if (dados.carrinho.length === 0) {
    erro("Carrinho vazio.");
    return;
  }

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  
  // ESTRUTURA O OBJETO COMPLETO DE COMPRA REUNINDO TODAS AS INFORMACOES LOGISTICAS E CADASTRAIS
  const pedido = {
    id: Date.now(),
    clienteEmail: usuarioLogado?.email || localStorage.getItem("emailClienteLogado") || "",
    cliente: usuarioLogado?.nome || localStorage.getItem("nome") || "Cliente",
    telefone:
      usuarioLogado?.telefone || localStorage.getItem("telefone") || "",
    endereco:
      usuarioLogado?.endereco || localStorage.getItem("endereco") || "",
    cep: usuarioLogado?.cep || localStorage.getItem("cep") || "",
    data: new Date().toLocaleString("pt-BR"),
    status: "Recebido",
    setor: "Atendente",
    tipoEntrega: dados.tipoEntrega,
    itens: dados.carrinho,
    entrega: {
      taxa: dados.taxaEntrega,
      distancia: localStorage.getItem("distancia") || 0,
    },
    pagamento: {
      forma: forma.value,
      subtotal: dados.subtotal,
      desconto: dados.descontoAplicado,
      total: dados.total,
    },
  };

  // TRANSMITE O PEDIDO E SOLICITA O SALVAMENTO SEGURO NA BASE PRINCIPAL DO LOCALSTORAGE
  salvarNovoPedido(pedido);

  // DEBITA AS MOEDAS UTILIZADAS CONFIRMANDO SE O DESCONTO ENCONTRA DEVIDAMENTE REGISTRADO
  const descontoUsado = Number(localStorage.getItem("desconto")) || 0;
  console.log("descontoUsado =", descontoUsado);
  console.log("Desconto salvo:", descontoUsado);
  console.log("Função usarMoedas:", typeof usarMoedas);

  // CORREÇÃO: Executa o debito aplicando o e-mail do cliente como id para zerar a conta correta
  if (descontoUsado > 0 && typeof usarMoedas === "function") {
    const emailCliente = pedido.clienteEmail;
    usarMoedas(emailCliente, descontoUsado);
  }

  // LIMPA TOTALMENTE AS CHAVES TEMPORARIAS DO PROCESSO DE COMPRAS DO NAVEGADOR
  localStorage.removeItem("carrinho");
  localStorage.removeItem("totalCompra");
  localStorage.removeItem("desconto");
  localStorage.removeItem("tipoEntrega");
  localStorage.removeItem("taxaEntrega");
  localStorage.removeItem("distancia");

  // DISPARA ALERTA VISUAL DO TOAST DE SUCESSO E DIRECIONA O CLIENTE PARA A PAGINA DE CONCLUSAO
  sucesso("Pagamento confirmado com sucesso!");

  window.location.href = "sucesso.html";
});

// ALTERA DIRETAMENTE O ESTADO INTERNO DO PEDIDO ARMAZENADO ATUALMENTE NO LOCALSTORAGE
function atualizarStatus(novoStatus) {
  const pedido = JSON.parse(localStorage.getItem("pedidoAtual"));

  if (!pedido) return;

  pedido.status = novoStatus;
  localStorage.setItem("pedidoAtual", JSON.stringify(pedido));
}
