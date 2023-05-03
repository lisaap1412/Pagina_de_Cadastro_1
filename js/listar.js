export default function initListar() {
    const botaoAbrir = document.querySelector('[data-modal="abre"]');
    const botaoFechar = document.querySelector('[data-modal="feche"]');
    const containerModal = document.querySelector('[data-modal="containerr"]');
    
    if(botaoAbrir && botaoFechar && containerModal) {
      
      function toggleModal(event) {
        event.preventDefault();
        containerModal.classList.toggle('ativo');
      }
      function cliqueForaModal(event) {
        if(event.target === this) {
          toggleModal(event);
        }
      }
    
      botaoAbrir.addEventListener('click', toggleModal);
      botaoFechar.addEventListener('click', toggleModal);
      containerModal.addEventListener('click', cliqueForaModal);
    }
  }