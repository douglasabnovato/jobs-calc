/* Modal de confirmação acessível: foco no botão Cancelar, Esc fecha, o fundo fica inerte (#19)
   e o foco volta para quem abriu */
export default function Modal({ animateClasses = [] }) {
  const wrapper = document.querySelector(".modal-wrapper");
  const element = document.querySelector(".modal");
  const cancelButton = element.querySelector("[data-cancel]");
  let opener = null;
  let inertes = [];

  /* Põe "inert" nos irmãos do modal em cada nível até o body, guardando só os que mudaram */
  function inertBackground() {
    inertes = [];
    for (let node = wrapper; node && node !== document.body; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling === node || sibling.inert || sibling.tagName === "SCRIPT") continue;
        sibling.inert = true;
        inertes.push(sibling);
      }
    }
  }

  /* Devolve o fundo ao teclado e ao leitor de tela */
  function restoreBackground() {
    inertes.forEach((el) => {
      el.inert = false;
    });
    inertes = [];
  }

  /* Abre o modal guardando o elemento que o acionou */
  function open(event) {
    opener = event && event.currentTarget ? event.currentTarget : document.activeElement;
    wrapper.hidden = false;
    inertBackground();
    wrapper.classList.add("on");
    element.classList.add(...animateClasses);
    document.addEventListener("keydown", onKey);
    cancelButton.focus();
  }

  /* Fecha o modal e devolve o foco */
  function close() {
    document.removeEventListener("keydown", onKey);
    wrapper.classList.remove("on");
    element.classList.remove(...animateClasses);
    wrapper.hidden = true;
    restoreBackground();
    if (opener) opener.focus();
  }

  /* Esc fecha; Tab fica preso entre os dois botões */
  function onKey(event) {
    if (event.key === "Escape") return close();
    if (event.key !== "Tab") return undefined;
    const buttons = element.querySelectorAll("button");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
    return undefined;
  }

  cancelButton.addEventListener("click", close);
  return { open, close };
}
/* Fim de modal.js */
