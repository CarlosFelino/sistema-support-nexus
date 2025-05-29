document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const photoInput = document.getElementById('photo-input');
    const profilePreview = document.getElementById('profile-preview');
    const removePhotoBtn = document.getElementById('remove-photo');
    const personalDataForm = document.getElementById('personal-data-form');
    const passwordForm = document.getElementById('password-form');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const userType = document.body.classList.contains('professor-dashboard') ? 'professor' : 'suporte';

    // Carregar dados do usuário
    function loadUserData() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = '../../login.html';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
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
        
        // Carregar foto se existir
        const photoUrl = localStorage.getItem(`userPhoto_${userData.employeeId}`) || 
                        '../../assets/images/default-avatar.png';
        profilePreview.src = photoUrl;
        
        updateNavbarProfile(userData);
    }

    // Atualizar navbar
    function updateNavbarProfile(userData) {
        const navProfileImg = document.querySelector('.profile-dropdown .profile-avatar');
        const userNameElement = document.querySelector('.user-name');
        const userEmailElement = document.querySelector('.user-email');
        
        const photoUrl = localStorage.getItem(`userPhoto_${userData.employeeId}`) || 
                        '../../assets/images/default-avatar.png';
        
        if (navProfileImg) navProfileImg.src = photoUrl;
        
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
        if (!file) return;

        // Validações
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showFeedback('Apenas imagens JPEG ou PNG são permitidas', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showFeedback('A imagem deve ter no máximo 2MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            profilePreview.src = event.target.result;
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                localStorage.setItem(`userPhoto_${currentUser.id}`, event.target.result);
                
                // Atualizar navbar
                const navProfileImg = document.querySelector('.profile-dropdown .profile-avatar');
                if (navProfileImg) navProfileImg.src = event.target.result;
                
                showFeedback('Foto de perfil atualizada com sucesso!', 'success');
            }
        };
        reader.readAsDataURL(file);
    });
    
    removePhotoBtn.addEventListener('click', function() {
        if (!confirm('Tem certeza que deseja remover sua foto de perfil?')) {
            return;
        }
        
        const defaultPhoto = '../../assets/images/default-avatar.png';
        profilePreview.src = defaultPhoto;
        photoInput.value = '';
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            localStorage.removeItem(`userPhoto_${currentUser.id}`);
            
            const navProfileImg = document.querySelector('.profile-dropdown .profile-avatar');
            if (navProfileImg) navProfileImg.src = defaultPhoto;
            
            showFeedback('Foto de perfil removida', 'success');
        }
    });
    
    // Mostrar/Esconder Senha
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            input.type = input.type === 'password' ? 'text' : 'password';
            icon.classList.toggle('fa-eye-slash');
            icon.classList.toggle('fa-eye');
        });
    });
    
    // Formulário de Dados Pessoais
    personalDataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validações
        const email = document.getElementById('email').value;
        if (!email.endsWith('@fatec.sp.gov.br')) {
            showFeedback('Use seu email institucional (@fatec.sp.gov.br)', 'error');
            return;
        }

        const phone = document.getElementById('phone').value;
        if (!phone.match(/^\(\d{2}\) \d{5}-\d{4}$/)) {
            showFeedback('Formato de telefone inválido. Use (XX) XXXXX-XXXX', 'error');
            return;
        }
        
        // Atualizar dados
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.employeeId === currentUser.id);
        
        if (userIndex === -1) {
            showFeedback('Usuário não encontrado', 'error');
            return;
        }
        
        const updatedData = {
            ...users[userIndex],
            fullName: document.getElementById('fullname').value.trim(),
            email: email,
            birthDate: document.getElementById('birthdate').value,
            phone: phone
        };
        
        // Salvar alterações
        const updatedUsers = [...users];
        updatedUsers[userIndex] = updatedData;
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Atualizar currentUser
        localStorage.setItem('currentUser', JSON.stringify({
            id: currentUser.id,
            name: updatedData.fullName,
            email: updatedData.email,
            type: userType
        }));
        
        updateNavbarProfile(updatedData);
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
        
        // Verificar usuário e senha atual
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.employeeId === currentUser.id);
        
        if (userIndex === -1) {
            showFeedback('Usuário não encontrado', 'error');
            return;
        }
        
        if (users[userIndex].password !== simpleHash(currentPassword)) {
            showFeedback('Senha atual incorreta', 'error');
            return;
        }

        // Atualizar senha com hash
        users[userIndex].password = simpleHash(newPassword);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Feedback visual
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Senha alterada!';
        submitBtn.disabled = true;
        
        // Resetar após 3 segundos
        setTimeout(() => {
            passwordForm.reset();
            submitBtn.innerHTML = '<i class="fas fa-key"></i> Alterar Senha';
            submitBtn.disabled = false;
            
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
        // Remover feedbacks anteriores
        const existingFeedback = document.querySelector('.profile-feedback');
        if (existingFeedback) existingFeedback.remove();
        
        const feedbackElement = document.createElement('div');
        feedbackElement.className = `profile-feedback ${type}`;
        feedbackElement.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="close-feedback"><i class="fas fa-times"></i></button>
        `;
        
        feedbackElement.querySelector('.close-feedback').addEventListener('click', () => {
            feedbackElement.remove();
        });
        
        document.body.appendChild(feedbackElement);
        
        setTimeout(() => {
            if (feedbackElement.parentNode) {
                feedbackElement.classList.add('fade-out');
                setTimeout(() => feedbackElement.remove(), 300);
            }
        }, 5000);
    }

    // Hash simples para senha
    function simpleHash(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = (hash << 5) - hash + password.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString();
    }

    // Inicialização
    loadUserData();
});