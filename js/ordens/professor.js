document.addEventListener('DOMContentLoaded', () => {
    // ========== CONTROLE DE FORMULÁRIO ==========
    const environmentRadios = document.querySelectorAll('input[name="environment"]');
    const equipmentRadios = document.querySelectorAll('input[name="equipment"]');
    const studentProblemsSection = document.getElementById('student-problems');
    const professorProblemsSection = document.getElementById('professor-problems');
    const roomSelect = document.getElementById('room-select');

    // Atualizar opções baseadas no ambiente selecionado
    environmentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const isLab = radio.value === 'lab';
            
            // Mostrar/ocultar seções de problema
            if (!isLab) {
                document.querySelector('input[name="equipment"][value="professor"]').checked = true;
                studentProblemsSection.style.display = 'none';
                professorProblemsSection.style.display = 'block';
            }
        });
    });

    // Alternar entre kits professor/aluno
    equipmentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const isStudentKit = radio.value === 'aluno';
            studentProblemsSection.style.display = isStudentKit ? 'block' : 'none';
            professorProblemsSection.style.display = isStudentKit ? 'none' : 'block';
        });
    });

    // Validar envio do formulário
    document.querySelector('.order-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!roomSelect.value) {
            alert('Selecione uma sala/laboratório!');
            return;
        }
        
        // Simular envio
        alert('Ordem criada com sucesso!');
        window.location.href = 'minhas-ordens.html';
    });

    // ========== CARREGAR DADOS DAS SALAS ==========
    function loadRoomOptions() {
        const salaOptions = [
            '101', '102', '103', '104', '105', '106', '107', 
            '108', '109', '110', '111', '112', '113',
            '304', '305', '307', '310', '311', '312', '313'
        ];
        
        const labOptions = [
            '202', '203', '204', '205', '206', '207', '208',
            '209', '210', '211', '213', '214', '215'
        ];
        
        const salaGroup = roomSelect.querySelector('optgroup[label="Salas de Aula"]');
        const labGroup = roomSelect.querySelector('optgroup[label="Laboratórios"]');
        
        // Limpar e adicionar opções
        salaGroup.innerHTML = '<option value="">Selecione a sala...</option>';
        labGroup.innerHTML = '';
        
        salaOptions.forEach(sala => {
            salaGroup.innerHTML += `<option value="${sala}">Sala ${sala}</option>`;
        });
        
        labOptions.forEach(lab => {
            labGroup.innerHTML += `<option value="${lab}">Lab ${lab}</option>`;
        });
    }
    
    // Inicializar
    loadRoomOptions();
});

// Dados das salas e laboratórios
const rooms = {
    salas: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "304", "305", "307", "310", "311", "312", "313"],
    labs: ["202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "213", "214", "215"]
};

// Problemas por tipo de equipamento
const problems = {
    professor: [
        "Monitor não liga",
        "Gabinete não inicia",
        "TV sem sinal",
        "Cabo HDMI com defeito",
        "Internet lenta",
        "Aplicativo não abre"
    ],
    aluno: [
        "Computador não liga",
        "Tela azul",
        "Teclado/mouse não funcionam",
        "Sem acesso à internet",
        "Software acadêmico faltando",
        "Problemas de áudio"
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const environmentRadios = document.querySelectorAll('input[name="environment"]');
    const locationSection = document.getElementById('location-section');
    const equipmentSection = document.getElementById('equipment-section');
    const problemsSection = document.getElementById('problems-section');

    // Atualiza o formulário quando muda o ambiente
    environmentRadios.forEach(radio => {
        radio.addEventListener('change', updateFormFlow);
    });

    function updateFormFlow() {
        const isLab = document.querySelector('input[name="environment"]:checked').value === 'lab';
        
        // Atualiza seção de localização
        locationSection.innerHTML = `
            <div class="form-group">
                <label style="color: white;">Selecione o ${isLab ? 'Laboratório' : 'Sala'}</label>
                <select id="room-select" class="room-select" required>
                    <option value="">Selecione...</option>
                    ${(isLab ? rooms.labs : rooms.salas).map(room => 
                        `<option value="${room}">${isLab ? 'Lab ' : 'Sala '}${room}</option>`
                    ).join('')}
                </select>
            </div>
        `;

        // Mostra/oculta seções
        equipmentSection.style.display = 'none';
        problemsSection.style.display = 'none';

        // Adiciona listener para seleção de sala/lab
        document.getElementById('room-select')?.addEventListener('change', () => {
            if (isLab) {
                showEquipmentOptions();
            } else {
                showProfessorProblems();
            }
        });
    }

    function showEquipmentOptions() {
        equipmentSection.innerHTML = `
            <div class="form-section">
                <h2 style="color: white;"><i class="fas fa-desktop"></i> Tipo de Equipamento</h2>
                <div class="radio-options">
                    <label class="radio-card">
                        <input type="radio" name="equipment" value="professor">
                        <div class="radio-content">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span>Kit Professor</span>
                        </div>
                    </label>
                    <label class="radio-card">
                        <input type="radio" name="equipment" value="aluno">
                        <div class="radio-content">
                            <i class="fas fa-laptop"></i>
                            <span>Computador Aluno</span>
                        </div>
                    </label>
                </div>
            </div>
        `;
        
        equipmentSection.style.display = 'block';
        
        // Adiciona listeners para os radios de equipamento
        document.querySelectorAll('input[name="equipment"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                showProblems(e.target.value);
            });
        });
    }

    function showProfessorProblems() {
        problemsSection.innerHTML = `
            <div class="form-section">
                <h2 style="color: white;"><i class="fas fa-exclamation-triangle"></i> Problemas no Kit Professor</h2>
                <div class="checkbox-group">
                    ${problems.professor.map(problem => `
                        <label class="checkbox-option">
                            <input type="checkbox" name="problem" value="${problem}">
                            <span>${problem}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="form-group">
                    <label style="color: white;">Descrição Adicional</label>
                    <textarea placeholder="Detalhe o problema..."></textarea>
                </div>
            </div>
        `;
        problemsSection.style.display = 'block';
    }

    function showProblems(equipmentType) {
        problemsSection.innerHTML = `
            <div class="form-section">
                <h2 style="color: white;"><i class="fas fa-exclamation-triangle"></i> Problemas no ${equipmentType === 'professor' ? 'Kit Professor' : 'Computador Aluno'}</h2>
                <div class="checkbox-group">
                    ${problems[equipmentType].map(problem => `
                        <label class="checkbox-option">
                            <input type="checkbox" name="problem" value="${problem}">
                            <span>${problem}</span>
                        </label>
                    `).join('')}
                </div>
                ${equipmentType === 'aluno' ? `
                    <div class="form-group">
                        <label style="color: white;">Posição do Computador</label>
                        <input type="number" min="1" max="30" placeholder="P: 12">
                    </div>
                ` : ''}
                <div class="form-group">
                    <label style="color: white;">Descrição Adicional</label>
                    <textarea placeholder="Detalhe o problema..."></textarea>
                </div>
            </div>
        `;
        problemsSection.style.display = 'block';
    }

    // Inicializa o formulário
    updateFormFlow();
});