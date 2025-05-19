document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const authToken = localStorage.getItem('authToken');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!authToken || !currentUser) {
        window.location.href = '../../login.html';
        return;
    }

    // Atualizar informações do usuário na navbar
    document.querySelector('.user-name').textContent = `Prof. ${currentUser.name.split(' ')[0]}`;
    document.querySelector('.user-email').textContent = currentUser.email;

    // Carregar foto do perfil se existir
    const userPhoto = localStorage.getItem(`userPhoto_${currentUser.id}`);
    if (userPhoto) {
        document.querySelector('.profile-avatar').src = userPhoto;
    }

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

    // Clicar no perfil
    let dropdownVisible = false;
    document.querySelector('.profile-avatar').addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.querySelector('.dropdown-content');
        dropdownVisible = !dropdownVisible;
        dropdown.style.display = dropdownVisible ? 'block' : 'none';
    });

    // Fechar ao clicar fora
    document.addEventListener('click', () => {
        if(dropdownVisible) {
            document.querySelector('.dropdown-content').style.display = 'none';
            dropdownVisible = false;
        }
    });

    // Logout
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '../../index.html';
    });

    // Carregar ordens do professor
    loadProfessorOrders();
});

function loadProfessorOrders() {
    // Obter ordens do localStorage (simulação)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Filtrar ordens do professor atual
    const professorOrders = orders.filter(order => 
        order.requesterId === currentUser.id
    );

    // Atualizar contadores
    updateOrderCounters(professorOrders);
    
    // Exibir ordens recentes
    displayRecentOrders(professorOrders);
}

function updateOrderCounters(orders) {
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const inProgressCount = orders.filter(o => o.status === 'in-progress').length;
    
    // Atualizar badges
    document.querySelector('.action-card:nth-child(2) .card-badge').textContent = 
        `${pendingCount} ${pendingCount === 1 ? 'pendente' : 'pendentes'}`;
    
    document.querySelector('.action-card:nth-child(3) .card-badge').textContent = 
        `${inProgressCount} ${inProgressCount === 1 ? 'em andamento' : 'em andamento'}`;
}

function displayRecentOrders(orders) {
    const recentOrdersContainer = document.querySelector('.orders-grid');
    recentOrdersContainer.innerHTML = '';
    
    // Ordenar por data (mais recente primeiro)
    const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    ).slice(0, 2); // Pegar apenas as 2 mais recentes
    
    sortedOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = `order-card status-${order.status.replace(' ', '-')}`;
        
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">#${order.id}</span>
                <span class="order-date">${formatDate(order.date)}</span>
            </div>
            <h3>${order.title}</h3>
            <p class="order-description">${order.description.substring(0, 60)}${order.description.length > 60 ? '...' : ''}</p>
            <div class="order-footer">
                <span class="order-status">
                    <i class="fas ${getStatusIcon(order.status)}"></i> 
                    ${getStatusText(order.status)}
                </span>
                <a href="minhas-ordens.html?order=${order.id}" class="order-details">Ver detalhes</a>
            </div>
        `;
        
        recentOrdersContainer.appendChild(orderCard);
    });
}

// Funções auxiliares
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getStatusIcon(status) {
    const icons = {
        'pending': 'fa-clock',
        'in-progress': 'fa-spinner',
        'completed': 'fa-check-circle'
    };
    return icons[status] || 'fa-question-circle';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Pendente',
        'in-progress': 'Em Andamento',
        'completed': 'Concluído'
    };
    return texts[status] || status;
}