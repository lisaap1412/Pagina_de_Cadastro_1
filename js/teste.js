export default function initCrud() {
  // Selecionando os elementos HTML relevantes
  const idInput = document.getElementById("id-input");
  const clienteInput = document.getElementById("cliente-input");
  const hospitalInput = document.getElementById("hospital-input");
  const quartoInput = document.getElementById("quarto-input");
  const enviarBtn = document.querySelector(".botao-salvar");
  const editarBtn = document.querySelector(".botao-editar");
  const deletarBtn = document.querySelector(".botao-deletar");
  const listarBtn = document.querySelector(".botao-listar");
  const idEditarInput = document.getElementById("id");
  const idDeletarInput = document.getElementById("text-edti");
  const lista = document.getElementById("lista-registros");
  const idED = document.getElementById("id");
  const clienteED = document.getElementById("cliente");
  const hospitalED = document.getElementById("hospital");
  const quartoED = document.getElementById("quarto");

  const registros = []; // array para armazenar os registros

  function criarRegistro() {
    // Verificar se o botão "Editar" foi clicado
    if (editarBtn.getAttribute("data-status") === "editando") {
      editarRegistro();
      editarBtn.setAttribute("data-status", "");
      editarBtn.textContent = "Editar";
      return;
    }

    const id = idInput.value;
    const cliente = clienteInput.value;
    const hospital = hospitalInput.value;
    const quarto = quartoInput.value;

    // Verificar se o id já existe na lista local
    const registroExistente = registros.find((registro) => registro.id === id);
    if (registroExistente) {
      const confirmacao = confirm(
        "Já existe um registro com este id. Deseja substituí-lo?"
      );
      if (!confirmacao) {
        return;
      }
      // Se o usuário confirmou a substituição, remover o registro existente da lista local
      const indiceRegistroExistente = registros.indexOf(registroExistente);
      registros.splice(indiceRegistroExistente, 1);
    }

    // Verificar se os campos obrigatórios foram preenchidos
    if (!id || (!cliente && !hospital && !quarto)) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    const xhrVerificaId = new XMLHttpRequest();
    xhrVerificaId.open("GET", `http://localhost:5504/api/registrar/${id}`);
    xhrVerificaId.onload = function () {
      if (xhrVerificaId.status === 200 && !registroExistente) {
        const registroExistenteAPI = JSON.parse(xhrVerificaId.response);
        if (registroExistenteAPI) {
          const confirmacao = confirm(
            "Já existe um registro com este id na API. Deseja substituí-lo?"
          );
          if (!confirmacao) {
            return;
          }
          // Se o usuário confirmou a substituição, remover o registro existente da API
          const xhrRemoveRegistro = new XMLHttpRequest();
          xhrRemoveRegistro.open(
            "DELETE",
            `http://localhost:5504/api/registrar/${id}`
          );
          xhrRemoveRegistro.onload = function () {
            if (xhrRemoveRegistro.status === 200) {
              alert("Registro existente na API removido com sucesso!");
            } else {
              alert("Erro ao remover registro existente na API!");
            }
          };
          xhrRemoveRegistro.send();
        }
      }
      // Criar novo registro ou atualizar registro existente
      const xhrCriaRegistro = new XMLHttpRequest();
      const metodoHTTP = registroExistente ? "PUT" : "POST";
      const urlAPI = registroExistente
        ? `http://localhost:5504/api/registrar/${id}`
        : "http://localhost:5504/api/registrar";

      xhrCriaRegistro.open(metodoHTTP, urlAPI);
      xhrCriaRegistro.setRequestHeader("Content-Type", "application/json");
      xhrCriaRegistro.onload = function () {
        if (xhrCriaRegistro.status === 200) {
          alert("Registro criado com sucesso!");
          // Adicionar o registro à lista local após criar/atualizar na API
          const novoRegistro = { id, cliente, hospital, quarto };
          registros.push(novoRegistro);
          try {
            salvarEmArquivo(id, cliente, hospital, quarto);
          } catch (error) {
            errorHandler(error, "Erro ao salvar em arquivo!");
          }
        } else {
          alert("Erro ao criar registro!");
        }
      };
      xhrCriaRegistro.open("POST", urlAPI);
      xhrCriaRegistro.setRequestHeader("Content-Type", "application/json");
      const novoRegistro = { id, cliente, hospital, quarto };
      xhrCriaRegistro.send(JSON.stringify(novoRegistro));
    };

    idInput.value = "";
    clienteInput.value = "";
    hospitalInput.value = "";
    quartoInput.value = "";
    xhrVerificaId.send();
  }

  // Adicionar o evento de clique para o botão "Salvar"
  enviarBtn.addEventListener("click", criarRegistro);

  function salvarEmArquivo(id, cliente, hospital, quarto) {
    // Criar um objeto com os dados do registro
    const registro = {
      id: id,
      cliente: cliente,
      hospital: hospital,
      quarto: quarto,
    };

    // Obter a lista de registros armazenados em localStorage
    let registros = JSON.parse(localStorage.getItem("registros")) || [];

    // Adicionar o novo registro à lista de registros
    registros.push(registro);

    // Salvar a lista atualizada de registros em localStorage
    localStorage.setItem("registros", JSON.stringify(registros));
  }

  // Função para enviar uma solicitação AJAX para ler um registro existente
  function lerRegistro(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:5504/api/registrar/${id}`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        idInput.value = data.id;
        clienteInput.value = data.cliente;
        hospitalInput.value = data.hospital;
        quartoInput.value = data.quarto;
      } else {
        alert("Erro ao ler registro!");
      }
    };
    xhr.send();
  }

  function listarRegistros() {
    // Obter a lista de registros armazenados em localStorage
    let registros = JSON.parse(localStorage.getItem("registros")) || [];

    // Limpar a lista de registros na página
    if (lista) {
      lista.innerHTML = "";
    } else {
      console.error('Elemento "lista-registros" não encontrado na página.');
    }

    // Loop sobre os registros e adicionar cada um à lista na página
    registros.forEach((registro) => {
      const item = document.createElement("li");
      item.textContent = `ID: ${registro.id} - Cliente: ${registro.cliente} - Hospital: ${registro.hospital} - Quarto: ${registro.quarto}`;
      if (lista) {
        lista.appendChild(item);
      } else {
        console.error('Elemento "lista-registros" não encontrado na página.');
      }
    });
  }

  // Adicionar o evento de clique para o botão "Listar"
  listarBtn.addEventListener("click", listarRegistros);

  function editarRegistro() {
    const id = idEditarInput.value;
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    const index = registros.findIndex((registro) => registro.id === id);

    if (index === -1) {
      alert("Não foi possível encontrar um registro com esse ID!");
      return;
    }

    const novoCliente = clienteED.value || registros[index].cliente;
    const novoHospital = hospitalED.value || registros[index].hospital;
    const novoQuarto = quartoED.value || registros[index].quarto;

    registros[index].cliente = novoCliente;
    registros[index].hospital = novoHospital;
    registros[index].quarto = novoQuarto;

    localStorage.setItem("registros", JSON.stringify(registros));
    idEditarInput.value = "";
    clienteED.value = "";
    hospitalED.value = "";
    quartoED.value = "";
    alert("Registro editado com sucesso!");

    // Selecionar o elemento da lista correspondente ao índice encontrado
    const lista = document.getElementById("lista-registros");
    const registroAtualizado = lista.children[index];
    alert("Registro salvo com sucesso!");
    if (registroAtualizado && registroAtualizado.children.length >= 3) {
      registroAtualizado.children[0].textContent = novoCliente;
      registroAtualizado.children[1].textContent = novoHospital;
      registroAtualizado.children[2].textContent = novoQuarto;
    }
  }

  // Adicionar o evento de clique para o botão "Editar"
  editarBtn.addEventListener("click", editarRegistro);

  function deletarRegistro() {
    const id = idDeletarInput.value;
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    const index = registros.findIndex((registro) => registro.id === id);

    if (index === -1) {
      alert("Não foi possível encontrar um registro com esse ID!");
      return;
    }

    if (registros.filter((registro) => registro.id === id).length > 1) {
      const registrosComMesmoId = registros.filter(
        (registro) => registro.id === id
      );
      const selecaoUsuario = prompt(
        `Existem ${registrosComMesmoId.length} registros com o mesmo ID. Favor selecionar o número do registro que deseja deletar:`
      );

      if (selecaoUsuario === null) {
        return;
      }

      const indexSelecionado = Number(selecaoUsuario) - 1;

      if (
        indexSelecionado < 0 ||
        indexSelecionado >= registrosComMesmoId.length
      ) {
        alert("Seleção inválida! Favor selecionar um número válido.");
        return;
      }

      registros.splice(
        registros.indexOf(registrosComMesmoId[indexSelecionado]),
        1
      );
    } else {
      registros.splice(index, 1);
    }

    localStorage.setItem("registros", JSON.stringify(registros));
    idInput.value = "";
    clienteInput.value = "";
    hospitalInput.value = "";
    quartoInput.value = "";
    alert("Registro deletado com sucesso!");
  }

  // Adicionar o evento de clique para o botão "Deletar"
  deletarBtn.addEventListener("click", deletarRegistro);
}
