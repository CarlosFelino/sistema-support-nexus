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

    // Evento de clique no botão de submit
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
                
                // Criar objeto com os dados do formulário
                const formData = {
                    userType: document.querySelector('.type-btn.active').dataset.type,
                    employeeId: document.getElementById('employeeId').value,
                    fullName: document.getElementById('fullName').value,
                    birthDate: document.getElementById('birthDate').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    password: document.getElementById('password').value,
                    registrationDate: new Date().toISOString()
                };

                // 1. Salvar no localStorage
                try {
                    saveToLocalStorage(formData);
                    
                    // 2. Simular envio para servidor
                    simulateServerSubmission(formData)
                        .then(() => {
                            localStorage.setItem('showRegistrationSuccess', 'true');
                            window.location.href = 'login.html';
                        })
                        .catch(error => {
                            console.error('Erro:', error);
                            alert('Erro no cadastro: ' + error.message);
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '<i class="fas fa-save"></i> Cadastrar Usuário';
                        });
                } catch (error) {
                    console.error('Erro:', error);
                    alert('Erro: ' + error.message);
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

    function checkPasswordMatch() {
        if (!passwordInput.value || !confirmPasswordInput.value) return false;
        
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

    function saveToLocalStorage(userData) {
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = existingUsers.some(user => 
            user.email === userData.email || user.employeeId === userData.employeeId
        );
        
        if (userExists) {
            throw new Error('Usuário já cadastrado');
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
        if (localStorage.getItem('showRegistrationSuccess') === 'true') {
            showSuccessMessage();
            localStorage.removeItem('showRegistrationSuccess');
        }
    }
});

function showSuccessMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'alert alert-success';
    messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> Usuário cadastrado com sucesso!';
    
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(messageDiv, main.firstChild);
        setTimeout(() => messageDiv.remove(), 5000);
    }
}