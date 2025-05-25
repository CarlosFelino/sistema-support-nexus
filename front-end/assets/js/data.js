// data.js - Dados simulados para o sistema Support Nexus

// Dados de usuários
const users = [
  {
    "employeeId": "12345",
    "fullName": "Carlos Alexandre",
    "birthDate": "2007-06-04",
    "email": "carlos@fatec.sp.gov.br",
    "phone": "(11) 98765-4321",
    "password": "senha123",
    "userType": "professor",
    "registrationDate": "2025-01-15"
},
  {
    "employeeId": "67890",
    "fullName": "Thalia Saldanha",
    "birthDate": "2007-06-04",
    "email": "thalia@fatec.sp.gov.br",
    "phone": "(11) 98765-4321",
    "password": "suporte123",
    "userType": "suporte",
    "registrationDate": "2025-01-10"
}
];

// Dados de laboratórios
const labs = {
  "202": { capacity: 30, type: "desktop" },
  "203": { capacity: 30, type: "notebook" },
  "204": { capacity: 30, type: "desktop" },
  "205": { capacity: 30, type: "notebook" },
  "206": { capacity: 30, type: "desktop" },
  "207": { capacity: 30, type: "notebook" },
  "208": { capacity: 15, type: "desktop" },
  "209": { capacity: 21, type: "desktop" },
  "210": { capacity: 30, type: "notebook" },
  "211": { capacity: 30, type: "desktop" },
  "213": { capacity: 30, type: "notebook" },
  "214": { capacity: 30, type: "notebook" },
  "215": { capacity: 30, type: "notebook" }
};

// Dados de equipamentos e problemas
const equipmentConfig = {
  "classroom": {
    "equipments": [
      { "value": "kit-professor", "label": "Kit Professor (ThinkCentre + ThinkVision)" },
      { "value": "cabo-internet", "label": "Cabo de Internet" },
      { "value": "keystone", "label": "Keystone" },
      { "value": "hdmi", "label": "Cabo HDMI" },
      { "value": "displayport", "label": "Cabo DisplayPort" },
      { "value": "tv", "label": "TV" },
      { "value": "mouse", "label": "Mouse" },
      { "value": "teclado", "label": "Teclado" },
      { "value": "outro", "label": "Outro Equipamento" }
    ],
    "problems": {
      "kit-professor": [
        { "value": "sem-internet", "label": "Sem conexão com a internet" },
        { "value": "nao-liga", "label": "Equipamento não liga" },
        { "value": "monitor-nao-liga", "label": "Monitor não liga" },
        { "value": "nao-espelha", "label": "Não está espelhando na TV" },
        { "value": "lento", "label": "Computador muito lento" },
        { "value": "outro", "label": "Outro problema" }
      ],
      "default": [
        { "value": "nao-funciona", "label": "Equipamento não funciona" },
        { "value": "danificado", "label": "Equipamento danificado" },
        { "value": "falta", "label": "Equipamento faltando" },
        { "value": "outro", "label": "Outro problema" }
      ]
    }
  },
  "lab-desktop": {
    "equipments": [
      { "value": "kit-professor", "label": "Kit Professor" },
      { "value": "kit-aluno", "label": "Kit Aluno (Desktop)" },
      { "value": "monitor-lg", "label": "Monitor LG" },
      { "value": "monitor-thinkvision", "label": "Monitor ThinkVision" },
      { "value": "monitor-hp", "label": "Monitor HP" },
      { "value": "monitor-aoc", "label": "Monitor AOC" },
      { "value": "gabinete-thinkcentre", "label": "Gabinete ThinkCentre" },
      { "value": "gabinete-hp", "label": "Gabinete HP ProDesk" },
      { "value": "cabo-vga", "label": "Cabo VGA" },
      { "value": "outro", "label": "Outro Equipamento" }
    ],
    "problems": {
      "kit-professor": [
        { "value": "sem-internet", "label": "Sem conexão com a internet" },
        { "value": "nao-liga", "label": "Equipamento não liga" },
        { "value": "monitor-nao-liga", "label": "Monitor não liga" },
        { "value": "nao-espelha", "label": "Não está espelhando na TV" },
        { "value": "lento", "label": "Computador muito lento" },
        { "value": "outro", "label": "Outro problema" }
      ],
      "kit-aluno": [
        { "value": "sem-internet", "label": "Sem conexão com a internet" },
        { "value": "nao-liga", "label": "Computador não liga" },
        { "value": "monitor-nao-liga", "label": "Monitor não liga" },
        { "value": "sem-video", "label": "Sem sinal de vídeo" },
        { "value": "lento", "label": "Computador muito lento" },
        { "value": "outro", "label": "Outro problema" }
      ],
      "default": [
        { "value": "nao-funciona", "label": "Equipamento não funciona" },
        { "value": "danificado", "label": "Equipamento danificado" },
        { "value": "falta", "label": "Equipamento faltando" },
        { "value": "outro", "label": "Outro problema" }
      ]
    }
  },
  "lab-notebook": {
    "equipments": [
      { "value": "kit-professor", "label": "Kit Professor" },
      { "value": "thinkpad-l14", "label": "Notebook ThinkPad L14 Gen2" },
      { "value": "thinkpad-e14", "label": "Notebook ThinkPad E14 Gen2" },
      { "value": "positivo", "label": "Notebook Positivo" },
      { "value": "outro", "label": "Outro Equipamento" }
    ],
    "problems": {
      "thinkpad-l14": [
        { "value": "sem-internet", "label": "Sem conexão com a internet" },
        { "value": "nao-liga", "label": "Notebook não liga" },
        { "value": "bateria", "label": "Problema com a bateria" },
        { "value": "teclado", "label": "Problema com o teclado" },
        { "value": "tela", "label": "Problema com a tela" },
        { "value": "outro", "label": "Outro problema" }
      ],
      "default": [
        { "value": "nao-funciona", "label": "Equipamento não funciona" },
        { "value": "danificado", "label": "Equipamento danificado" },
        { "value": "falta", "label": "Equipamento faltando" },
        { "value": "outro", "label": "Outro problema" }
      ]
    }
  },
  "app": {
    "problems": [
      { "value": "falta-app", "label": "Aplicativo não instalado" },
      { "value": "app-nao-funciona", "label": "Aplicativo não funciona" },
      { "value": "app-lento", "label": "Aplicativo muito lento" },
      { "value": "atualizacao", "label": "Precisa de atualização" },
      { "value": "outro", "label": "Outro problema" }
    ]
  }
};


