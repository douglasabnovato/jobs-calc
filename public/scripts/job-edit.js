/* Edição de job: abre o modal de exclusão */
import Modal from "./modal.js";

const modal = Modal({ animateClasses: ["animate-pop", "back"] });
document.querySelector(".open-modal").addEventListener("click", modal.open);
/* Fim de job-edit.js */
