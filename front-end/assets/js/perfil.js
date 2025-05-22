document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const photoInput = document.getElementById('photo-input');
    const profilePreview = document.getElementById('profile-preview');
    const removePhotoBtn = document.getElementById('remove-photo');
    const personalDataForm = document.getElementById('personal-data-form');
    const passwordForm = document.getElementById('password-form');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const userType = document.body.classList.contains('professor-dashboard') ? 'professor' : 'suporte';

    // Carregar dados do usuário do localStorage
    function loadUserData() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (!currentUser) {
            window.location.href = '../../login.html';
            return;
        }

        // Encontrar usuário completo na lista de usuários
        const userData = users.find(u => u.employeeId === currentUser.id) || {
            employeeId: currentUser.id,
            fullName: currentUser.name,
            email: currentUser.email,
            userType: currentUser.type,
            birthDate: '2000-01-01',
            phone: '(00) 00000-0000'
        };

        // Preencher formulário
        document.getElementById('registration').value = userData.employeeId;
        document.getElementById('fullname').value = userData.fullName;
        document.getElementById('email').value = userData.email;
        document.getElementById('birthdate').value = userData.birthDate || '';
        document.getElementById('phone').value = userData.phone || '';
        
        // Atualizar navbar
        updateNavbarProfile(userData);
    }

    // Atualizar navbar com dados do usuário
    function updateNavbarProfile(userData) {
        const navProfileImg = document.querySelector('.profile-dropdown .profile-avatar');
        const userNameElement = document.querySelector('.user-name');
        const userEmailElement = document.querySelector('.user-email');
        
        // Carregar foto do localStorage ou usar padrão
        const photoUrl = localStorage.getItem(`userPhoto_${userData.employeeId}`) || 
                        '../../assets/images/default-avatar.png';
        
        if (navProfileImg) navProfileImg.src = photoUrl;
        
        // Atualizar nome e email
        if (userNameElement) {
            userNameElement.textContent = 
                userType === 'professor' ? `Prof. ${userData.fullName.split(' ')[0]}` 
                                       : `Téc. ${userData.fullName.split(' ')[0]}`;
        }
        
        if (userEmailElement) {
            userEmailElement.textContent = userData.email;
        }
    }

    // Foto de Perfil
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 2MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePreview.src = event.target.result;
                // Salvar no localStorage
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser) {
                    localStorage.setItem(`userPhoto_${currentUser.id}`, event.target.result);
                    
                    // Atualizar navbar
                    const navProfileImg = document.querySelector('.profile-dropdown .profile-avatar');
                    if (navProfileImg) navProfileImg.src = event.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    });
    
    removePhotoBtn.addEventListener('click', function() {
        const defaultPhoto = '../../assets/images/default-avatar.png';
        profilePreview.src = defaultPhoto;
        photoInput.value = '';
        
        // Remover do localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            localStorage.removeItem(`userPhoto_${currentUser.id}`);
            
            // Atualizar navbar
            const navProfileImg = document.querySelector('.profile-dropdown .profile-avatar');
            if (navProfileImg) navProfileImg.src = defaultPhoto;
        }
    });
    
    // Mostrar/Esconder Senha
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Formulário de Dados Pessoais
    personalDataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação do telefone
        const phone = document.getElementById('phone');
        if (!phone.validity.valid) {
            alert('Por favor, insira um número de telefone válido no formato (XX) XXXXX-XXXX');
            return;
        }
        
        // Obter dados atuais
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.employeeId === currentUser.id);
        
        if (userIndex === -1) {
            alert('Usuário não encontrado');
            return;
        }
        
        // Criar objeto com dados atualizados
        const updatedData = {
            ...users[userIndex], // Mantém os dados existentes
            employeeId: document.getElementById('registration').value,
            fullName: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            birthDate: document.getElementById('birthdate').value,
            phone: document.getElementById('phone').value
        };
        
        // Atualizar lista de usuários
        const updatedUsers = [...users];
        updatedUsers[userIndex] = updatedData;
        
        // Salvar no localStorage
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Atualizar currentUser
        localStorage.setItem('currentUser', JSON.stringify({
            id: updatedData.employeeId,
            name: updatedData.fullName,
            email: updatedData.email,
            type: userType
        }));
        
        // Atualizar navbar
        updateNavbarProfile(updatedData);
        
        // Feedback
        showFeedback('Dados pessoais atualizados com sucesso!', 'success');
    });
    
    // Formulário de Senha
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validações
        if (newPassword.length < 6) {
            showFeedback('A nova senha deve ter no mínimo 6 caracteres', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showFeedback('As senhas não coincidem', 'error');
            return;
        }
        
        // Verificar senha atual
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.employeeId === currentUser.id);
        
        if (userIndex === -1) {
            showFeedback('Usuário não encontrado', 'error');
            return;
        }
        
        if (users[userIndex].password !== currentPassword) {
            showFeedback('Senha atual incorreta', 'error');
            return;
        }

        // Atualizar senha
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Feedback visual
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Senha alterada!';
        submitBtn.disabled = true;
        
        // Resetar formulário e botão após 3 segundos
        setTimeout(() => {
            passwordForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Esconder senhas novamente
            document.querySelectorAll('.password-field input').forEach(input => {
                input.type = 'password';
            });
            document.querySelectorAll('.toggle-password i').forEach(icon => {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            });
        }, 3000);
    });

    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        const value = this.value.replace(/\D/g, '');
        if (value.length > 0) {
            this.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
        }
    });

    // Mostrar feedback ao usuário
    function showFeedback(message, type) {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = `profile-feedback ${type}`;
        feedbackElement.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedbackElement);
        
        setTimeout(() => {
            feedbackElement.classList.add('fade-out');
            setTimeout(() => feedbackElement.remove(), 500);
        }, 3000);
    }

    // Inicialização
    loadUserData();
});