// ===== ANIMAÇÃO DE DIGITAÇÃO =====
function ativaLetra(elemento) {
    if (!elemento) return;
    
    const textoOriginal = elemento.textContent;
    elemento.textContent = '';
    
    let i = 0;
    function digitar() {
        if (i < textoOriginal.length) {
            elemento.textContent += textoOriginal.charAt(i);
            i++;
            setTimeout(digitar, 75);
        } else {
            // Manter o cursor piscando
            elemento.classList.add('digitacao-completa');
        }
    }
    
    digitar();
}

// ===== CONTROLE DE MÚSICA =====
function initAudioPlayer() {
    const audio = document.getElementById('motivacao-audio');
    const toggleBtn = document.getElementById('toggle-audio');
    const volumeSlider = document.getElementById('volume-slider');
    const volumePercent = document.getElementById('volume-percent');
    const audioControls = document.querySelector('.audio-controls');
    
    if (!audio) return;
    
    // Configurar volume inicial
    audio.volume = 0.5;
    volumeSlider.value = 50;
    volumePercent.textContent = '50%';
    
    // Iniciar a partir dos 42 segundos
    audio.currentTime = 42;
    
    // Controlador de play/pause
    toggleBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            this.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.classList.remove('muted');
            audioControls.classList.remove('hidden');
        } else {
            audio.pause();
            this.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.classList.add('muted');
        }
    });
    
    // Controle de volume
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        audio.volume = volume;
        volumePercent.textContent = `${this.value}%`;
        
        // Atualizar ícone baseado no volume
        if (volume === 0) {
            toggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            toggleBtn.classList.add('muted');
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            toggleBtn.classList.remove('muted');
        }
    });
    
    // Ocultar controles após 5 segundos de inatividade
    let hideTimeout;
    function resetHideTimeout() {
        clearTimeout(hideTimeout);
        audioControls.classList.remove('hidden');
        hideTimeout = setTimeout(() => {
            audioControls.classList.add('hidden');
        }, 5000);
    }
    
    // Mostrar controles ao interagir
    audioControls.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        audioControls.classList.remove('hidden');
    });
    
    audioControls.addEventListener('mouseleave', resetHideTimeout);
    
    // Resetar timer ao interagir com controles
    audioControls.querySelectorAll('button, input').forEach(element => {
        element.addEventListener('mouseenter', resetHideTimeout);
    });
    
    // Reproduzir música quando a seção de motivação for visível
    const motivacaoSection = document.getElementById('motivacao');
    let isPlaying = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isPlaying) {
                // Iniciar música com fade in
                audio.currentTime = 42;
                audio.volume = 0;
                audio.play();
                isPlaying = true;
                
                // Fade in suave
                const fadeInInterval = setInterval(() => {
                    if (audio.volume < 0.5) {
                        audio.volume += 0.05;
                    } else {
                        clearInterval(fadeInInterval);
                    }
                }, 100);
                
                // Mostrar controles
                audioControls.classList.remove('hidden');
                resetHideTimeout();
                
                // Adicionar efeito visual à seção
                entry.target.classList.add('active');
                
                // Adicionar classe de animação aos textos
                const motivacaoTexts = entry.target.querySelectorAll('.motivacao-text');
                motivacaoTexts.forEach((text, index) => {
                    setTimeout(() => {
                        text.style.animation = `fadeInUp 0.8s ease ${index * 0.2}s forwards`;
                        text.style.opacity = '0';
                    }, 100);
                });
            } else if (!entry.isIntersecting && isPlaying) {
                // Fade out quando sair da seção
                const fadeOutInterval = setInterval(() => {
                    if (audio.volume > 0.1) {
                        audio.volume -= 0.05;
                    } else {
                        clearInterval(fadeOutInterval);
                        audio.pause();
                        isPlaying = false;
                        
                        // Ocultar controles
                        setTimeout(() => {
                            audioControls.classList.add('hidden');
                        }, 1000);
                    }
                }, 100);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    if (motivacaoSection) {
        observer.observe(motivacaoSection);
    }
    
    // Pausar música ao sair da página
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !audio.paused) {
            audio.pause();
        }
    });
    
    // Tecla de espaço para play/pause
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
            e.preventDefault();
            toggleBtn.click();
        }
    });
    
    // Inicializar hide timeout
    resetHideTimeout();
}

