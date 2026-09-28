/* Modal de confirmação acessível: foco no botão Cancelar, Esc fecha e o foco volta para quem abriu */
export default function Modal({ animateClasses = [] }) {
  const wrapper = document.querySelector(".modal-wrapper");
  const element = document.querySelector(".modal");
  const cancelButton = element.querySelector("[data-cancel]");
  let opener = null;

  /* Abre o modal guardando o elemento que o acionou */
  function open(event) {
    opener = event && event.currentTarget ? event.currentTarget : document.activeElement;
    wrapper.hidden = false;
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
