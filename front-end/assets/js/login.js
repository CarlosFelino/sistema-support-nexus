document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const recoveryForm = document.getElementById('recoveryForm');
    const recoveryModal = document.getElementById('recoveryModal');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const modalClose = document.querySelector('.modal-close');
    const showPasswordBtn = document.querySelector('.show-password');
    const passwordInput = document.getElementById('password');
    const recoveryFeedback = document.getElementById('recoveryFeedback');
    const emailInput = document.getElementById('email');
    const recoveryEmailInput = document.getElementById('recoveryEmail');

    // Estado da aplicação
    let isLoading = false;

    // Mostrar/ocultar senha
    if (showPasswordBtn && passwordInput) {
        showPasswordBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
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
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (isLoading) return;
        
        recoveryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        recoveryEmailInput.focus();
    });

    // Fechar modal
    modalClose.addEventListener('click', closeModal);
    recoveryModal.addEventListener('click', function(e) {
        if (e.target === recoveryModal) {
            closeModal();
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && recoveryModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Validação em tempo real do email
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmailInput(this);
        });
    }

    if (recoveryEmailInput) {
        recoveryEmailInput.addEventListener('input', function() {
            validateEmailInput(this);
        });
    }

    // Validação do formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (isLoading) return;
            
            const email = emailInput.value;
            const password = passwordInput.value;
            
            // Validação do email institucional
            if (!validateFatecEmail(email)) {
                showError('Por favor, use seu email institucional (@fatec.sp.gov.br)');
                return;
            }

            // Validação da senha
            if (password.length < 6) {
                showError('A senha deve ter pelo menos 6 caracteres');
                return;
            }
            
            setLoading(true);
            
            try {
                // Usar a API simulada para login
                const response = await mockApi.login(email, password);
                
                if (response.success) {
                    // Obter informações completas do usuário
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const user = users.find(u => u.email === email);
                    
                    if (!user) {
                        throw new Error('Usuário não encontrado');
                    }
                    
                    // Redirecionar conforme o tipo de usuário
                    redirectUser(user.userType);
                } else {
                    throw new Error(response.message || 'Email ou senha incorretos');
                }
            } catch (error) {
                showError(error.message);
            } finally {
                setLoading(false);
            }
        });
    }

    // Formulário de recuperação de senha
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (isLoading) return;
            
            const email = recoveryEmailInput.value;
            
            if (!validateFatecEmail(email)) {
                showRecoveryError('Por favor, use seu email institucional (@fatec.sp.gov.br)');
                return;
            }
            
            setLoading(true);
            
            try {
                // Verificar se o email existe
                const response = await mockApi.requestPasswordReset(email);
                
                if (response.success) {
                    showRecoverySuccess(response.message);
                    recoveryForm.reset();
                    
                    // Fechar modal após 3 segundos
                    setTimeout(() => {
                        closeModal();
                    }, 3000);
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                showRecoveryError(error.message);
            } finally {
                setLoading(false);
            }
        });
    }

    // Funções auxiliares
    function validateFatecEmail(email) {
        const fatecEmailRegex = /^[a-zA-Z0-9._-]+@fatec\.sp\.gov\.br$/;
        return fatecEmailRegex.test(email);
    }

    function validateEmailInput(input) {
        if (input.value && !validateFatecEmail(input.value)) {
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    }

    function showError(message) {
        let errorElement = document.querySelector('.login-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'login-error';
            loginForm.insertBefore(errorElement, loginForm.firstChild);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    function showRecoveryError(message) {
        recoveryFeedback.textContent = message;
        recoveryFeedback.className = 'error';
        recoveryFeedback.style.display = 'block';
    }

    function showRecoverySuccess(message) {
        recoveryFeedback.textContent = message;
        recoveryFeedback.className = 'success';
        recoveryFeedback.style.display = 'block';
    }

    function setLoading(loading) {
        isLoading = loading;
        
        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
            if (loading) {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            } else {
                button.disabled = false;
                if (button === loginForm.querySelector('button[type="submit"]')) {
                    button.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
                } else {
                    button.innerHTML = '<span>Enviar Link</span><i class="fas fa-paper-plane"></i>';
                }
            }
        });
    }

    function closeModal() {
        recoveryModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        recoveryFeedback.style.display = 'none';
        recoveryForm.reset();
    }

    function redirectUser(userType) {
        // Verificar se há um token válido
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            window.location.href = 'login.html';
            return;
        }
        
        // Redirecionar conforme o tipo de usuário
        switch(userType) {
            case 'professor':
                window.location.href = 'pages/professor/painel-professor.html';
                break;
            case 'suporte':
                window.location.href = 'pages/suporte/painel-suporte.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }

    // Proteger rotas (exemplo)
    function protegerRota() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
        }
    }

    // Verificar autenticação ao carregar
    if (window.location.pathname.includes('pages/')) {
        protegerRota();
    }
});
