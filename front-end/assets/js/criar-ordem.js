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
    let toastTimeout;
    let currentOrderId = null;

    if (!form) {
        console.error('Formulário não encontrado! Verifique o ID do formulário.');
        return;
    }

    // Função para mostrar o modal de redirecionamento
    function showRedirectModal(orderId) {
        currentOrderId = orderId;
        const modal = document.getElementById('redirect-modal');
        modal.style.display = 'flex';
        
        // Configurar os botões do modal
        document.getElementById('go-to-orders').onclick = () => {
            window.location.href = 'minhas-ordens.html';
        };
        
        document.getElementById('stay-here').onclick = () => {
            modal.style.display = 'none';
            
            // Reset completo do formulário
            form.reset();
            
            // Reset dos selects
            equipmentTypeSelect.selectedIndex = 0;
            problemTypeSelect.selectedIndex = 0;
            problemTypeSelect.disabled = true;
            
            // Reset dos campos de texto
            document.getElementById('problem-description').value = '';
            document.getElementById('app-name').value = '';
            document.getElementById('app-version').value = '';
            document.getElementById('app-link').value = '';
            document.getElementById('installation-notes').value = '';
            
            // Reset das posições
            clearPositionSelection();
            
            // Reset dos arquivos
            fileUpload.value = '';
            fileList.innerHTML = '';
            
            // Reset dos radios para valores padrão
            document.querySelector('input[name="request-type"][value="problem"]').checked = true;
            document.querySelector('input[name="location-type"][value="classroom"]').checked = true;
            
            // Atualizar a UI
            toggleRequestType();
            toggleLocationType();
            
            currentOrderId = null;
        };
        
        document.getElementById('go-to-dashboard').onclick = () => {
            window.location.href = 'painel-professor.html';
        };
    }

    // Função para mostrar toast notification
    function showToast(message, type = 'success') {
        // Limpar toast anterior se existir
        const existingContainer = document.querySelector('.toast-container');
        if (existingContainer) {
            existingContainer.remove();
            clearTimeout(toastTimeout);
        }

        // Criar container
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';

        // Criar toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Ícone baseado no tipo
        let iconClass;
        switch(type) {
            case 'success':
                iconClass = 'fas fa-check-circle';
                break;
            case 'error':
                iconClass = 'fas fa-exclamation-circle';
                break;
            case 'warning':
                iconClass = 'fas fa-exclamation-triangle';
                break;
            default:
                iconClass = 'fas fa-info-circle';
        }

        toast.innerHTML = `
            <div>
                <i class="${iconClass}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

        toastContainer.appendChild(toast);
        document.body.appendChild(toastContainer);

        // Mostrar toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Fechar toast ao clicar no botão
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toastContainer.remove();
        });

        // Fechar automaticamente após 5 segundos
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.remove();
            }, 300);
        }, 5000);
    }

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
            equipmentTypeSelect.value = 'app';
            equipmentTypeSelect.disabled = true;
            problemTypeSelect.disabled = true;
            
            // Se for laboratório, garantir que as posições sejam validadas corretamente
            const isLab = document.querySelector('input[name="location-type"]:checked').value === 'lab';
            if (isLab) {
                positionSelection.style.display = 'block';
            }
        } else {
            problemSection.style.display = 'block';
            installationSection.style.display = 'none';
            equipmentTypeSelect.disabled = false;
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
        
        computerTypeSelect.disabled = false;
        currentLabType = labs[selectedLab].type;
        computerTypeSelect.value = currentLabType;
        currentLabCapacity = labs[selectedLab].capacity;
        
        positionSelection.style.display = 'block';
        createPositionButtons(currentLabCapacity);
        updateEquipmentOptions();
    }

    // Gerenciar upload de arquivos
    function handleFileUpload() {
        fileList.innerHTML = '';
        const files = fileUpload.files;
        
        if (files.length > 3) {
            showToast('Você pode anexar no máximo 3 arquivos.', 'error');
            fileUpload.value = '';
            return;
        }
        
        for (let i = 0; i < files.length; i++) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileIcon = document.createElement('i');
            fileIcon.className = 'fas fa-file-alt';
            
            const fileName = document.createElement('span');
            fileName.textContent = files[i].name.length > 20 
                ? files[i].name.substring(0, 20) + '...' 
                : files[i].name;
            
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-file';
            removeBtn.innerHTML = '&times;';
            removeBtn.dataset.index = i;
            removeBtn.addEventListener('click', removeFile);
            
            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileItem.appendChild(removeBtn);
            fileList.appendChild(fileItem);
        }
    }

    // Remover arquivo da lista
    function removeFile(e) {
        const index = e.target.dataset.index;
        const files = Array.from(fileUpload.files);
        files.splice(index, 1);
        
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        fileUpload.files = dataTransfer.files;
        
        handleFileUpload();
    }

    // Função auxiliar para validar URLs
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Validar formulário
    function validateForm() {
        // Obter valores atuais
        const isInstallation = document.querySelector('input[name="request-type"]:checked').value === 'installation';
        const isLab = document.querySelector('input[name="location-type"]:checked').value === 'lab';
        const location = isLab ? document.getElementById('lab').value : document.getElementById('classroom').value;
        const computerType = isLab ? document.getElementById('computer-type').value : null;

        // Validações básicas
        if (!location) {
            showToast('Selecione um local válido', 'error');
            return false;
        }

        // Validações específicas para laboratório
        if (isLab) {
            if (!computerType) {
                showToast('Selecione o tipo de computador', 'error');
                return false;
            }

            if (computerType === 'desktop' && selectedPositions.size === 0) {
                showToast('Selecione pelo menos uma posição', 'error');
                return false;
            }
        }

        // Validações por tipo de solicitação
        if (isInstallation) {
            if (!document.getElementById('app-name').value.trim()) {
                showToast('Informe o nome do aplicativo', 'error');
                return false;
            }
        } else {
            if (!equipmentTypeSelect.value) {
                showToast('Selecione um equipamento', 'error');
                return false;
            }

            if (!problemTypeSelect.value) {
                showToast('Selecione um tipo de problema', 'error');
                return false;
            }

            if (!document.getElementById('problem-description').value.trim()) {
                showToast('Descreva o problema com detalhes', 'error');
                return false;
            }
        }

        return true;
    }

    // Enviar formulário
    async function submitForm(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            // Criar objeto padronizado com os dados do formulário
            const orderData = standardizeOrderData();
            
            // Simular envio assíncrono
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Salvar no localStorage
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Atualizar o timestamp para forçar recarregamento no painel
            localStorage.setItem('lastOrderUpdate', Date.now().toString());
            
            showSuccessModal(orderData.id);
        } catch (error) {
            console.error('Erro:', error);
            showToast('Erro ao enviar. Tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Ordem';
        }
    }
    function standardizeOrderData(formData) {
        const isInstallation = document.querySelector('input[name="request-type"]:checked').value === 'installation';
        const isLab = document.querySelector('input[name="location-type"]:checked').value === 'lab';
        
        // Dados básicos
        const order = {
            id: `ORD-${Date.now()}`,
            type: isInstallation ? 'installation' : 'problem',
            status: 'pending',
            date: new Date().toISOString(),
            requester: JSON.parse(localStorage.getItem('currentUser')),
            location: {
                type: isLab ? 'lab' : 'classroom',
                value: isLab ? document.getElementById('lab').value : document.getElementById('classroom').value
            }
        };
        
        // Adicionar dados específicos do laboratório
        if (isLab) {
            order.location.computerType = document.getElementById('computer-type').value;
            order.location.positions = Array.from(selectedPositions).sort((a, b) => a - b);
        }
        
        // Adicionar detalhes específicos do tipo de solicitação
        if (isInstallation) {
            order.details = {
                appName: document.getElementById('app-name').value.trim(),
                appVersion: document.getElementById('app-version').value.trim(),
                appLink: document.getElementById('app-link').value.trim(),
                notes: document.getElementById('installation-notes').value.trim()
            };
        } else {
            order.details = {
                equipment: document.getElementById('equipment-type').value,
                problemType: document.getElementById('problem-type').value,
                description: document.getElementById('problem-description').value.trim()
            };
        }
        
        // Adicionar anexos se existirem
        if (fileUpload.files.length > 0) {
            order.attachments = Array.from(fileUpload.files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }));
        }
        
        return order;
    }


    function showSuccessModal(orderId) {
        const modalHTML = `
            <div class="success-modal">
                <div class="modal-content">
                    <h3><i class="fas fa-check-circle"></i> Ordem Criada!</h3>
                    <p>Número: ${orderId}</p>
                    <div class="modal-actions">
                        <button id="view-orders" class="btn-primary">
                            <i class="fas fa-list"></i> Ver Ordens
                        </button>
                        <button id="new-order" class="btn-secondary">
                            <i class="fas fa-plus"></i> Nova Ordem
                        </button>
                        <button id="return-dashboard" class="btn-tertiary">
                            <i class="fas fa-home"></i> Painel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        
        // Configurar eventos dos botões
        modal.querySelector('#view-orders').addEventListener('click', () => {
            window.location.href = 'minhas-ordens.html';
        });
        
        modal.querySelector('#new-order').addEventListener('click', () => {
            resetForm();
            modal.remove();
        });
        
        modal.querySelector('#return-dashboard').addEventListener('click', () => {
            window.location.href = 'painel-professor.html';
        });
    }
    function resetForm() {
        // Resetar valores
        form.reset();
        
        // Resetar selects
        equipmentTypeSelect.selectedIndex = 0;
        problemTypeSelect.selectedIndex = 0;
        
        // Resetar textareas
        document.getElementById('problem-description').value = '';
        document.getElementById('installation-notes').value = '';
        
        // Resetar posições
        selectedPositions.clear();
        updateSelectedDisplay();
        
        // Resetar arquivos
        fileUpload.value = '';
        fileList.innerHTML = '';
        
        // Resetar UI
        document.querySelector('input[name="request-type"][value="problem"]').checked = true;
        document.querySelector('input[name="location-type"][value="classroom"]').checked = true;
        toggleRequestType();
        toggleLocationType();
    }

    function getFormDetails() {
        const isInstallation = document.querySelector('input[name="request-type"]:checked').value === 'installation';
        
        if (isInstallation) {
            return {
                appName: document.getElementById('app-name').value,
                appVersion: document.getElementById('app-version').value,
                appLink: document.getElementById('app-link').value,
                notes: document.getElementById('installation-notes').value
            };
        } else {
            return {
                equipment: document.getElementById('equipment-type').value,
                problemType: document.getElementById('problem-type').value,
                description: document.getElementById('problem-description').value
            };
        }
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
    form.addEventListener('submit', function(e) {
        submitForm(e);
    });



    cancelBtn.addEventListener('click', function() {
        const confirmationModal = `
            <div class="confirmation-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000;">
                <div style="background:white;padding:25px;border-radius:8px;width:90%;max-width:400px;text-align:center;">
                    <h3 style="margin-top:0;color:#2c3e50;"><i class="fas fa-exclamation-triangle"></i> Confirmar Cancelamento</h3>
                    <p style="margin-bottom:20px;">Deseja realmente cancelar a criação desta ordem?</p>
                    <div style="display:flex;justify-content:center;gap:10px;">
                        <button id="confirm-cancel" style="padding:10px 15px;background:#e74c3c;color:white;border:none;border-radius:4px;cursor:pointer;">
                            <i class="fas fa-times"></i> Sim, Cancelar
                        </button>
                        <button id="dont-cancel" style="padding:10px 15px;background:#3498db;color:white;border:none;border-radius:4px;cursor:pointer;">
                            <i class="fas fa-arrow-left"></i> Voltar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modalElement = document.createElement('div');
        modalElement.innerHTML = confirmationModal;
        document.body.appendChild(modalElement);
        
        document.getElementById('confirm-cancel').addEventListener('click', () => {
            window.location.href = 'painel-professor.html';
        });
        
        document.getElementById('dont-cancel').addEventListener('click', () => {
            modalElement.remove();
        });
    });

    // Inicialização
    toggleRequestType();
    toggleLocationType();
});