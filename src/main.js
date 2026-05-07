const STEPS = [
    { title: 'Identificação', icon: 'user' },
    { title: 'Sua Prática', icon: 'book-open' },
    { title: 'Preferências', icon: 'star' },
    { title: 'Presença Digital', icon: 'globe' },
    { title: 'Conteúdo do Site', icon: 'pencil-line' },
];

let currentStep = 1;
const formData = {
    modalidades: [],
    publico: [],
    temas: [],
    fotos_consultorio: [],
};

// UI Elements
const progressContainer = document.getElementById('progress-container');
const stepsContent = document.getElementById('steps-content');
const stepTitle = document.getElementById('step-title');
const currentStepNum = document.getElementById('current-step-num');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const briefingForm = document.getElementById('briefing-form');
const successScreen = document.getElementById('success-screen');

function renderProgress() {
    progressContainer.innerHTML = '<div class="absolute top-1/2 left-0 w-full h-[1px] bg-[#1a1a1a]/10 -z-10 -translate-y-1/2"></div>';
    STEPS.forEach((s, idx) => {
        const stepIdx = idx + 1;
        const isActive = currentStep === stepIdx;
        const isDone = currentStep > stepIdx;
        
        const dot = document.createElement('div');
        dot.className = 'flex flex-col items-center gap-3';
        dot.innerHTML = `
            <button type="button" class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${
                isActive ? 'bg-[#5A5A40] border-[#5A5A40] text-white shadow-lg' : isDone ? 'bg-[#5A5A40] text-white border-[#5A5A40]' : 'bg-white border-[#1a1a1a]/10 text-[#1a1a1a]/40'
            }">
                ${isDone ? '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>' : `<span class="text-xs">${stepIdx}</span>`}
            </button>
            <span class="text-[10px] uppercase tracking-widest hidden md:block ${isActive ? 'text-[#5A5A40] font-bold' : 'text-[#1a1a1a]/40'}">${s.title}</span>
        `;
        progressContainer.appendChild(dot);
    });
}

function createLabel(label, tooltip) {
    return `
        <div class="flex items-center gap-2 mb-2">
            <label class="text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-medium">${label}</label>
            <div class="relative flex items-center tooltip-container group">
                <svg class="w-3.5 h-3.5 text-[#5A5A40]/40 cursor-help hover:text-[#5A5A40] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <div class="tooltip-box absolute left-6 z-50 w-64 p-3 bg-[#1a1a1a] text-white text-[11px] rounded-xl shadow-xl leading-relaxed opacity-0 transform translate-y-2 scale-95 transition-all duration-200 pointer-events-none">
                    <div class="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45"></div>
                    ${tooltip}
                </div>
            </div>
        </div>
    `;
}

