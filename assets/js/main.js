// Simulação do login (tem que remover quando for fazer integração com back-end)
document.addEventListener('DOMContentLoaded', () => {
    // Menu hamburguer
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            console.log('Menu lateral aberto'); // Implementar o sidebar
        });
    }

    // Redirecionamento após login (exemplo)
    const loginForm = document.querySelector('.auth-box form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            if (email.includes('@fatec.sp.gov.br')) {
                if (email.startsWith('suporte')) {
                    window.location.href = 'admin/index-adm.html';
                } else {
                    window.location.href = 'professor/index-prof.html';
                }
            } else {
                alert('Use seu email institucional (@fatec.sp.gov.br)');
            }
        });
    }
});