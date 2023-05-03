export default function initDeletar() {
    const botaoAbri = document.querySelector('[data-modal="abri"]');
    const botaoFecha = document.querySelector('[data-modal="fecha"]');
    const containeModal = document.querySelector('[data-modal="containe"]');
    
    if(botaoAbri && botaoFecha && containeModal) {
      
      function toggleModal(event) {
        event.preventDefault();
        containeModal.classList.toggle('ativo');
      }
      function cliqueForaModal(event) {
        if(event.target === this) {
          toggleModal(event);
        }
      }
    
      botaoAbri.addEventListener('click', toggleModal);
      botaoFecha.addEventListener('click', toggleModal);
      containeModal.addEventListener('click', cliqueForaModal);
    }
  }