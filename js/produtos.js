// VERIFICA SE O ARQUIVO ABERTO NO NAVEGADOR É O ADMIN
const isAdminPage = window.location.pathname
  .toLowerCase()
  .includes("produtosadmin.html");

// PRODUTOS
let idProdutoEditando = null;
const CHAVE_BANCO = "produtosRaizes";

// ESCUTA O CARREGAMENTO COMPLETO DA INTERFACE PARA INICIALIZAR OS PRODUTOS E GATILHOS DO TOPO
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
  atualizarResumo();

  // ATRIBUI OS GATILHOS DE CLIQUE NOS CONTROLES DO MODAL APENAS SE FOR ACESSO DO ADMINISTRADOR
  if (isAdminPage) {
    document.getElementById("btnNovo").onclick = () => {
      abrirModal();
    };

    document.getElementById("cancelar").onclick = () => {
      fecharModal();
    };

    document.getElementById("salvar").onclick = () => {
      salvarProduto();
    };
  }

  // CAPTURA A DIGITACAO EM TEMPO REAL NO CAMPO DE FILTRO PARA REDIRECIONAR OS PRODUTOS BUSCADOS
  document.getElementById("pesquisa").oninput = (e) => {
    let lista = pesquisarProdutosLocais(e.target.value);
    carregarProdutos(lista);
  };

  // OPERALIZA O RETORNO HISTORICO DO NAVEGADOR ATRAVES DO COMANDO BACK NO BOTAO VOLTAR
  document.getElementById("btnVoltar").onclick = () => {
    history.back();
  };
});

// RECUPERA E CONSTRÓI OS CARDS VISUAIS DE CADA PRODUTO NA TELA EXIBINDO STATUS E ESTOQUE
function carregarProdutos(lista = buscarProdutosLocais()) {
  const area = document.getElementById("listaProdutos");
  if (!area) return;
  area.innerHTML = "";
  
  // PERCORRE A GRADE DE MERCADORIAS APLICANDO AS CLASSES DE CONTROLE DO COMPONENTE
  lista.forEach((produto) => {
    let classeStatus = produto.status === "ativo" ? "ativo" : "inativo";
    let textoStatus = produto.status === "ativo" ? "🟢 Ativo" : "🔴 Inativo";

    // SITUAÇÃO DO ESTOQUE
    let situacaoEstoque = "";
    let classeEstoque = "";

    if (produto.quantidade <= 0) {
      situacaoEstoque = "🔴 Esgotado";
      classeEstoque = "estoque-esgotado";
    } else if (produto.quantidade <= produto.estoqueMinimo) {
      situacaoEstoque = "🟡 Estoque Baixo";
      classeEstoque = "estoque-baixo";
    } else {
      situacaoEstoque = "🟢 Estoque Normal";
      classeEstoque = "estoque-normal";
    }

    let precoFormatado = Number(produto.preco || 0)
      .toFixed(2)
      .replace(".", ",");

    // REGRA: SÓ MONTA A STRING DOS BOTÕES SE FOR A PÁGINA DO ADMIN
    let botoesHTML = "";
    if (isAdminPage) {
      botoesHTML = `
        <div class="botoes">
            <button class="editar" onclick="editarProduto('${produto.id}')">
                Editar
            </button>
            <button class="excluir" onclick="excluirProduto('${produto.id}')">
                Excluir
            </button>
        </div>
      `;
    }

    // INJETA O CODIGO HTML DINAMICO DOS CARDS DE PRODUTOS DIRETAMENTE NO CONTAINER DA TELA
    area.innerHTML += `
        <div class="card-produto">
            <h2>${produto.nome}</h2>

            <div class="info">
                Categoria: <strong>${produto.categoria}</strong>
            </div>

            <div class="info">
                ${produto.descricao || "Sem descrição"}
            </div>

            <div class="preco">
                R$ ${precoFormatado}
            </div>

            <div class="info">
                Estoque: <strong>${produto.quantidade}</strong>
            </div>

            <div class="info">
                Estoque mínimo: <strong>${produto.estoqueMinimo}</strong>
            </div>

            <div class="${classeEstoque}">
                ${situacaoEstoque}
            </div>

            <div class="${classeStatus}">
                ${textoStatus}
            </div>

            ${botoesHTML}
        </div>
    `;
  });
}

// ATUALIZA OS CONTADORES GERAIS DE PRODUTOS TOTAIS, ATIVOS E INATIVOS NO PAINEL RESUMO
function atualizarResumo() {
  const dados = resumoProdutosLocais();
  document.getElementById("totalProdutos").innerText = dados.total;
  document.getElementById("produtosAtivos").innerText = dados.ativos;
  document.getElementById("produtosInativos").innerText = dados.inativos;
}

// LIMPA OS CAMPOS DO FORMULÁRIO E ABRE A TELA FLUTUANTE PARA CADASTRO DE NOVO PRODUTO
function abrirModal() {
  if (!isAdminPage) return;
  idProdutoEditando = null;
  limparFormulario();
  document.getElementById("tituloModal").innerText = "Novo Produto";
  document.getElementById("modal").style.display = "flex";
}

// FECHAR VISUALMENTE A JANELA FLUTUANTE DE FORMULÁRIO DE PRODUTO DO PAINEL
function fecharModal() {
  if (!isAdminPage) return;
  document.getElementById("modal").style.display = "none";
}