// ===== MENU MOBILE =====
function initMenuMobile() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.navegacao-primaria');
    const menuIcon = menuToggle.querySelector('i');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-times');
        
        // Fechar menu ao clicar fora
        if (navMenu.classList.contains('active')) {
            document.addEventListener('click', closeMenuOnClickOutside);
        } else {
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    });
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('.navegacao-primaria a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
            document.removeEventListener('click', closeMenuOnClickOutside);
        });
    });
    
    function closeMenuOnClickOutside(event) {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    }
}

// ===== CARROSSEL DE PROJETOS =====
function initCarrossel() {
    const carrossel = document.querySelector('.carrossel-slides');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carrossel-prev');
    const nextBtn = document.querySelector('.carrossel-next');
    
    if (!carrossel || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Inicializar primeiro slide como ativo
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    
    function updateCarrossel() {
        // Mover slides
        carrossel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Atualizar indicadores
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Event listeners para dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarrossel();
            resetAutoPlay();
        });
    });
    
    // Botões anterior/próximo
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarrossel();
            resetAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarrossel();
            resetAutoPlay();
        });
    }
    
    // Auto-play
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarrossel();
        }, 5000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Pausar auto-play ao interagir
    const carrosselContainer = document.querySelector('.carrossel');
    if (carrosselContainer) {
        carrosselContainer.addEventListener('mouseenter', stopAutoPlay);
        carrosselContainer.addEventListener('mouseleave', startAutoPlay);
        carrosselContainer.addEventListener('touchstart', stopAutoPlay);
        carrosselContainer.addEventListener('touchend', startAutoPlay);
    }
    
    // Iniciar auto-play
    startAutoPlay();
}

// ===== FORMULÁRIO DE CONTATO =====
function initForm() {
    const form = document.querySelector('.contato-form');
    if (!form) return;
    
    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d*)/, '($1');
            }
            e.target.value = value;
        });
    }
    
    // Validação do formulário
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Validar campos obrigatórios
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'Este campo é obrigatório');
            } else {
                clearError(field);
                
                // Validação específica para email
                if (field.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        showError(field, 'Por favor, insira um email válido');
                    }
                }
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            
            // Scroll para o primeiro erro
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstError.focus();
            }
        } else {
            // Adicionar feedback visual
            const submitBtn = form.querySelector('.btn-enviar');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simular envio (em produção, isso seria feito pelo FormSubmit)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
                submitBtn.style.backgroundColor = '#4CAF50';
                
                // Resetar após 3 segundos
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    form.reset();
                }, 3000);
            }, 1500);
        }
    });
    
    // Limpar erros ao digitar
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    function showError(field, message) {
        clearError(field);
        field.classList.add('error');
        field.style.borderColor = '#e74c3c';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMAÇÃO AO SCROLL =====
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.servico-card, .projeto-link, .contato-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== HIGHLIGHT MENU ATUAL =====
function initMenuHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navegacao-primaria a');
    
    function highlightMenu() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.navegacao-primaria a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightMenu);
    highlightMenu(); // Chamar uma vez para inicializar
}

// ===== INICIALIZAR TUDO =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animação de digitação
    const tituloDigitando = document.querySelector('.digitando');
    if (tituloDigitando) {
        ativaLetra(tituloDigitando);
    }
    
    // Inicializar todas as funcionalidades
    initAudioPlayer();
    initMenuMobile();
    initCarrossel();
    initForm();
    initSmoothScroll();
    initScrollAnimation();
    initMenuHighlight();
    
    // Adicionar classe para estilizar link ativo
    const style = document.createElement('style');
    style.textContent = `
        .navegacao-primaria a.active {
            color: var(--ciano-claro) !important;
            background-color: rgba(255, 255, 255, 0.15) !important;
            font-weight: 600;
        }
        
        .motivacao-section.active .motivacao-text {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        .motivacao-section.active .musica-info {
            animation: float 3s ease-in-out infinite;
        }
        
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .digitacao-completa::after {
            animation: blink 1s infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Log de inicialização
    console.log('Portfólio Eliane Barbosa inicializado com sucesso!');
    
    // Preload da música
    const audio = document.getElementById('motivacao-audio');
    if (audio) {
        audio.load();
    }
});

// Prevenir scroll quando os controles de música estão visíveis
document.addEventListener('wheel', (e) => {
    const audioControls = document.querySelector('.audio-controls');
    if (audioControls && !audioControls.classList.contains('hidden')) {
        const rect = audioControls.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            e.preventDefault();
        }
    }
}, { passive: false });
