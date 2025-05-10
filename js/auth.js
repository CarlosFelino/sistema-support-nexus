document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const recoveryModal = document.getElementById('recoveryModal');
    const recoveryLink = document.querySelector('.forgot-password');
    const modalClose = document.querySelector('.modal-close');
    const recoveryForm = document.getElementById('recoveryForm');
    const typeButtons = document.querySelectorAll('.type-btn');
    const showPasswordBtn = document.querySelector('.show-password');
    const loginForm = document.querySelector('.auth-form');

    // Toggle de tipo de usuário
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Toggle de mostrar senha
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const icon = showPasswordBtn.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    // Abrir modal de recuperação
    recoveryLink.addEventListener('click', (e) => {
        e.preventDefault();
        recoveryModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloqueia scroll
    });

    // Fechar modal
    modalClose.addEventListener('click', () => {
        closeModal();
    });

    // Fechar ao clicar fora
    recoveryModal.addEventListener('click', (e) => {
        if (e.target === recoveryModal) {
            closeModal();
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && recoveryModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Enviar formulário de recuperação
    recoveryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('recoveryEmail').value;
        
        if (!email.endsWith('@fatec.sp.gov.br')) {
            alert('Por favor, use seu email institucional (@fatec.sp.gov.br)');
            return;
        }
        
        // Simulação de envio (substitua por AJAX na implementação real)
        alert(`Link de recuperação enviado para: ${email}`);
        closeModal();
    });

    // Validação do formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const userType = document.querySelector('.type-btn.active').dataset.type;
            
            if (!email.endsWith('@fatec.sp.gov.br')) {
                alert('Por favor, use seu email institucional (@fatec.sp.gov.br)');
                return;
            }
            
            // Simulação de redirecionamento
            if (userType === 'suporte') {
                window.location.href = 'admin/index-adm.html';
            } else {
                window.location.href = 'professor/index-prof.html';
            }
        });
    }

    // Função para fechar modal
    function closeModal() {
        recoveryModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaura scroll
        recoveryForm.reset(); // Limpa o formulário
    }

    // Transição suave ao carregar
    document.body.classList.add('loaded');
});

//autenticacao.js
function protegerRota() {
  if (!usuarioAutenticado()) {
    window.location.href = '/entrar.html?redirect=' + encodeURIComponent(window.location.pathname);
  }
}