// Inicializar localStorage
function initializeLocalStorage() {
  if (!localStorage.getItem('appInitialized')) {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('appInitialized', 'true');
  }
}

// API Simulada
const mockApi = {
  // Autenticação
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const token = `fake-jwt-${Math.random().toString(36).substr(2, 9)}`;
          const currentUser = {
            id: user.employeeId,
            name: user.fullName,
            email: user.email,
            type: user.userType
          };
          
          localStorage.setItem('authToken', token);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          
          resolve({
            success: true,
            token,
            userType: user.userType,
            userData: currentUser
          });
        } else {
          reject({
            success: false,
            message: 'Credenciais inválidas'
          });
        }
      }, 800);
    });
  },

  // Obter ordens do professor
  getProfessorOrders: (professorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        resolve(orders.filter(order => order.requesterId === professorId));
      }, 600);
    });
  },

  // Obter detalhes do usuário
  getUserProfile: (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.employeeId === userId);
        
        if (user) {
          resolve(user);
        } else {
          reject('Usuário não encontrado');
        }
      }, 500);
    });
  },

  // Atualizar perfil do usuário
  updateUserProfile: (userId, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.employeeId === userId);
        
        if (userIndex === -1) {
          reject('Usuário não encontrado');
          return;
        }
        
        const updatedUser = { ...users[userIndex], ...updates };
        const updatedUsers = [...users];
        updatedUsers[userIndex] = updatedUser;
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Atualizar currentUser se for o mesmo usuário
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem('currentUser', JSON.stringify({
            ...currentUser,
            name: updates.fullName || currentUser.name,
            email: updates.email || currentUser.email
          }));
        }
        
        resolve(updatedUser);
      }, 700);
    });
  },

  // Métodos adicionais para o painel
  getOrderStats: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const userOrders = orders.filter(o => o.requesterId === userId);
        
        const stats = {
          total: userOrders.length,
          pending: userOrders.filter(o => o.status === 'pending').length,
          inProgress: userOrders.filter(o => o.status === 'in-progress').length,
          completed: userOrders.filter(o => o.status === 'completed').length,
          recent: [...userOrders]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3)
        };
        
        resolve(stats);
      }, 500);
    });
  }
};

// Inicializar dados
initializeLocalStorage();

// Exportar para uso global
window.mockApi = mockApi;