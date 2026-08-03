// VERIFICA SE A PAGINA ATUAL CONDIZ COM A RESTRICAO DA AREA ADMINISTRATIVA
const isAdminPage = window.location.pathname
  .toLowerCase()
  .includes("estoqueadmin.html");
let idEditando = null;

// ESCUTA O CARREGAMENTO COMPLETO DA INTERFACE PARA INICIALIZAR OS CARDS E EVENTOS DO ESTOQUE
document.addEventListener("DOMContentLoaded", () => {
  carregarCards();
  atualizarResumo();

  // ATRIBUI OS GATILHOS DE CLIQUE NOS CONTROLES DO MODAL APENAS SE FOR ACESSO DO ADMINISTRADOR
  if (isAdminPage) {
    document.getElementById("btnNovo").onclick = abrirModal;
    document.getElementById("cancelar").onclick = fecharModal;
    document.getElementById("salvar").onclick = salvar;
  }
  
  // CAPTURA A DIGITACAO EM TEMPO REAL NO CAMPO DE FILTRO PARA REDIRECIONAR OS PRODUTOS BUSCADOS
  document.getElementById("pesquisa").oninput = (e) => {
    carregarCards(pesquisarEstoque(e.target.value));
  };
});

// RECUPERA E RENDERIZA OS COMPONENTES DO ESTOQUE EM CARDS VISUAIS NA TELA
function carregarCards(lista = buscarEstoque()) {
  const area = document.getElementById("listaEstoque");
  area.innerHTML = "";
  
  // PERCORRE O MAPA DE INSUMOS GERANDO O CODIGO HTML DINAMICO BASEADO NAS ETAPAS DO ADMINISTRADOR
  lista.forEach((item) => {
    let status = statusEstoque(item);
    area.innerHTML += `
      <div class="card-estoque">

        <h2>${item.nome}</h2>

        <div class="info">
          Categoria:
          <strong>${item.categoria}</strong>
        </div>

        <div class="info">
          Quantidade:
          <strong>${item.quantidade} ${item.unidade}</strong>
        </div>

        <div class="info">
          Estoque mínimo:
          <strong>${item.minimo} ${item.unidade}</strong>
        </div>

        <div class="status ${status.classe}">
          ${status.texto}
        </div>

        ${
          isAdminPage
            ? `
        <div class="botoes">

          <button
            class="editar"
            onclick="editar(${item.id})">
            Editar
          </button>

          <button
            class="excluir"
            onclick="excluirItem(${item.id})">
            Excluir
          </button>

        </div>
        `
            : ""
        }

      </div>
    `;
  });
}

// ATUALIZA OS PAINÉIS DE CONTAGEM TOTAL, ALERTA DE ESTOQUE BAIXO E ITENS ZERADOS
function atualizarResumo() {
  const dados = resumoEstoque();
  document.getElementById("totalInsumos").innerText = dados.total;
  document.getElementById("estoqueBaixo").innerText = dados.baixo;
  document.getElementById("estoqueZero").innerText = dados.zero;
}

// PREPARA O FORMULÁRIO PARA A INCLUSÃO DE UM NOVO REGISTRO E ABRE A TELA FLUTUANTE
function abrirModal() {
  if (!isAdminPage) return;

  idEditando = null;
  limparFormulario();

  document.getElementById("tituloModal").innerText = "Novo Insumo";
  document.getElementById("modal").style.display = "flex";
}

// ENCERRA E OCULTA VISUALMENTE A JANELA FLUTUANTE DO FORMULÁRIO DO ESTOQUE
function fecharModal() {
  if (!isAdminPage) return;

  document.getElementById("modal").style.display = "none";
}

