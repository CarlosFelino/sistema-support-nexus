document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const registerForm = document.querySelector('.cadastro-container');
    const typeButtons = document.querySelectorAll('.type-btn');
    const showPasswordBtns = document.querySelectorAll('.show-password');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatchFeedback = document.querySelector('.password-match-feedback');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text strong');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.querySelector('.btn-submit');

    // Máscara para telefone
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            const formattedValue = formatPhoneNumber(value);
            e.target.value = formattedValue;
        });
    }

    // Toggle de tipo de usuário
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mostrar/ocultar senha
    showPasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // Verificar correspondência de senhas
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }

    // Medidor de força da senha
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
            checkPasswordMatch();
        });
    }

    // Validação do formulário
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
                
                // Simular envio (substituir por chamada AJAX)
                setTimeout(() => {
                    alert('Cadastro realizado com sucesso! Redirecionando para login...');
                    window.location.href = 'login.html';
                }, 1500);
            }
        });
    }

    // Funções auxiliares
    function formatPhoneNumber(value) {
        if (!value) return '';
        
        if (value.length <= 2) {
            return `(${value}`;
        } else if (value.length <= 7) {
            return `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }
    }

    function checkPasswordMatch() {
        if (passwordInput.value && confirmPasswordInput.value) {
            if (passwordInput.value !== confirmPasswordInput.value) {
                passwordMatchFeedback.textContent = 'As senhas não coincidem';
                passwordMatchFeedback.className = 'password-match-feedback visible no-match';
                return false;
            } else {
                passwordMatchFeedback.textContent = 'As senhas coincidem';
                passwordMatchFeedback.className = 'password-match-feedback visible match';
                return true;
            }
        }
        return false;
    }

    function checkPasswordStrength(password) {
        const strength = calculatePasswordStrength(password);
        strengthBar.style.width = `${strength.percentage}%`;
        strengthBar.style.backgroundColor = strength.color;
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length > 5) strength += 1;
        if (password.length > 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        if (strength <= 2) {
            return { percentage: 33, color: '#ff3860', text: 'fraca' };
        } else if (strength <= 4) {
            return { percentage: 66, color: '#ffdd57', text: 'média' };
        } else {
            return { percentage: 100, color: '#09c372', text: 'forte' };
        }
    }

    function validateForm() {
        let isValid = true;
        const emailInput = document.getElementById('email');
        
        // Validar email institucional
        if (emailInput && !emailInput.value.endsWith('@fatec.sp.gov.br')) {
            emailInput.classList.add('invalid');
            alert('Por favor, use seu email institucional (@fatec.sp.gov.br)');
            isValid = false;
        }
        
        // Validar correspondência de senhas
        if (!checkPasswordMatch()) {
            isValid = false;
        }
        
        return isValid;
    }
});