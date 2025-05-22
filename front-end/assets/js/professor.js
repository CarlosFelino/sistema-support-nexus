class ProfessorDashboard {
  constructor() {
    this.init();
  }

  async init() {
    // Verificar autenticação
    if (!this.checkAuth()) {
      window.location.href = '../../login.html';
      return;
    }

    // Carregar dados do usuário
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Configurar UI
    this.setupUI();
    
    // Carregar dados do dashboard
    await this.loadDashboardData();
  }

  checkAuth() {
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    return authToken && currentUser;
  }

  setupUI() {
    // Menu hamburguer
    this.menuToggle = document.querySelector('.menu-toggle');
    this.sidebar = document.querySelector('.sidebar');
    this.overlay = document.createElement('div');
    this.overlay.className = 'overlay';
    document.body.appendChild(this.overlay);

    this.menuToggle.addEventListener('click', () => this.toggleMenu());
    this.overlay.addEventListener('click', () => this.closeMenu());

    // Dropdown do perfil
    this.profileDropdown = document.querySelector('.dropdown-content');
    this.profileAvatar = document.querySelector('.profile-avatar');
    this.profileAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleProfileDropdown();
    });

    document.addEventListener('click', () => this.closeProfileDropdown());

    // Logout
    document.getElementById('logout').addEventListener('click', (e) => {
      e.preventDefault();
      this.logout();
    });
  }

  async loadDashboardData() {
    try {
      // Atualizar informações do usuário
      await this.updateUserProfile();
      
      // Carregar estatísticas das ordens
      const stats = await mockApi.getOrderStats(this.currentUser.id);
      
      // Atualizar UI com os dados
      this.updateWelcomeMessage(stats);
      this.updateQuickActions(stats);
      this.displayRecentOrders(stats.recent);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.showError('Erro ao carregar dados do dashboard');
    }
  }

  async updateUserProfile() {
    try {
      const userData = await mockApi.getUserProfile(this.currentUser.id);
      
      // Atualizar navbar
      document.querySelector('.user-name').textContent = `Prof. ${userData.fullName.split(' ')[0]}`;
      document.querySelector('.user-email').textContent = userData.email;
      
      // Carregar foto se existir
      const userPhoto = localStorage.getItem(`userPhoto_${this.currentUser.id}`) || 
                       '../../assets/images/default-avatar.png';
      this.profileAvatar.src = userPhoto;
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  updateWelcomeMessage(stats) {
    const welcomeBanner = document.querySelector('.welcome-banner h1');
    if (!welcomeBanner) return;
    
    if (stats.pending > 0) {
      welcomeBanner.textContent = `Bem-vindo, Professor! Você tem ${stats.pending} ${stats.pending === 1 ? 'ordem pendente' : 'ordens pendentes'}`;
    } else if (stats.inProgress > 0) {
      welcomeBanner.textContent = `Bem-vindo! Você tem ${stats.inProgress} ${stats.inProgress === 1 ? 'ordem em andamento' : 'ordens em andamento'}`;
    } else {
      welcomeBanner.textContent = 'Bem-vindo, Professor! Tudo em ordem por aqui.';
    }
  }

  updateQuickActions(stats) {
    // Atualizar badge de ordens pendentes
    const pendingBadge = document.querySelector('.action-card:nth-child(2) .card-badge');
    if (pendingBadge) {
      pendingBadge.textContent = `${stats.pending} ${stats.pending === 1 ? 'pendente' : 'pendentes'}`;
    }
  }

  displayRecentOrders(orders) {
    const ordersGrid = document.querySelector('.orders-grid');
    if (!ordersGrid) return;
    
    ordersGrid.innerHTML = '';
    
    if (orders.length === 0) {
      ordersGrid.innerHTML = '<p class="no-orders">Nenhuma ordem recente encontrada</p>';
      return;
    }
    
    orders.forEach(order => {
      const orderCard = document.createElement('div');
      orderCard.className = `order-card status-${order.status.replace(' ', '-')}`;
      orderCard.innerHTML = this.createOrderCardHTML(order);
      ordersGrid.appendChild(orderCard);
    });
  }

  createOrderCardHTML(order) {
    const formattedDate = this.formatDate(order.date);
    const statusInfo = this.getStatusInfo(order.status);
    
    return `
      <div class="order-header">
        <span class="order-id">#${order.id}</span>
        <span class="order-date">${formattedDate}</span>
      </div>
      <h3>${order.title}</h3>
      <p class="order-description">${order.description.substring(0, 80)}${order.description.length > 80 ? '...' : ''}</p>
      <div class="order-footer">
        <span class="order-status">
          <i class="fas ${statusInfo.icon}"></i> 
          ${statusInfo.text}
        </span>
        <a href="minhas-ordens.html?order=${order.id}" class="order-details">Ver detalhes</a>
      </div>
    `;
  }

  getStatusInfo(status) {
    const statusMap = {
      'pending': { icon: 'fa-clock', text: 'Pendente', color: '#FF9800' },
      'in-progress': { icon: 'fa-spinner', text: 'Em Andamento', color: '#2196F3' },
      'completed': { icon: 'fa-check-circle', text: 'Concluído', color: '#4CAF50' }
    };
    
    return statusMap[status] || { icon: 'fa-question-circle', text: status, color: '#9E9E9E' };
  }

  formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  }

  toggleMenu() {
    this.sidebar.classList.toggle('active');
    this.overlay.classList.toggle('active');
  }

  closeMenu() {
    this.sidebar.classList.remove('active');
    this.overlay.classList.remove('active');
  }

  toggleProfileDropdown() {
    this.profileDropdown.style.display = 
      this.profileDropdown.style.display === 'block' ? 'none' : 'block';
  }

  closeProfileDropdown() {
    this.profileDropdown.style.display = 'none';
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = '../../index.html';
  }

  showError(message) {
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
}

// Inicializar o dashboard quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new ProfessorDashboard();
});