// VALIDA OS CAMPOS, ARMAZENA AS ALTERAÇÕES OU NOVO INSUMO E EXIBE TOAST DE SUCESSO
function salvar() {
  if (!isAdminPage) return;

  let item = {
    nome: document.getElementById("nome").value,
    categoria: document.getElementById("categoria").value,
    quantidade: Number(document.getElementById("quantidade").value),
    unidade: document.getElementById("unidade").value,
    minimo: Number(document.getElementById("minimo").value),
  };

  // INTERROMPE A OPERACAO VISUAL SE O COMPONENTE DO NOME ESTIVER EM BRANCO
  if (item.nome === "") {
    aviso("Informe o nome do insumo");
    return;
  }

  // DIRECIONA O FLUXO ENTRE ALTERACAO DE ITEM EXISTENTE OU ADICAO DE NOVO INSUMO NO ARQUIVO
  if (idEditando) {
    item.id = idEditando;
    atualizarEstoque(item);
    sucesso(`Insumo "${item.nome}" atualizado com sucesso!`);
  } else {
    adicionarEstoque(item);
    sucesso(`Insumo "${item.nome}" cadastrado com sucesso!`);
  }

  // OCULTA O POPUP DO FORMULARIO E SOLICITA O RECALCULO DE CONTADORES E METRICAS DA TELA
  fecharModal();
  carregarCards();
  atualizarResumo();
}

// RECOLHE AS INFORMACOES DA MERCADORIA E PREENCHE OS CAMPOS DO FORMULARIO PARA ALTERACAO
function editar(id) {
  if (!isAdminPage) return;
  let item = buscarPorId(id);

  if (!item) return;
  idEditando = id;
  
  // INJETA OS METADADOS RECOLETADOS DIRETAMENTE NAS CAIXAS DE DIGITACAO INTERNAS DO POPUP
  document.getElementById("tituloModal").innerText = "Editar Insumo";
  document.getElementById("nome").value = item.nome;
  document.getElementById("categoria").value = item.categoria;
  document.getElementById("quantidade").value = item.quantidade;
  document.getElementById("unidade").value = item.unidade;
  document.getElementById("minimo").value = item.minimo;
  document.getElementById("modal").style.display = "flex";
}

// SOLICITA CONFIRMAÇÃO DO ADMINISTRADOR E DELETA DEFINITIVAMENTE O ITEM DO ESTOQUE
async function excluirItem(id) {
  if (!isAdminPage) return;

  let item = buscarPorId(id);
  let nomeItem = item ? item.nome : "Insumo";

  // DISPARA A JANELA ASSINCRONA RESTRITA DE CONFIRMACAO DO ARQUIVO DE ALERTAS DO SEU SISTEMA
  if (!(await confirmar(`Deseja excluir o insumo "${nomeItem}"?`))) return;
  removerEstoque(id);
  
  // DISPARA CAPSULA VERMELHA DE REMOCAO ATRAVES DO COMANDO ERRO E RECARREGA OS GRIDS
  erro(`🗑️ Insumo "${nomeItem}" foi removido do estoque.`);
  carregarCards();
  atualizarResumo();
}

// ZERA AS INFORMACOES DE DIGITACAO DE TODOS OS CAMPOS DO FORMULARIO DO MODAL
function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("minimo").value = "";
}

// EXECUTA A DEDUCAO AUTOMATICA DE VOLUMES DE MATERIAIS CONFORME OS ITENS DO PEDIDO CONCLUIDO
function baixarInsumosPedido(pedido) {
  let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
  
  // PERCORRE A FILA DO PEDIDO IDENTIFICANDO AS MATERIAS PRIMAS QUE DEVERAO SER REDUZIDAS
  pedido.itens.forEach((itemPedido) => {
    const produtoEstoque = estoque.find(
      (item) => item.nome === itemPedido.nome
    );

    if (produtoEstoque) {
      produtoEstoque.quantidade -= itemPedido.quantidade;

      // APENAS PROTEGE O FLUXO UTILIZANDO A EXPRESSAO MAX PARA IMPEDIR ESTOQUE COM NUMEROS NEGATIVOS
      produtoEstoque.quantidade = Math.max(0, produtoEstoque.quantidade);
    }
  });

  // ATUALIZA A GRAVACAO DO ARQUIVO DO ESTOQUE DENTRO DA BASE DO LOCALSTORAGE
  localStorage.setItem("estoque", JSON.stringify(estoque));
  console.log("Estoque updated:", estoque);
}
