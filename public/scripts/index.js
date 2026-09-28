/* Painel: liga o botão de excluir de cada card ao modal de confirmação */
import Modal from "./modal.js";

const modal = Modal({ animateClasses: ["animate-pop", "back"] });
const deleteForm = document.querySelector("#delete-job");
const title = document.querySelector("#modal-title");

document.querySelectorAll(".cards .card").forEach((card) => {
  card.querySelector("button.delete").addEventListener("click", (event) => {
    deleteForm.setAttribute("action", "/job/delete/" + card.dataset.id);
    title.textContent = "Excluir “" + card.dataset.name + "”";
    modal.open(event);
  });
});
/* Fim de index.js */
