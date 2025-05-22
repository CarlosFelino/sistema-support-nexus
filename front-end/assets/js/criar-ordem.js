// criar-ordem.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.getElementById('order-form');
    const requestTypeRadios = document.querySelectorAll('input[name="request-type"]');
    const locationTypeRadios = document.querySelectorAll('input[name="location-type"]');
    const problemSection = document.getElementById('problem-section');
    const installationSection = document.getElementById('installation-section');
    const classroomFields = document.getElementById('classroom-fields');
    const labFields = document.getElementById('lab-fields');
    const computerTypeSelect = document.getElementById('computer-type');
    const equipmentTypeSelect = document.getElementById('equipment-type');
    const problemTypeSelect = document.getElementById('problem-type');
    const fileUpload = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // Elementos para seleção de posições
    const positionSelection = document.getElementById('position-selection');
    const positionsGrid = document.querySelector('.positions-grid');
    const selectAllBtn = document.querySelector('.select-all-btn');
    const deselectAllBtn = document.querySelector('.deselect-all-btn');
    const selectedCount = document.querySelector('.selected-count');
    const selectedList = document.querySelector('.selected-list');
    
    // Variáveis de estado
    let currentLabCapacity = 0;
    let selectedPositions = new Set();
    let currentLabType = 'desktop';

    // Função para popular selects
    function populateSelect(selectElement, options, placeholder = 'Selecione...') {
        selectElement.innerHTML = '';
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = placeholder;
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        selectElement.appendChild(placeholderOption);

        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            selectElement.appendChild(opt);
        });
    }

    // Atualizar equipamentos baseado no local e tipo de computador
    function updateEquipmentOptions() {
        const isLab = document.querySelector('input[name="location-type"]:checked').value === 'lab';
        
        if (!isLab) {
            populateSelect(equipmentTypeSelect, equipmentConfig.classroom.equipments);
            return;
        }
        
        const computerType = computerTypeSelect.value;
        if (!computerType) {
            populateSelect(equipmentTypeSelect, [], 'Selecione o tipo de computador primeiro');
            return;
        }
        
        const configKey = computerType === 'desktop' ? 'lab-desktop' : 'lab-notebook';
        populateSelect(equipmentTypeSelect, equipmentConfig[configKey].equipments);
        
        // Resetar o select de problemas
        populateSelect(problemTypeSelect, [], 'Selecione o equipamento primeiro');
        problemTypeSelect.disabled = true;
    }

    // Atualizar problemas baseado no equipamento selecionado
    function updateProblemOptions() {
        const isLab = document.querySelector('input[name="location-type"]:checked').value === 'lab';
        const equipment = equipmentTypeSelect.value;
        
        if (!equipment) {
            populateSelect(problemTypeSelect, [], 'Selecione um equipamento');
            return;
        }
        
        let problems = [];
        let configKey = 'classroom';
        
        if (isLab) {
            configKey = currentLabType === 'desktop' ? 'lab-desktop' : 'lab-notebook';
        }
        
        if (equipmentConfig[configKey].problems[equipment]) {
            problems = equipmentConfig[configKey].problems[equipment];
        } else {
            problems = equipmentConfig[configKey].problems.default;
        }
        
        populateSelect(problemTypeSelect, problems);
        problemTypeSelect.disabled = false;
    }

    // Alternar entre seções de problema e instalação
    function toggleRequestType() {
        const isInstallation = document.querySelector('input[name="request-type"]:checked').value === 'installation';
        
        if (isInstallation) {
            problemSection.style.display = 'none';
            installationSection.style.display = 'block';
            // Definir valores padrão para instalação
            populateSelect(problemTypeSelect, equipmentConfig.app.problems);
            equipmentTypeSelect.value = 'app';
        } else {
            problemSection.style.display = 'block';
            installationSection.style.display = 'none';
            updateEquipmentOptions();
        }
    }

    // Alternar entre sala de aula e laboratório
    function toggleLocationType() {
        const isLab = document.querySelector('input[name="location-type"]:checked').value === 'lab';
        
        if (isLab) {
            classroomFields.style.display = 'none';
            labFields.style.display = 'block';
            positionSelection.style.display = 'none';
        } else {
            classroomFields.style.display = 'block';
            labFields.style.display = 'none';
            positionSelection.style.display = 'none';
            clearPositionSelection();
        }
        
        updateEquipmentOptions();
    }

    // Criar botões de posição para o laboratório
    function createPositionButtons(capacity) {
        positionsGrid.innerHTML = '';
        clearPositionSelection();
        
        // Criar botões para cada posição
        for (let i = 1; i <= capacity; i++) {
            const positionBtn = document.createElement('button');
            positionBtn.type = 'button';
            positionBtn.className = 'position-btn';
            positionBtn.textContent = i;
            positionBtn.dataset.position = i;
            
            positionBtn.addEventListener('click', function() {
                togglePositionSelection(i);
            });
            
            positionsGrid.appendChild(positionBtn);
        }
        
        // Ajustar layout da grid baseado na capacidade
        if (capacity <= 21) {
            positionsGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        } else {
            positionsGrid.style.gridTemplateColumns = 'repeat(10, 1fr)';
        }
    }

    // Alternar seleção de uma posição
    function togglePositionSelection(position) {
        if (selectedPositions.has(position)) {
            selectedPositions.delete(position);
        } else {
            selectedPositions.add(position);
        }
        
        updateSelectedDisplay();
        updateButtonStyles();
    }

    // Atualizar estilos dos botões baseado nas posições selecionadas
    function updateButtonStyles() {
        document.querySelectorAll('.position-btn').forEach(btn => {
            const position = parseInt(btn.dataset.position);
            if (selectedPositions.has(position)) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }

    // Atualizar display das posições selecionadas
    function updateSelectedDisplay() {
        const count = selectedPositions.size;
        const sortedPositions = Array.from(selectedPositions).sort((a, b) => a - b);
        
        if (count === 0) {
            selectedCount.textContent = "Nenhuma posição selecionada";
            selectedList.textContent = '';
        } else {
            selectedCount.textContent = `${count} ${count === 1 ? 'posição selecionada' : 'posições selecionadas'}`;
            
            // Mostrar até 5 posições, depois "e mais X"
            if (sortedPositions.length <= 5) {
                selectedList.textContent = `Posições: ${sortedPositions.join(', ')}`;
            } else {
                const shown = sortedPositions.slice(0, 5);
                const remaining = sortedPositions.length - 5;
                selectedList.textContent = `Posições: ${shown.join(', ')} e mais ${remaining}`;
            }
        }
    }

    // Selecionar todas as posições
    function selectAllPositions() {
        for (let i = 1; i <= currentLabCapacity; i++) {
            selectedPositions.add(i);
        }
        updateSelectedDisplay();
        updateButtonStyles();
    }
    
    // Desselecionar todas as posições
    function deselectAllPositions() {
        selectedPositions.clear();
        updateSelectedDisplay();
        updateButtonStyles();
    }
    
    // Limpar seleção de posições
    function clearPositionSelection() {
        selectedPositions.clear();
        updateSelectedDisplay();
        updateButtonStyles();
    }

    // Lidar com seleção de laboratório
    function handleLabSelection() {
        const labSelect = document.getElementById('lab');
        const selectedLab = labSelect.value;
        
        if (!selectedLab) {
            positionSelection.style.display = 'none';
            computerTypeSelect.disabled = true;
            return;
        }
        
        // Ativar seleção de tipo de computador
        computerTypeSelect.disabled = false;
        
        // Determinar tipo padrão do laboratório
        currentLabType = labs[selectedLab].type;
        computerTypeSelect.value = currentLabType;
        
        // Determinar capacidade do laboratório selecionado
        currentLabCapacity = labs[selectedLab].capacity;
        
        positionSelection.style.display = 'block';
        createPositionButtons(currentLabCapacity);
        updateEquipmentOptions();
    }

    // Gerenciar upload de arquivos (mantido igual)
    function handleFileUpload() {
        // ... (código anterior)
    }

    // Remover arquivo da lista (mantido igual)
    function removeFile(e) {
        // ... (código anterior)
    }

    // Validar formulário antes de enviar
    function validateForm() {
        const isInstallation = document.querySelector('input[name="request-type"]:checked').value === 'installation';
        const isLab = document.querySelector('input[name="location-type"]:checked').value === 'lab';
        const location = isLab ? document.getElementById('lab').value : document.getElementById('classroom').value;
        
        if (!location) {
            alert('Por favor, selecione um local válido.');
            return false;
        }
        
        if (isLab && selectedPositions.size === 0 && equipmentTypeSelect.value !== 'kit-professor') {
                    alert('Por favor, selecione pelo menos uma posição ou o Kit Professor.');
        return false;
    }

    if (!isInstallation) {
        if (!equipmentTypeSelect.value) {
            alert('Por favor, selecione um equipamento.');
            return false;
        }
        
        if (!problemTypeSelect.value) {
            alert('Por favor, selecione um tipo de problema.');
            return false;
        }
    } else {
        const appName = document.getElementById('app-name').value;
        if (!appName) {
            alert('Por favor, informe o nome do aplicativo.');
            return false;
        }
    }
    
    return true;
}

// Enviar formulário
function submitForm(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Obter dados do formulário
    const formData = new FormData(form);
    const orderData = {
        requestType: formData.get('request-type'),
        locationType: formData.get('location-type'),
        location: formData.get('location-type') === 'lab' ? 
                 formData.get('lab') : formData.get('classroom'),
        computerType: formData.get('computer-type'),
        equipment: formData.get('equipment-type'),
        problem: formData.get('problem-type'),
        description: formData.get('problem-description'),
        appName: formData.get('app-name'),
        appVersion: formData.get('app-version'),
        appLink: formData.get('app-link'),
        notes: formData.get('installation-notes'),
        attachments: [],
        positions: [],
        requesterId: JSON.parse(localStorage.getItem('currentUser')).id,
        requesterName: JSON.parse(localStorage.getItem('currentUser')).name,
        date: new Date().toISOString(),
        status: 'pending'
    };

    // Adicionar posições se for laboratório
    if (orderData.locationType === 'lab' && selectedPositions.size > 0) {
        orderData.positions = Array.from(selectedPositions).sort((a, b) => a - b);
    }

    // Adicionar arquivos (simulado)
    if (fileUpload.files.length > 0) {
        for (let i = 0; i < fileUpload.files.length; i++) {
            orderData.attachments.push({
                name: fileUpload.files[i].name,
                size: fileUpload.files[i].size,
                type: fileUpload.files[i].type
            });
        }
    }

    // Gerar ID único para a ordem
    orderData.id = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Salvar no localStorage (simulando envio para o servidor)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Mostrar mensagem de sucesso
    alert(`Ordem criada com sucesso! Número: ${orderData.id}`);
    
    // Redirecionar para a lista de ordens
    window.location.href = 'minhas-ordens.html';
}

// Event Listeners
requestTypeRadios.forEach(radio => {
    radio.addEventListener('change', toggleRequestType);
});

locationTypeRadios.forEach(radio => {
    radio.addEventListener('change', toggleLocationType);
});

document.getElementById('lab').addEventListener('change', handleLabSelection);
computerTypeSelect.addEventListener('change', function() {
    currentLabType = this.value;
    updateEquipmentOptions();
});
selectAllBtn.addEventListener('click', selectAllPositions);
deselectAllBtn.addEventListener('click', deselectAllPositions);
equipmentTypeSelect.addEventListener('change', updateProblemOptions);
fileUpload.addEventListener('change', handleFileUpload);
form.addEventListener('submit', submitForm);

cancelBtn.addEventListener('click', function() {
    if (confirm('Deseja cancelar a criação desta ordem?')) {
        window.location.href = 'painel-professor.html';
    }
});

// Inicialização
toggleRequestType();
toggleLocationType();
    })