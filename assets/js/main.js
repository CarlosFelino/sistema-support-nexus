document.addEventListener('DOMContentLoaded', () => {
    // Efeito de digitação no subtítulo
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const texts = [
            "Sistema de gerenciamento de ordens de serviço",
            "Suporte TI eficiente para professores",
            "Fatec Carapicuíba - Sempre Conectados"
        ];
        let count = 0;
        let index = 0;
        let currentText = '';
        let letter = '';
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            if (count === texts.length) count = 0;
            currentText = texts[count];
            
            if (isDeleting) {
                letter = currentText.slice(0, --index);
                typingSpeed = 50;
            } else {
                letter = currentText.slice(0, ++index);
                typingSpeed = 100;
            }

            subtitle.textContent = letter;
            
            if (!isDeleting && letter.length === currentText.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && letter.length === 0) {
                isDeleting = false;
                count++;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1000);
    }
    // Transição suave ao carregar
    document.body.classList.add('loaded');
});