// COMA OS DADOS DIGITADOS, VALIDA O NOME E ADICIONA OU ATUALIZA O PRODUTO NO STORAGE
function salvarProduto() {
  if (!isAdminPage) return;
  let produto = {
    nome: document.getElementById("nome").value.trim(),
    categoria: document.getElementById("categoria").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    preco: Number(document.getElementById("preco").value),
    quantidade: Number(document.getElementById("quantidade").value),
    estoqueMinimo: Number(document.getElementById("estoqueMinimo").value),
    status: document.getElementById("status").value,
  };

  // INTERROMPE A OPERACAO SE A CAIXA DE TEXTO DO NOME RETORNAR VAZIA
  if (produto.nome === "") {
    aviso("Informe o nome do produto");
    return;
  }

  // OPERALIZA O FILTRO ENTRE SALVAR NOVO ITEM OU ATUALIZAR ITEM EXISTENTE
  if (idProdutoEditando) {
    produto.id = idProdutoEditando;
    atualizarProdutoLocal(produto);
  } else {
    produto.id = produto.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
    adicionarProdutoLocal(produto);
  }

  fecharModal();
  carregarProdutos();
  atualizarResumo();
}

// RECUPERA AS INFORMAÇÕES DO PRODUTO SELECIONADO E PREENCHE OS CAMPOS DO MODAL PARA EDIÇÃO
function editarProduto(id) {
  if (!isAdminPage) return;
  let produto = buscarProdutoPorIdLocal(id);
  if (!produto) return;

  idProdutoEditando = id;
  document.getElementById("tituloModal").innerText = "Editar Produto";
  document.getElementById("nome").value = produto.nome;
  document.getElementById("quantidade").value = produto.quantidade;
  document.getElementById("estoqueMinimo").value = produto.estoqueMinimo;
  document.getElementById("categoria").value = produto.categoria;
  document.getElementById("descricao").value = produto.descricao;
  document.getElementById("preco").value = produto.preco;
  document.getElementById("status").value = produto.status;
  document.getElementById("modal").style.display = "flex";
}

// EXIBE UMA CAIXA DE CONFIRMAÇÃO ASSÍNCRONA E REMOVE COMPLETAMENTE O PRODUTO DO REGISTRO LOCAL
async function excluirProduto(id) {
  if (!isAdminPage) return;
  
  // CONFIRMA EXCLUSÃO DO PRODUTO RECORRENDO AO MODAL ASSINCRONO DO SISTEMA CENTRAL
  if (!(await confirmar("Deseja excluir este produto?"))) return;

  removerProdutoLocal(id);
  carregarProdutos();
  atualizarResumo();
}

// COMPUTA E RESTAURA TODOS OS CAMPOS DO FORMULÁRIO MODAL PARA SEUS VALORES PADRÕES INICIAIS
function limparFormulario() {
  if (!isAdminPage) return;
  document.getElementById("nome").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("quantidade").value = 0;
  document.getElementById("estoqueMinimo").value = 5;
  document.getElementById("status").value = "ativo";
}

// CONEXÃO COM O LOCALSTORAGE PARA EXTRAIR O CATALOGO EM FORMATO DE ARRAY
function buscarProdutosLocais() {
  return JSON.parse(localStorage.getItem(CHAVE_BANCO)) || [];
}

// CONVERTE A LISTA PASSADA POR PARAMETRO EM TEXTO E GRAVA DIRETAMENTE NO NAVEGADOR
function salvarListaNoStorage(lista) {
  localStorage.setItem(CHAVE_BANCO, JSON.stringify(lista));
}

// LOCALIZA UM OBJETO ESPECÍFICO DE PRODUTO FILTRANDO PELO SEU IDENTIFICADOR TEXTUAL ÚNICO
function buscarProdutoPorIdLocal(id) {
  const produtos = buscarProdutosLocais();
  return produtos.find((p) => p.id === id);
}

// INSERE UM NOVO PRODUTO NO FINAL DO ARRAY EXISTENTE E SALVA O RESULTADO NO LOCALSTORAGE
function adicionarProdutoLocal(novoProduto) {
  const produtos = buscarProdutosLocais();
  produtos.push(novoProduto);
  salvarListaNoStorage(produtos);
}

// MAPEIA OS PRODUTOS DO STORAGE SUBSTITUINDO OS DADOS ANTIGOS PELO PRODUTO ATUALIZADO
function atualizarProdutoLocal(produtoEditado) {
  let produtos = buscarProdutosLocais();
  produtos = produtos.map((p) =>
    p.id === produtoEditado.id ? produtoEditado : p
  );
  salvarListaNoStorage(produtos);
}

// FILTRA A LISTA DO STORAGE EXPULSANDO DEFINITIVAMENTE O REGISTRO DO PRODUTO APAGADO
function removerProdutoLocal(id) {
  let produtos = buscarProdutosLocais();
  produtos = produtos.filter((p) => p.id !== id);
  salvarListaNoStorage(produtos);
}

// ENCONTRA E CONTABILIZA A CONTA GLOBAL DE PRODUTOS BEM COMO A DIVISÃO ENTRE ATIVOS E INATIVOS
function resumoProdutosLocais() {
  const produtos = buscarProdutosLocais();
  const total = produtos.length;
  const ativos = Lore = produtos.filter((p) => p.status === "ativo").length;
  const inativos = total - ativos;
  return { total, ativos, inativos };
}

// COMPARA O TERMO DIGITADO NORMALIZADO COM OS NOMES DOS PRODUTOS DA LISTA E RETORNA OS ENCONTRADOS
function pesquisarProdutosLocais(termo) {
  const produtos = buscarProdutosLocais();
  const termoNormalizado = termo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return produtos.filter((p) => {
    const nomeNormalizado = p.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return nomeNormalizado.includes(termoNormalizado);
  });
}

// ENCERRA A AUTENTICAÇÃO DO ADMINISTRADOR DELETANDO SUA SESSÃO E MANDA PARA A TELA DE LOGIN
function sair() {
  localStorage.removeItem("adminLogado");
  window.location.href = "./login.html";
}
