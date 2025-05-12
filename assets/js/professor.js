document.addEventListener('DOMContentLoaded', function() {
    // Controle do Menu Lateral
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Dropdown do Perfil
    const profileDropdown = document.querySelector('.profile-dropdown');
    profileDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelector('.dropdown-content').classList.toggle('show');
    });

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', () => {
        document.querySelector('.dropdown-content').classList.remove('show');
    });

    // Logout
    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        // Adicionar lógica de logout aqui
        localStorage.removeItem('userToken');
        window.location.href = '../../index.html';
    });
});