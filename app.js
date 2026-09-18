// ============================================================
// CONCEITO 1: localStorage
// É uma "gaveta" que o próprio navegador/celular guarda pra você.
// Só aceita texto, então pra guardar uma lista/objeto a gente
// converte com JSON.stringify() antes de salvar, e JSON.parse()
// depois de ler de volta.
// ============================================================

// ---------- Data de hoje ----------
const elementoData = document.getElementById("data-hoje");
const hoje = new Date();
elementoData.textContent = hoje.toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

// ---------- Foco do dia ----------
const inputFoco = document.getElementById("input-foco");

inputFoco.value = localStorage.getItem("foco-do-dia") || "";

inputFoco.addEventListener("input", () => {
  localStorage.setItem("foco-do-dia", inputFoco.value);
});

// ============================================================
// CONCEITO 2: manipular o DOM (a árvore de elementos da página)
// document.createElement() cria um elemento na memória.
// elemento.appendChild() coloca ele de fato na tela.
// ============================================================

// ---------- Tarefas ----------
const formTarefa = document.getElementById("form-tarefa");
const inputTarefa = document.getElementById("input-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");

function carregarTarefas() {
  const salvas = localStorage.getItem("tarefas");
  return salvas ? JSON.parse(salvas) : [];
}

function salvarTarefas(tarefas) {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function desenharTarefas() {
  const tarefas = carregarTarefas();
  listaTarefas.innerHTML = "";

  tarefas.forEach((tarefa, indice) => {
    const li = document.createElement("li");
    if (tarefa.feita) li.classList.add("feita");

    const span = document.createElement("span");
    span.textContent = tarefa.texto;
    span.addEventListener("click", () => {
      const atuais = carregarTarefas();
      atuais[indice].feita = !atuais[indice].feita;
      salvarTarefas(atuais);
      desenharTarefas();
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "✕";
    botaoExcluir.addEventListener("click", () => {
      const atuais = carregarTarefas();
      atuais.splice(indice, 1);
      salvarTarefas(atuais);
      desenharTarefas();
    });

    li.appendChild(span);
    li.appendChild(botaoExcluir);
    listaTarefas.appendChild(li);
  });
}

formTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const texto = inputTarefa.value.trim();
  if (!texto) return;

  const tarefas = carregarTarefas();
  tarefas.push({ texto, feita: false });
  salvarTarefas(tarefas);

  inputTarefa.value = "";
  desenharTarefas();
});

desenharTarefas();

// ---------- Notas rápidas das áreas ----------
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  const area = card.dataset.area;
  const textarea = card.querySelector("textarea");
  const chave = `nota-${area}`;

  textarea.value = localStorage.getItem(chave) || "";

  textarea.addEventListener("input", () => {
    localStorage.setItem(chave, textarea.value);
  });
});

// ---------- Service worker (deixa o app instalável/offline) ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
