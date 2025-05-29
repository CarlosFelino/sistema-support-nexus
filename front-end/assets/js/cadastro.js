document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const registerForm = document.querySelector('.cadastro-container');
    const showPasswordBtns = document.querySelectorAll('.show-password');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatchFeedback = document.querySelector('.password-match-feedback');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text strong');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.querySelector('.btn-submit');
    const formFields = document.querySelectorAll('.form-control');

    // Máscara para telefone
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            const formattedValue = formatPhoneNumber(value);
            e.target.value = formattedValue;
        });
    }

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

    // Limpar erros ao digitar
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            this.classList.remove('invalid');
            const errorMsg = this.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        });
    });

    // Evento de clique no botão de submit
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
                
                // Criar objeto com os dados do formulário
                const formData = {
                    userType: 'professor',
                    employeeId: document.getElementById('employeeId').value.trim(),
                    fullName: document.getElementById('fullName').value.trim(),
                    birthDate: formatDate(document.getElementById('birthDate').value),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    password: simpleHash(document.getElementById('password').value),
                    registrationDate: new Date().toISOString()
                };

                // 1. Salvar no localStorage
                try {
                    saveToLocalStorage(formData);
                    
                    // 2. Simular envio para servidor
                    simulateServerSubmission(formData)
                        .then(() => {
                            localStorage.setItem('temporaryUserEmail', formData.email);
                            window.location.href = 'login.html?from=register';
                        })
                        .catch(error => {
                            console.error('Erro:', error);
                            showFormError(error.message);
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '<i class="fas fa-save"></i> Cadastrar Usuário';
                        });
                } catch (error) {
                    console.error('Erro:', error);
                    showFormError(error.message);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-save"></i> Cadastrar Usuário';
                }
            }
        });
    }

    // Funções auxiliares
    function formatPhoneNumber(value) {
        if (!value) return '';
        if (value.length <= 2) return `(${value}`;
        if (value.length <= 7) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
        return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    function checkPasswordMatch() {
        if (!passwordInput.value || !confirmPasswordInput.value) {
            passwordMatchFeedback.textContent = '';
            passwordMatchFeedback.className = 'password-match-feedback';
            return false;
        }
        
        const match = passwordInput.value === confirmPasswordInput.value;
        passwordMatchFeedback.textContent = match ? 'As senhas coincidem' : 'As senhas não coincidem';
        passwordMatchFeedback.className = `password-match-feedback visible ${match ? 'match' : 'no-match'}`;
        return match;
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length > 5) strength++;
        if (password.length > 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        const strengthData = strength <= 2 ? 
            { percentage: 33, color: '#ff3860', text: 'fraca' } :
            strength <= 4 ? 
            { percentage: 66, color: '#ffdd57', text: 'média' } :
            { percentage: 100, color: '#09c372', text: 'forte' };
        
        strengthBar.style.width = `${strengthData.percentage}%`;
        strengthBar.style.backgroundColor = strengthData.color;
        strengthText.textContent = strengthData.text;
        strengthText.style.color = strengthData.color;
    }

    function validateForm() {
        let isValid = true;
        const fields = [
            { id: 'employeeId', message: 'Matrícula é obrigatória' },
            { id: 'fullName', message: 'Nome completo é obrigatório' },
            { id: 'birthDate', message: 'Data de nascimento é obrigatória' },
            { id: 'email', message: 'Email institucional é obrigatório' },
            { id: 'phone', message: 'Telefone é obrigatório', minLength: 14 },
            { id: 'password', message: 'Senha é obrigatória', minLength: 6 }
        ];

        // Validação básica dos campos
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element.value || (field.minLength && element.value.length < field.minLength)) {
                showFieldError(field.id, field.message);
                isValid = false;
            }
        });

        // Validação de email institucional
        const emailInput = document.getElementById('email');
        if (emailInput && !emailInput.value.endsWith('@fatec.sp.gov.br')) {
            showFieldError('email', 'Por favor, use seu email institucional (@fatec.sp.gov.br)');
            isValid = false;
        }

        // Validação de correspondência de senhas
        if (!checkPasswordMatch()) {
            isValid = false;
        }

        // Validação de data de nascimento
        const birthDateInput = document.getElementById('birthDate');
        if (birthDateInput.value) {
            const birthDate = new Date(birthDateInput.value);
            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 100); // 100 anos atrás
            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() - 14); // Mínimo 14 anos

            if (birthDate < minDate || birthDate > maxDate) {
                showFieldError('birthDate', 'Data de nascimento inválida');
                isValid = false;
            }
        }

        return isValid;
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        let errorElement = field.nextElementSibling;
        
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        errorElement.textContent = message;
        field.classList.add('invalid');
    }

    function showFormError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const formHeader = document.querySelector('.cadastro-container h2');
        if (formHeader) {
            formHeader.parentNode.insertBefore(errorDiv, formHeader.nextSibling);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }

    function simpleHash(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = (hash << 5) - hash + password.charCodeAt(i);
            hash |= 0; // Converte para 32bit integer
        }
        return hash.toString();
    }

    function saveToLocalStorage(userData) {
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verificar se email já existe
        if (existingUsers.some(user => user.email === userData.email)) {
            throw new Error('Este email já está cadastrado');
        }
        
        // Verificar se matrícula já existe
        if (existingUsers.some(user => user.employeeId === userData.employeeId)) {
            throw new Error('Esta matrícula já está cadastrada');
        }
        
        existingUsers.push(userData);
        localStorage.setItem('users', JSON.stringify(existingUsers));
    }

    function simulateServerSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: 200, message: 'Sucesso', data });
            }, 1000);
        });
    }
});

// Código para mostrar mensagem na página de login
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('login.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('from') === 'register') {
            showSuccessMessage();
        }
    }
});

function showSuccessMessage() {
    const email = localStorage.getItem('temporaryUserEmail');
    if (!email) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'alert alert-success';
    messageDiv.innerHTML = `
        <i class="fas fa-check-circle"></i> 
        Usuário ${email} cadastrado com sucesso! Faça login para continuar.
    `;
    
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(messageDiv, main.firstChild);
        setTimeout(() => {
            messageDiv.remove();
            localStorage.removeItem('temporaryUserEmail');
        }, 5000);
    }
}