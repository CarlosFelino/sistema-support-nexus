// Dados de usuários
const users = [
  {
    employeeId: "12345",
    fullName: "Carlos Alexandre Andrade De Sousa",
    birthDate: "2007-06-04",
    email: "carlos@fatec.sp.gov.br",
    phone: "(11) 98765-4321",
    password: "senha123",
    userType: "professor",
    registrationDate: "2025-01-15"
  },
  {
    employeeId: "54321",
    fullName: "Thalía Saldanha",
    birthDate: "1990-05-20",
    email: "thalia@fatec.sp.gov.br",
    phone: "(11) 91234-5678",
    password: "suporte123",
    userType: "suporte",
    registrationDate: "2025-01-10"
  },
  {
    employeeId: "67890",
    fullName: "Vitória Regia",
    birthDate: "1992-08-15",
    email: "vitoria@fatec.sp.gov.br",
    phone: "(11) 92345-6789",
    password: "suporte456",
    userType: "suporte",
    registrationDate: "2025-01-12"
  }
];

// Dados de ordens de serviço
const orders = [
  {
    id: "ORD-2025-001",
    title: "Problema no Projetor - Sala 103",
    description: "Projetor não está exibindo imagem corretamente",
    status: "pending",
    date: "2025-05-15",
    requesterId: "12345",
    requesterName: "Carlos Alexandre Andrade De Sousa",
    location: "Sala 103",
    equipment: "Projetor",
    priority: "medium",
    assignedTo: null
  },
  {
    id: "ORD-2025-002",
    title: "Computador não liga - Lab 205",
    description: "Posição 12 não está respondendo ao ligar",
    status: "in-progress",
    date: "2025-05-16",
    requesterId: "12345",
    requesterName: "Carlos Alexandre Andrade De Sousa",
    location: "Laboratório 205",
    equipment: "Computador Posição 12",
    priority: "high",
    assignedTo: "54321"
  },
  {
    id: "ORD-2025-003",
    title: "Internet lenta - Sala 201",
    description: "Conexão está muito lenta durante as aulas",
    status: "completed",
    date: "2025-05-10",
    requesterId: "12345",
    requesterName: "Carlos Alexandre Andrade De Sousa",
    location: "Sala 201",
    equipment: "Roteador Wi-Fi",
    priority: "low",
    assignedTo: "54321",
    solution: "Reset do roteador principal",
    completedDate: "2025-05-12"
  }
];

// Inicializar localStorage com dados de exemplo
function initializeLocalStorage() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}

// Funções de simulação de API
const api = {
  // Simular login
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user) {
          // Criar token simples (em produção, usar JWT)
          const token = `fake-jwt-token-${Math.random().toString(36).substr(2)}-${Date.now().toString(36)}`;
          
          // Salvar dados do usuário logado
          localStorage.setItem('authToken', token);
          localStorage.setItem('currentUser', JSON.stringify({
            id: user.employeeId,
            name: user.fullName,
            email: user.email,
            type: user.userType
          }));
          
          resolve({
            success: true,
            userType: user.userType,
            token: token
          });
        } else {
          reject({
            success: false,
            message: 'Email ou senha incorretos'
          });
        }
      }, 800); // Simular atraso de rede
    });
  },
  
  // Recuperação de senha
  requestPasswordReset: (email) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.email === email);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: userExists,
          message: userExists 
            ? 'Link de recuperação enviado para seu email' 
            : 'Email não cadastrado no sistema'
        });
      }, 1000);
    });
  },
  
  // Obter ordens por usuário
  getOrdersByUser: (userId) => {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(allOrders.filter(order => order.requesterId === userId));
      }, 500);
    });
  },
  
  // Obter todas as ordens (para suporte)
  getAllOrders: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(JSON.parse(localStorage.getItem('orders')) || []);
      }, 500);
    });
  },
  
  // Criar nova ordem
  createOrder: (newOrder) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderId = `ORD-${new Date().getFullYear()}-${(orders.length + 1).toString().padStart(3, '0')}`;
        
        const orderToAdd = {
          ...newOrder,
          id: orderId,
          date: new Date().toISOString(),
          status: 'pending'
        };
        
        const updatedOrders = [...orders, orderToAdd];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        resolve(orderToAdd);
      }, 700);
    });
  },
  
  // Atualizar ordem
  updateOrder: (orderId, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) {
          reject({ success: false, message: 'Ordem não encontrada' });
          return;
        }
        
        const updatedOrder = {
          ...orders[orderIndex],
          ...updates
        };
        
        const updatedOrders = [...orders];
        updatedOrders[orderIndex] = updatedOrder;
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        resolve(updatedOrder);
      }, 600);
    });
  },
  
  // Obter usuário por ID
  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.employeeId === userId);
        
        if (user) {
          resolve(user);
        } else {
          reject('Usuário não encontrado');
        }
      }, 400);
    });
  }
};

// Inicializar dados ao carregar o script
initializeLocalStorage();

// Exportar a API de simulação
window.mockApi = api;