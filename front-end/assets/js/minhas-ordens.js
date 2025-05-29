document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const ordersList = document.getElementById('orders-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-orders');
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    const applyDatesBtn = document.getElementById('apply-dates');
    const modal = document.getElementById('order-details-modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-close-btn');
    const statCards = document.querySelectorAll('.stat-card');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const profileAvatar = document.getElementById('profile-avatar');
    
    // Variáveis de estado
    let allOrders = [];
    let filteredOrders = [];
    let currentPage = 1;
    const ordersPerPage = 10;
    let activeFilters = {
        status: 'all',
        search: '',
        dateFrom: null,
        dateTo: null
    };

    // Inicialização
    async function init() {
        await loadUserData();
        await loadOrders();
        setupEventListeners();
        updateStats();
    }

    // Carregar dados do usuário
    async function loadUserData() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                window.location.href = '../../login.html';
                return;
            }
            
            // Atualizar navbar com dados do usuário
            userNameElement.textContent = currentUser.name;
            userEmailElement.textContent = currentUser.email;
            
            // Carregar foto do perfil se existir
            const userPhoto = localStorage.getItem(`userPhoto_${currentUser.id}`);
            if (userPhoto) {
                profileAvatar.src = userPhoto;
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }

    // Carregar ordens do localStorage
    async function loadOrders() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                window.location.href = '../../login.html';
                return;
            }
            
            // Simular carregamento assíncrono
            ordersList.innerHTML = `
                <div class="loading-orders">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Carregando suas ordens...</span>
                </div>
            `;
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            allOrders = orders.filter(order => order.requesterId === currentUser.id);
            
            if (allOrders.length === 0) {
                ordersList.innerHTML = `
                    <div class="no-orders">
                        <i class="fas fa-clipboard-list"></i>
                        <p>Você ainda não criou nenhuma ordem</p>
                        <a href="criar-ordem.html" class="btn btn-primary">
                            <i class="fas fa-plus-circle"></i> Criar Primeira Ordem
                        </a>
                    </div>
                `;
                return;
            }
            
            // Ordenar por data (mais recente primeiro)
            allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            applyFilters();
        } catch (error) {
            console.error('Erro ao carregar ordens:', error);
            showError('Erro ao carregar suas ordens');
        }
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Filtros por status
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilters.status = btn.dataset.status;
                currentPage = 1;
                applyFilters();
            });
        });

        // Busca
        searchInput.addEventListener('input', (e) => {
            activeFilters.search = e.target.value.toLowerCase();
            currentPage = 1;
            applyFilters();
        });

        // Filtro por data
        applyDatesBtn.addEventListener('click', () => {
            activeFilters.dateFrom = dateFromInput.value;
            activeFilters.dateTo = dateToInput.value;
            currentPage = 1;
            applyFilters();
        });

        // Fechar modal
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        });

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Aplicar todos os filtros
    function applyFilters() {
        filteredOrders = [...allOrders];

        // Filtro por status
        if (activeFilters.status !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === activeFilters.status);
        }

        // Filtro por busca
        if (activeFilters.search) {
            filteredOrders = filteredOrders.filter(order => {
                const searchStr = `${order.id} ${order.description || ''} ${order.location || ''} ${order.equipment || ''}`.toLowerCase();
                return searchStr.includes(activeFilters.search);
            });
        }

        // Filtro por data
        if (activeFilters.dateFrom) {
            filteredOrders = filteredOrders.filter(order => 
                new Date(order.date) >= new Date(activeFilters.dateFrom)
            );
        }

        if (activeFilters.dateTo) {
            filteredOrders = filteredOrders.filter(order => 
                new Date(order.date) <= new Date(activeFilters.dateTo + 'T23:59:59')
            );
        }

        updateStats();
        renderOrders();
        renderPagination();
    }

    // Atualizar estatísticas
    function updateStats() {
        const total = allOrders.length;
        const pending = allOrders.filter(o => o.status === 'pending').length;
        const inProgress = allOrders.filter(o => o.status === 'in-progress').length;
        const completed = allOrders.filter(o => o.status === 'completed').length;

        statCards[0].querySelector('.stat-value').textContent = total;
        statCards[1].querySelector('.stat-value').textContent = pending;
        statCards[2].querySelector('.stat-value').textContent = inProgress;
        statCards[3].querySelector('.stat-value').textContent = completed;
    }

    // Renderizar lista de ordens
    function renderOrders() {
        if (filteredOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Nenhuma ordem encontrada com os filtros atuais</p>
                </div>
            `;
            return;
        }

        // Paginação
        const startIndex = (currentPage - 1) * ordersPerPage;
        const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

        ordersList.innerHTML = '';

        paginatedOrders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = `order-card ${order.status}`;
            orderCard.dataset.id = order.id;
            orderCard.dataset.date = order.date;

            const statusInfo = getStatusInfo(order.status);
            const formattedDate = formatDate(order.date);
            const isLab = order.location.includes('Lab');

            orderCard.innerHTML = `
                <div class="order-header">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-date">${formattedDate}</span>
                    <span class="order-status ${order.status}">
                        <i class="fas ${statusInfo.icon}"></i> ${statusInfo.text}
                    </span>
                </div>
                <div class="order-content">
                    <h3>${order.location} - ${getEquipmentName(order)}</h3>
                    <p class="order-description">${order.description || 'Sem descrição'}</p>
                    <div class="order-meta">
                        <span><i class="fas fa-tag"></i> ${order.type || 'Sem categoria'}</span>
                        ${order.assignedTo ? `<span><i class="fas fa-user-cog"></i> Técnico: ${order.assignedName || 'Não atribuído'}</span>` : ''}
                    </div>
                </div>
                <div class="order-actions">
                    <button class="btn btn-small btn-view">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                    ${order.status !== 'completed' ? `
                    <button class="btn btn-small btn-edit">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    ` : ''}
                </div>
            `;

            // Adicionar event listeners aos botões
            orderCard.querySelector('.btn-view').addEventListener('click', () => showOrderDetails(order.id));
            if (order.status !== 'completed') {
                orderCard.querySelector('.btn-edit').addEventListener('click', () => editOrder(order.id));
            }

            ordersList.appendChild(orderCard);
        });
    }

    // Renderizar paginação
    function renderPagination() {
        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
        const paginationContainer = document.querySelector('.pagination');
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = '';
        
        // Botão Anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderOrders();
                renderPagination();
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderOrders();
                renderPagination();
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        // Botão Próximo
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderOrders();
                renderPagination();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    // Mostrar detalhes da ordem
    function showOrderDetails(orderId) {
        const order = allOrders.find(o => o.id === orderId);
        if (!order) return;

        const statusInfo = getStatusInfo(order.status);
        const formattedDate = formatDate(order.date, true);
        const isLab = order.location.includes('Lab');

        let positionsInfo = '';
        if (order.positions && order.positions.length > 0) {
            positionsInfo = `
                <div class="detail-row">
                    <span class="detail-label">Posições:</span>
                    <span class="detail-value">${order.positions.join(', ')}</span>
                </div>
            `;
        }

        let computerTypeInfo = '';
        if (order.computerType) {
            computerTypeInfo = `
                <div class="detail-row">
                    <span class="detail-label">Tipo de Computador:</span>
                    <span class="detail-value">${
                        order.computerType === 'desktop' ? 'Desktop' : 'Notebook'
                    }</span>
                </div>
            `;
        }

        document.getElementById('modal-order-details').innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Número da Ordem:</span>
                <span class="detail-value">${order.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Data:</span>
                <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value status-badge ${order.status}">
                    <i class="fas ${statusInfo.icon}"></i> ${statusInfo.text}
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Local:</span>
                <span class="detail-value">${order.location}</span>
            </div>
            ${positionsInfo}
            ${computerTypeInfo}
            <div class="detail-row">
                <span class="detail-label">Equipamento:</span>
                <span class="detail-value">${getEquipmentName(order)}</span>
            </div>
            ${order.assignedTo ? `
            <div class="detail-row">
                <span class="detail-label">Técnico Responsável:</span>
                <span class="detail-value">${order.assignedName || 'Não atribuído'}</span>
            </div>
            ` : ''}
            <div class="detail-row full-width">
                <span class="detail-label">Descrição:</span>
                <p class="detail-value">${order.description || 'Sem descrição'}</p>
            </div>
            ${order.solution ? `
            <div class="detail-row full-width">
                <span class="detail-label">Solução:</span>
                <p class="detail-value">${order.solution}</p>
            </div>
            ` : ''}
            ${order.completedDate ? `
            <div class="detail-row">
                <span class="detail-label">Data de Conclusão:</span>
                <span class="detail-value">${formatDate(order.completedDate, true)}</span>
            </div>
            ` : ''}
            ${order.evaluation ? `
            <div class="detail-row">
                <span class="detail-label">Avaliação:</span>
                <span class="detail-value">
                    ${'★'.repeat(order.evaluation)}${'☆'.repeat(5 - order.evaluation)}
                </span>
            </div>
            ` : ''}
        `;

        modal.classList.add('active');
    }

    // Editar ordem (redireciona para criar-ordem com parâmetros)
    function editOrder(orderId) {
        // Implementar lógica de edição conforme necessário
        console.log('Editar ordem:', orderId);
        // window.location.href = `criar-ordem.html?edit=${orderId}`;
    }

    // Funções auxiliares
    function getStatusInfo(status) {
        const statusMap = {
            'pending': { icon: 'fa-clock', text: 'Pendente', color: '#FF9800' },
            'in-progress': { icon: 'fa-spinner', text: 'Em Andamento', color: '#2196F3' },
            'completed': { icon: 'fa-check-circle', text: 'Concluída', color: '#4CAF50' }
        };
        return statusMap[status] || { icon: 'fa-question-circle', text: status, color: '#9E9E9E' };
    }

    function formatDate(dateString, longFormat = false) {
        const date = new Date(dateString);
        if (longFormat) {
            return date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return date.toLocaleDateString('pt-BR');
    }

    function getEquipmentName(order) {
        const equipment = order.equipment;
        const equipmentMap = {
            'kit-professor': 'Kit Professor',
            'cabo-internet': 'Cabo de Internet',
            'keystone': 'Keystone',
            'hdmi': 'Cabo HDMI',
            'displayport': 'Cabo DisplayPort',
            'tv': 'TV',
            'mouse': 'Mouse',
            'teclado': 'Teclado',
            'kit-aluno': 'Kit Aluno',
            'monitor-lg': 'Monitor LG',
            'monitor-thinkvision': 'Monitor ThinkVision',
            'monitor-hp': 'Monitor HP',
            'monitor-aoc': 'Monitor AOC',
            'gabinete-thinkcentre': 'Gabinete ThinkCentre',
            'gabinete-hp': 'Gabinete HP',
            'cabo-vga': 'Cabo VGA',
            'thinkpad-l14': 'ThinkPad L14',
            'thinkpad-e14': 'ThinkPad E14',
            'positivo': 'Notebook Positivo'
        };
        
        return equipmentMap[equipment] || equipment || 'Equipamento não especificado';
    }

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'dashboard-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.prepend(errorElement);
        
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }

    // Inicializar a aplicação
    init();
});