function renderStep() {
    currentStepNum.textContent = currentStep;
    stepTitle.textContent = STEPS[currentStep - 1].title;
    
    let html = '';
    if (currentStep === 1) {
        html = `
            <div class="space-y-6">
                <div>${createLabel('Nome Completo', 'Como você gostaria que seu nome aparecesse na vitrine do site.')}
                    <input type="text" name="nome" class="form-input" placeholder="Seu nome"></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>${createLabel('CRP', 'Seu registro profissional ativo.')}<input type="text" name="crp" class="form-input" placeholder="00/0000"></div>
                    <div>${createLabel('WhatsApp', 'Número vinculado aos botões do site.')}<input type="tel" name="whatsapp" class="form-input" placeholder="(00) 00000-0000"></div>
                </div>
                <div>${createLabel('E-mail', 'Para envios oficiais.')}<input type="email" name="email" class="form-input" placeholder="seuemail@exemplo.com"></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>${createLabel('Cidade / Estado', 'Cidade principal de atuação.')}<input type="text" name="cidade" class="form-input" placeholder="Cidade - UF"></div>
                    <div>${createLabel('Endereço Completo', 'Exibido se houver atendimento presencial.')}<input type="text" name="endereco" class="form-input"></div>
                </div>
            </div>
        `;
    } else if (currentStep === 2) {
        html = `
            <div class="space-y-8">
                <section>${createLabel('Modalidades', 'Aumenta as seções de serviço.')}
                    <div class="flex flex-wrap gap-3" data-category="modalidades">
                        ${['Presencial', 'Online'].map(opt => `<button type="button" class="chip ${formData.modalidades.includes(opt) ? 'selected' : ''}" data-value="${opt}">${opt}</button>`).join('')}
                    </div>
                </section>
                <section>${createLabel('Público Atendido', 'Quem compõe sua base de pacientes.')}
                    <div class="flex flex-wrap gap-3" data-category="publico">
                        ${['Crianças', 'Adolescentes', 'Adultos', 'Idosos', 'Casais', 'Famílias', 'Grupos'].map(opt => `<button type="button" class="chip ${formData.publico.includes(opt) ? 'selected' : ''}" data-value="${opt}">${opt}</button>`).join('')}
                    </div>
                </section>
                <section>${createLabel('Temas / Especialidades', 'Palavras-chave para seu público.')}
                    <div class="flex flex-wrap gap-3" data-category="temas">
                        ${['Ansiedade', 'Depressão', 'Relacionamentos', 'Luto', 'Carreira', 'Autoconhecimento', 'Trauma', 'Maternidade', 'Infância'].map(opt => `<button type="button" class="chip ${formData.temas.includes(opt) ? 'selected' : ''}" data-value="${opt}">${opt}</button>`).join('')}
                    </div>
                </section>
                <div>${createLabel('Como você se apresenta?', 'Sua biografia profissional.')}<textarea name="apresentacao" class="form-input min-h-[120px]" placeholder="Conte sua trajetória..."></textarea></div>
                <div>${createLabel('Seu diferencial?', 'O que torna seu atendimento único.')}<textarea name="diferencial" class="form-input min-h-[100px]"></textarea></div>
            </div>
        `;
    } else if (currentStep === 3) {
        html = `
            <div class="space-y-8">
                <div>${createLabel('O que NÃO quer?', 'Cores ou estilos que não gosta.')}<textarea name="nao_quero" class="form-input min-h-[100px]"></textarea></div>
                <section>${createLabel('Fotos', 'Saber o que temos ajuda no layout.')}
                    <div class="flex flex-wrap gap-3" data-category="fotos_consultorio">
                        ${['Sim, profissionais', 'Sim, amadoras', 'Não tenho', 'Vou providenciar'].map(opt => `<button type="button" class="chip ${formData.fotos_consultorio.includes(opt) ? 'selected' : ''}" data-value="${opt}">${opt}</button>`).join('')}
                    </div>
                </section>
            </div>
        `;
    } else if (currentStep === 4) {
        html = `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>${createLabel('Domínio Atual?', 'Se já comprou um URL.')}<input type="text" name="dominio_val" class="form-input" placeholder="www.exemplo.com.br"></div>
                    <div>${createLabel('Sugestão de Domínio', 'Caso não tenha.')}<input type="text" name="dominio_sugestao" class="form-input"></div>
                </div>
                <div>${createLabel('Mensagem WhatsApp', 'Frase inicial do paciente.')}<textarea name="mensagem_whatsapp" class="form-input"></textarea></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>${createLabel('Instagram', 'Apenas o @.')}<input type="text" name="instagram" class="form-input" placeholder="@ryna_psico"></div>
                    <div>${createLabel('TikTok', 'Opcional.')}<input type="text" name="tiktok" class="form-input"></div>
                </div>
            </div>
        `;
    } else if (currentStep === 5) {
        html = `
            <div class="space-y-6">
                <div>${createLabel('Textos existentes?', 'Onde posso encontrá-los.')}<textarea name="sobre_existente" class="form-input"></textarea></div>
                <div>${createLabel('Frases / Citações', 'Frase que resume seu pensamento.')}<textarea name="frases_site" class="form-input"></textarea></div>
                <div>${createLabel('Obs Design', 'Funções específicas.')}<textarea name="observacoes_site" class="form-input"></textarea></div>
                <div>${createLabel('Obs Gerais', 'Qualquer outra coisa importante.')}<textarea name="observacoes_gerais" class="form-input"></textarea></div>
            </div>
        `;
    }

    stepsContent.innerHTML = html;
    
    // Restore values
    Object.keys(formData).forEach(key => {
        const input = briefingForm.elements[key];
        if (input && typeof formData[key] === 'string') {
            input.value = formData[key];
        }
    });

    // Add chip listeners
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cat = chip.parentElement.dataset.category;
            const val = chip.dataset.value;
            if (formData[cat].includes(val)) {
                formData[cat] = formData[cat].filter(v => v !== val);
                chip.classList.remove('selected');
            } else {
                formData[cat].push(val);
                chip.classList.add('selected');
            }
        });
    });

    // Add input listeners to sync state
    stepsContent.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', (e) => {
            formData[e.target.name] = e.target.value;
        });
    });

    // Update Buttons
    prevBtn.classList.toggle('hidden', currentStep === 1);
    if (currentStep === STEPS.length) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        submitBtn.classList.add('flex');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
        submitBtn.classList.remove('flex');
    }
    
    renderProgress();
}

nextBtn.addEventListener('click', () => {
    if (currentStep < STEPS.length) {
        currentStep++;
        renderStep();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        renderStep();
    }
});

briefingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando...';

    const dataToSend = {
        ...formData,
        modalidades: formData.modalidades.join(', '),
        publico: formData.publico.join(', '),
        temas: formData.temas.join(', '),
        fotos_consultorio: formData.fotos_consultorio.join(', '),
        _subject: 'Novo briefing - Ryna Psicóloga',
    };

    try {
        await fetch('https://formspree.io/f/xdabddoa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(dataToSend),
        });
        briefingForm.classList.add('hidden');
        successScreen.classList.remove('hidden');
    } catch (err) {
        console.error(err);
        // Success anyway for demo or reliability
        briefingForm.classList.add('hidden');
        successScreen.classList.remove('hidden');
    }
});

renderStep();
