document.addEventListener('DOMContentLoaded', () => {

    const placeholderUrl = (text, w = 250, h = 200, color = '333') => `https://via.placeholder.com/${w}x${h}/${color}/FFFFFF?text=${encodeURIComponent(text)}`;

    let answerLocked = false;

    let playerAvatarSets = [];
    const totalHeroes = 12; // Quantidade atual de heróis que você já colocou na pasta

    for (let i = 1; i <= totalHeroes; i++) {
        playerAvatarSets.push({
            name: `Herói ${i}`,
            value: `h${i}`,
            pose_padrao: `artes/heroi${i}-padrao.png`,
            pose_derrota: `artes/heroi${i}-derrota.png`
        });
    }

    // Lista de NPCs por tipo (1 a 10 para cada tipo)
    const npcTypes = {
        contemplativo: Array.from({ length: 10 }, (_, i) => `artes/npc-contemplativo${i+1}.png`),
        chorao: Array.from({ length: 10 }, (_, i) => `artes/npc-chorao${i+1}.png`),
        maligno: Array.from({ length: 10 }, (_, i) => `artes/npc-maligno${i+1}.png`)
    };

    const bgList = Array.from({ length: 7 }, (_, i) => `artes/bg${i+1}.png`);
    let currentBackground = bgList[0]; // começa no primeiro fundo

    // Frases
    const eventTexts = {
        contemplativo: [
            "Obrigado pela ajuda! Nosso vilarejo estava sendo ameaçado por este vilão!",
            "Obrigado! Você é nosso herói!",
            "Uau! Você é forte. Nunca vi ninguém assim!",
            "Um dia eu vou treinar para ser forte como você!",
            "Obrigado! Nunca esquecerei seu nome!",
            "Prossiga com cuidado, viajante. Há muitos inimigos por aqui.",
            "Ouvi rumores de monstros vindo das montanhas...",
            "Tome cuidado, há inimigos à frente!",
            "Não confie em todos que você encontra pelo caminho.",
            "Você salvou minha vida, sou eternamente grato!"
        ],
        chorao: [
            "Não acredito no que você fez com ele(a). Ele(a) era da minha família!",
            "Eu o(a) conheci quando ainda era do bem. É uma pena que tenha tido esse fim.",
            "Obrigado, mas foi tarde demais. Ele(a) destruiu a minha aldeia.",
            "Obrigado! Finalmente alguém vingou a minha família.",
            "Ele(a) era o(a) meu(minha) único(a) amigo(a)... por que você fez isso?",
            "Ele não era assim... a maldição o(a) consumiu.",
            "Eu o(a) conheci quando ele(a) era um(a) jovem guerreiro(a) cheio(a) de esperança. É triste ver no que ele(a) se tornou.",
            "Antes de se tornar um monstro, ele(a) me salvou de um incêndio. Eu nunca pensei que ele(a) teria um fim como este.",
            "Agradeço, mas o que ele(a) fez não pode ser desfeito.",
            "Eu vi o mal tomar conta dele(a). Acredite ou não, no passado, ele(a) já foi uma pessoa boa."
        ],
        maligno: [
            "Você pode ter vencido esta batalha, mas a guerra está longe de acabar.",
            "Não acredito! O que você fez com meu(minha) discipulo(a)?",
            "Você está se tornando um problema para a liga dos vilões. Precisaremos exterminá-lo(a)!",
            "Você... não me esquecerei de seu rosto!",
            "Você é muito forte. Melhor me afastar, não é boa ideia lutar com você agora.",
            "Então você é o herói de quem todos falam... bem, logo deixará de ter tanta sorte.",
            "Ha, ha, há! Sim. Era eu quem o(a) estava controlando. Mas em breve você não terá a mesma sorte!",
            "Você pode ter vencido essa, mas não vencerá a próxima!",
            "Ainda não acabou! Meu próximo servo acabará com você!",
            "Você foi muito bem, mas agora já conhecemos todas as suas táticas!"
        ]
    };

    // Controle de NPCs usados
    let npcsUsados = new Set();

    // === VILÕES PERSONALIZADOS ===
    const villainAvatarSets = [
        { name: "BABY BOT", value: "v1", pose_padrao: "artes/vilao-babybot-padrao.png", pose_derrota: "artes/vilao-babybot-derrota.png", pose_vitoria: "artes/vilao-babybot-vitoria.png" },
        { name: "BAD BUNNY", value: "v2", pose_padrao: "artes/vilao-badbunny-padrao.png", pose_derrota: "artes/vilao-badbunny-derrota.png", pose_vitoria: "artes/vilao-badbunny-vitoria.png" },
        { name: "BALLET ALIEN", value: "v3", pose_padrao: "artes/vilao-balletalien-padrao.png", pose_derrota: "artes/vilao-balletalien-derrota.png", pose_vitoria: "artes/vilao-balletalien-vitoria.png" },
        { name: "BOXING MUMMY", value: "v4", pose_padrao: "artes/vilao-boxingmummy-padrao.png", pose_derrota: "artes/vilao-boxingmummy-derrota.png", pose_vitoria: "artes/vilao-boxingmummy-vitoria.png" },
        { name: "DARKCRAFT", value: "v5", pose_padrao: "artes/vilao-darkcraft-padrao.png", pose_derrota: "artes/vilao-darkcraft-derrota.png", pose_vitoria: "artes/vilao-darkcraft-vitoria.png" },
        { name: "DARKLINGO", value: "v6", pose_padrao: "artes/vilao-darklingo-padrao.png", pose_derrota: "artes/vilao-darklingo-derrota.png", pose_vitoria: "artes/vilao-darklingo-vitoria.png" },
        { name: "DARK QUEEN", value: "v7", pose_padrao: "artes/vilao-darkqueen-padrao.png", pose_derrota: "artes/vilao-darkqueen-derrota.png", pose_vitoria: "artes/vilao-darkqueen-vitoria.png" },
        { name: "EVIL CAPY", value: "v8", pose_padrao: "artes/vilao-evilcapy-padrao.png", pose_derrota: "artes/vilao-evilcapy-derrota.png", pose_vitoria: "artes/vilao-evilcapy-vitoria.png" },
        { name: "EVIL DOLLY", value: "v9", pose_padrao: "artes/vilao-evildolly-padrao.png", pose_derrota: "artes/vilao-evildolly-derrota.png", pose_vitoria: "artes/vilao-evildolly-vitoria.png" },
        { name: "HERMI1", value: "v10", pose_padrao: "artes/vilao-hermi1-padrao.png", pose_derrota: "artes/vilao-hermi1-derrota.png", pose_vitoria: "artes/vilao-hermi1-vitoria.png" },
        { name: "LAWYER OGRE", value: "v11", pose_padrao: "artes/vilao-lawyerogre-padrao.png", pose_derrota: "artes/vilao-lawyerogre-derrota.png", pose_vitoria: "artes/vilao-lawyerogre-vitoria.png" },
        { name: "MEGA SINGER", value: "v12", pose_padrao: "artes/vilao-megasinger-padrao.png", pose_derrota: "artes/vilao-megasinger-derrota.png", pose_vitoria: "artes/vilao-megasinger-vitoria.png" },
        { name: "OLDWARF", value: "v13", pose_padrao: "artes/vilao-oldawrf-padrao.png", pose_derrota: "artes/vilao-oldawrf-derrota.png", pose_vitoria: "artes/vilao-oldawrf-vitoria.png" },
        { name: "PICK A SHOE", value: "v14", pose_padrao: "artes/vilao-pickashoe-padrao.png", pose_derrota: "artes/vilao-pickashoe-derrota.png", pose_vitoria: "artes/vilao-pickashoe-vitoria.png" },
        { name: "SPACE COWBOY", value: "v15", pose_padrao: "artes/vilao-spacecowboy-padrao.png", pose_derrota: "artes/vilao-spacecowboy-derrota.png", pose_vitoria: "artes/vilao-spacecowboy-vitoria.png" },
        { name: "STITCH FIGHTER", value: "v16", pose_padrao: "artes/vilao-stitchfighter-padrao.png", pose_derrota: "artes/vilao-stitchfighter-derrota.png", pose_vitoria: "artes/vilao-stitchfighter-vitoria.png" },
        { name: "SUNNY LEO", value: "v17", pose_padrao: "artes/vilao-sunnyleo-padrao.png", pose_derrota: "artes/vilao-sunnyleo-derrota.png", pose_vitoria: "artes/vilao-sunnyleo-vitoria.png" },
        { name: "SUPER NOT HERO", value: "v18", pose_padrao: "artes/vilao-supernothero-padrao.png", pose_derrota: "artes/vilao-supernothero-derrota.png", pose_vitoria: "artes/vilao-supernothero-vitoria.png" }
    ];


    // ######################################################################
    // ### FIM DA ÁREA DE CONFIGURAÇÃO ###
    // ######################################################################


    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const transitionScreen = document.getElementById('transition-screen');
    const victoryScreen = document.getElementById('victory-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const addLevelBtn = document.getElementById('add-level-btn');
    const removeLevelBtn = document.getElementById('remove-level-btn');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const levelSettingsContainer = document.getElementById('level-settings-container');
    const correctBtn = document.getElementById('correct-btn');
    const incorrectBtn = document.getElementById('incorrect-btn');
    const skipBtn = document.getElementById('skip-btn');
    // Elementos do modal de seleção de avatar
    const avatarModal = document.getElementById('avatar-selection-modal');
    const avatarGrid = document.getElementById('avatar-grid');
    let currentPlayerDivForAvatar = null;


        let gameState = {};

    // === HISTÓRIAS DO MODO HISTÓRIA ===
        const stories = {
            1: {
                intro: `Uma doença misteriosa está destruindo o reino. Os magos acreditam que ela seja causada por alguma magia maligna e a única cura é a flor que nasce no topo da Montanha do Sol Poente, do outro lado do continente.

    Atenção, heróis! Vocês precisam levar o último sábio que sabe como usar a flor através de reinos hostis, cheios de monstros, que farão de tudo impedir que a cura seja encontrada. Boa sorte!`,
                ending: `Chegando, finalmente, ao topo da montanha, os heróis e o sábio encontram a flor, mas descobrem que para a mágica funcionar, é necessário energia vital.

    O sábio revela que sua missão sempre foi um sacrifício: se despedindo do grupo, ele ingere a flor e seu corpo se transforma em uma árvore radiante no cume da montanha.

    A árvore emite uma aura de cura que se espalha por todo o reino, purificando a terra da doença de forma permanente.

    Parabéns, heróis! Vocês concluíram sua missão.`
            },
            2: {
                intro: `Um grande mal, que havia sido aprisionado há séculos, está prestes a se libertar. 
                
    Seu poder representa uma ameaça para o mundo inteiro. 

    A única forma de derrotá-lo é viajando pelo continente e derrotando os generais malignos que estão tramando seu retorno. 
    
    Avante, heróis! O destino do mundo está em suas mãos!`,
                ending: `Após derrotar o último general, os heróis descobrem a verdade: os "generais" não estavam tentando libertar o vilão, mas sim roubar o poder dele para si mesmos, o que enfraquecia sua prisão.

    Ao derrotá-los, os heróis, fortaleceram as correntes mágicas que selam o grande mal, o impedindo de se libertar e causar destruição ao mundo.

    Parabéns, heróis! Vocês concluíram sua missão.`
            },
            3: {
                intro: `Durante um trabalho, os heróis descobrem acidentalmente um terrível segredo: o imperador é um impostor, um poderoso monstro disfarçado, que planeja dominar o mundo. 

    Marcados como traidores, com suas cabeças a prêmio, vocês precisam fugir, enfrentando todo tipo de perigo, para chegar às Terras Livres, onde encontrarão auxílio para lutar contra a farsa.`,
                ending: `Finalmente chegando às Terras Livres, os heróis encontram antigos amigos e os informam sobre a verdadeira identidade do rei. 

    Utilizando a "Pedra da Verdade", um artefato mágico, um grupo de sábios realiza uma mágica que faz com que os olhos de todos do reino sejam abertos, percebendo a malícia do impostor.

    O falso rei é preso, e seu plano, frustrado.

    Parabéns, heróis! Vocês concluíram sua missão.`
            },
            4: {
                intro: `Recentemente, soldados do rei encontraram o diário e o mapa inacabado de um explorador lendário que desapareceu há anos. 

    Esse diário conta de terras cheias de magia e riquezas, mas também de monstros terríveis. 

    Heróis, vocês foram contratados para encontrar esse explorador e trazê-lo em segurança. Que a sorte esteja com vocês!`,
                ending: `Finalmente, os heróis encontram o explorador, mas ele não está perdido nem em perigo. 

    Ele se tornou o líder de uma tribo pacífica e próspera nas novas terras e não tem nenhum desejo de voltar. 

    Recebendo, cada um, muitas riquezas, os heróis voltam para o rei e o informam dos ocorridos.

    O rei fica extremamente contente com as notícias, revelando que o explorador é, na verdade, seu irmão.

    Parabéns, heróis! Vocês concluíram sua missão.`
            },
            5: {
                intro: `Um dragão mágico, que dizem ser capaz de realizar qualquer desejo, aparece, pelo mundo, uma vez por ano. 

    Vocês descobrem que hoje é o dia de sua aparição.

    Heróis, vocês devem partir em uma missão para encontrar esse dragão e pedir a cura da maldição que aflige, há anos, sua terra natal.`,
                ending: `Encontrando, finalmente, o Dragão, ele revela ao grupo de heróis que não concede desejos...

    Diz que que tudo aquilo foi um teste para julgar a dignidade deles, e explica que a maldição na verdade nunca existiu: era tudo uma ilusão criada por ele mesmo, para chamar a atenção dos heróis.

    Ao obterem sucesso na missão, o dragão, satisfeito, remove a ilusão e concede poderes aos heróis, certo de que eles os usarão para o bem de todos.

    Parabéns, heróis! Vocês concluíram sua missão.`
            },
            6: {
                intro: `O rei morreu e o reino foi dividido entre seus três filhos, que agora estão em guerra um contra o outro.

    Vocês descobrem que a guerra é secretamente manipulada por um grupo de monstros que quer ver o reino destruído.

    Heróis, sua missão é viajar pelas regiões em guerra e acabar com esses monstros, restaurando a paz à terra.`,
                ending: `Depois de derrotar os monstros manipuladores, a guerra acaba.

    Os três irmãos despertam do feitiço e eles decidem unificar o reino sob um governo formado pelos três, governando juntos em igualdade.

    Parabéns, heróis! Vocês concluíram sua missão.`
            },
            7: {
                intro: `Recentemente, rumores de um lendário cajado mágico, de grande poder, começaram a surgir.

    Pesquisando, vocês descobrem que ele realmente existe, e que foi visto pela última vez há séculos, do outro lado do continente.

    Heróis, vocês devem embarcar em uma jornada e enfrentar muitos perigos, para encontrar essa arma antes que ela caia nas mãos erradas.`,
                ending: `Ao final de todas as batalhas, os heróis chegam ao local do cajado lendário.

    O cajado, de imenso poder, tem vontade própria e, compreendendo a preocupação dos heróis, decide se autodestruir, para, assim, evitar que qualquer ser maligno tome conta dele.

    Com uma explosão de luz, os heróis sentem a magia se dissipando no ar. O cajado não mais existe: o perigo já passou.

    Parabéns, heróis! Vocês concluíram sua missão.`
            }
        };

    let timerInterval = null;
    let levelCounter = 0;
    let playerCounter = 0;

    function createAvatarSelector(sets, className) {
        const select = document.createElement('select');
        select.className = className;
        sets.forEach(set => {
            const option = document.createElement('option');
            option.value = set.value;
            option.textContent = set.name;
            select.appendChild(option);
        });
        return select;
    }


    let players = [];
    let nextPlayerId = 1;
    let playerToUpdateAvatar = null;

    function updatePlayersDisplay() {
        const playersList = document.getElementById('players-list');
        playersList.innerHTML = '';
        players.forEach(player => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `
                <img src="${player.avatar.pose_padrao}" alt="Avatar" data-id="${player.id}">
                <span>${player.name}</span>
                <button class="remove-player-btn" data-id="${player.id}">&times;</button>
            `;
            playersList.appendChild(card);
        });
        validateGameStart();
    }

    function validateGameStart() {
        const startGameBtn = document.getElementById('start-game-btn');
        const playerError = document.getElementById('player-error');
        const canStart = players.length >= 2;
        startGameBtn.disabled = !canStart;
        playerError.textContent = canStart ? '' : 'É necessário ter pelo menos 2 jogadores.';
    }

// Substitua pela versão abaixo (retorna o player criado)
    function addPlayer() {
        const nameInput = document.getElementById('playerName');
        const playerName = nameInput.value.trim();
        if (!playerName) return null; // nada a fazer

        // limite opcional (se quiser restringir a 8 jogadores)
        if (players.length >= 8) {
            alert('Máximo de 8 jogadores.');
            return null;
        }

        const initialHP = parseInt(document.getElementById("player-hp").value) || 5;

        // escolhe um avatar livre (ou o primeiro disponível)
        const availableAvatar = playerAvatarSets.find(av => !players.some(p => p.avatar?.value === av.value))
                                || playerAvatarSets[0];

        const player = {
            id: nextPlayerId++,
            name: playerName,
            hp: initialHP,
            avatar: availableAvatar,
            itemEspecial: null
        };

        players.push(player);
        updatePlayersDisplay();

        nameInput.value = ""; // limpa campo
        nameInput.focus();

        return player; // **IMPORTANTE**: retornamos o player criado
    }

    // Listener para ENTER no input do nome (abre seleção de avatar para o novo jogador)
    const playerNameInput = document.getElementById('playerName');
    playerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newPlayer = addPlayer();
            if (newPlayer) openAvatarModal(newPlayer);
        }
    });

    // Ajuste também o clique no botão "Adicionar Jogador" para abrir o modal
    addPlayerBtn.addEventListener('click', () => {
        const newPlayer = addPlayer();
        if (newPlayer) openAvatarModal(newPlayer);
    });

    document.getElementById('players-list').addEventListener('click', e => {
        if (e.target.classList.contains('remove-player-btn')) {
            // Remover jogador
            const idToRemove = parseInt(e.target.dataset.id, 10);
            players = players.filter(p => p.id !== idToRemove);
            updatePlayersDisplay();
        } else if (e.target.tagName === 'IMG') {
            // Abrir modal para trocar avatar
            const idToUpdate = parseInt(e.target.dataset.id, 10);
            const player = players.find(p => p.id === idToUpdate);
            if (player) {
                openAvatarModal(player); // agora usa a versão corrigida do openAvatarModal
            }
        }
    });

    function openAvatarModal(player) {
        playerToUpdateAvatar = player;
        avatarGrid.innerHTML = '';

        const usedAvatars = players.filter(p => p.id !== player.id).map(p => p.avatar.value);

        playerAvatarSets.forEach(avatar => {
            const avatarOption = document.createElement('div');
            avatarOption.className = 'avatar-option-large';
            avatarOption.style.backgroundImage = `url('${avatar.pose_padrao}')`;
            avatarOption.dataset.value = avatar.value;

            if (usedAvatars.includes(avatar.value)) {
                avatarOption.classList.add('disabled');
            }

            avatarOption.addEventListener('click', () => {
                if (avatarOption.classList.contains('disabled')) return;
                playerToUpdateAvatar.avatar = avatar;
                updatePlayersDisplay();
                closeAvatarModal();
            });

            avatarGrid.appendChild(avatarOption);
        });

        avatarModal.classList.remove('hidden');
        avatarModal.style.display = 'flex';
    }

    function closeAvatarModal() {
        avatarModal.classList.add('hidden');
        avatarModal.style.display = 'none';
    }

    function updateAvatarAvailability() {
        const chosenAvatars = Array.from(document.querySelectorAll('.player-config'))
            .map(div => div.dataset.avatar)
            .filter(v => v);

        document.querySelectorAll('.avatar-option').forEach(option => {
            const avatarValue = option.dataset.value;
            if (chosenAvatars.includes(avatarValue) && !option.classList.contains('selected')) {
                option.classList.add('disabled');
            } else {
                option.classList.remove('disabled');
            }
        });
    }


    function removeLastPlayerConfig() {
        if (playerSetupContainer.children.length > 0) {
            playerSetupContainer.removeChild(playerSetupContainer.lastElementChild);
            playerCounter--;
        }
    }

    // --- Substituir função addLevelConfig por esta versão:
    function addLevelConfig() {
        levelCounter++;
        const levelDiv = document.createElement('div');
        levelDiv.classList.add('level-config');
        const defaultHP = levelCounter + 1;
        levelDiv.innerHTML = `
            <h4>Nível ${levelCounter}</h4>
            <input type="number" class="villain-hp" placeholder="HP do Vilão (acertos)" value="${defaultHP}" min="1">
            <input type="number" class="time-per-question" placeholder="Tempo por pergunta (s)" value="60" min="5">
        `;
        const usedAvatars = Array.from(document.querySelectorAll('.villain-avatar')).map(sel => sel.value);
        const availableAvatars = villainAvatarSets.filter(a => !usedAvatars.includes(a.value));
        const avatarSelect = createAvatarSelector(villainAvatarSets, 'villain-avatar');
        if (availableAvatars.length > 0) avatarSelect.value = availableAvatars[Math.floor(Math.random() * availableAvatars.length)].value;
        levelDiv.appendChild(avatarSelect);
        levelSettingsContainer.appendChild(levelDiv);
    }

    function removeLastLevelConfig() {
        if (levelSettingsContainer.children.length > 0) {
            levelSettingsContainer.removeChild(levelSettingsContainer.lastElementChild);
            levelCounter--;
        }
    }

    function initializeGame() {
        if (players.length === 0) {
            alert("Por favor, adicione pelo menos um jogador.");
            return;
        }

        const questionsInput = document.getElementById('questions-list').value.split('\n').filter(q => q.trim() !== '');
        if (questionsInput.length === 0) {
            alert("Por favor, insira pelo menos uma pergunta.");
            return;
        }
        if (document.getElementById('shuffle-questions').checked) shuffleArray(questionsInput);

        const levelConfigs = [];
        document.querySelectorAll('.level-config').forEach(div => {
            const avatarValue = div.querySelector('.villain-avatar').value;
            const avatarSet = villainAvatarSets.find(s => s.value === avatarValue);
            levelConfigs.push({
                villainName: avatarSet.name,
                maxVillainHP: parseInt(div.querySelector('.villain-hp').value),
                timePerQuestion: parseInt(div.querySelector('.time-per-question').value),
                avatar: avatarSet
            });
        });
        if (levelConfigs.length === 0) {
            alert("Por favor, adicione e configure pelo menos um nível.");
            return;
        }

        gameState = {
            players,
            questions: questionsInput,
            levels: levelConfigs,
            hpMode: document.getElementById('hp-mode').value,
            initialPlayerHP: parseInt(document.getElementById('player-hp').value),
            resetHpOnLevelUp: document.getElementById('reset-hp-on-level-up').checked,
            currentLevelIndex: 0,
            currentPlayerIndex: 0,
            currentQuestionIndex: 0,
            sharedPlayerHP: parseInt(document.getElementById('player-hp').value),
            currentVillainHP: 0,
            victoriesSinceLastEvent: 0,
            enemiesDefeated: 0,
        };

        // Normaliza os HPs para o valor configurado (evita que fique maior que o máximo)
        if (gameState.hpMode === 'individual') {
            gameState.players.forEach(p => p.hp = gameState.initialPlayerHP);
        } else {
            gameState.sharedPlayerHP = gameState.initialPlayerHP;
        }

        if (document.getElementById('enable-story-mode').checked) {
            const storySelection = document.getElementById('story-selection').value;
            if (storySelection === "random") {
                gameState.story = stories[Math.ceil(Math.random()*7)];
            } else {
                gameState.story = stories[storySelection];
            }

            showIntroCutscene(() => {
                setupScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
                startLevel();
            });
            return; // impede de iniciar direto
        }

        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startLevel();
    }

    function showIntroCutscene(callback) {
        const intro = document.getElementById("intro-cutscene");
        const textEl = document.getElementById("intro-text");
        const text = gameState.story?.intro || "Bem-vindos, heróis!";

        // coloca o texto na cutscene
        textEl.textContent = text;

        // --------- cálculo da duração (em ms) ----------
        const baseSpeed = 120;      // ms por caractere (ajuste fino: menor = mais rápido)
        const minDuration = 8000;  // duração mínima (8s)
        const maxDuration = 60000; // duração máxima (60s)
        const duration = Math.min(Math.max(text.length * baseSpeed, minDuration), maxDuration);
        // -----------------------------------------------

        // reinicia animação caso já tenha rodado antes (garante que sempre recomeça)
        textEl.style.animation = 'none';
        // força reflow para zerar a animação
        void textEl.offsetWidth;
        // aplica animação com duração calculada (ms é aceito aqui)
        textEl.style.animation = `scrollText ${duration}ms linear forwards`;

        // mostra a cutscene (fade-in definido no CSS)
        intro.classList.remove("hidden");
        intro.classList.add("cutscene-active");

        // quando terminar a rolagem, faz fade-out e depois chama callback
        setTimeout(() => {
            // inicia fade-out
            intro.classList.remove("cutscene-active");
            // espera o fade-out (CSS) terminar — use 1000ms para margem de segurança
            setTimeout(() => {
                intro.classList.add("hidden");
                if (typeof callback === 'function') callback();
            }, 1000);
        }, duration);
    }

    function startLevel() {
        // garante que se estava processando uma vitória, o flag seja removido agora
        if (gameState) gameState.handlingLevelWin = false;

        const level = gameState.levels[gameState.currentLevelIndex];
        gameState.currentVillainHP = level.maxVillainHP;

        // Recuperar HP se configurado
        if (gameState.resetHpOnLevelUp && gameState.currentLevelIndex > 0) {
            if (gameState.hpMode === 'shared') gameState.sharedPlayerHP = gameState.initialPlayerHP;
            else gameState.players.forEach(p => p.hp = gameState.initialPlayerHP);
        }

        // === Aplica o fundo atual da fase ===
        document.body.style.backgroundImage = `url('${currentBackground}')`;

        // Transição antes da luta
        showTransition(`Nível ${gameState.currentLevelIndex + 1}: ${level.villainName}`, 3, startTurn);
        updateArt();
    }

    function startTurn() {
        updateUI();
        updateArt();

        if (gameState.currentQuestionIndex >= gameState.questions.length) {
            shuffleArray(gameState.questions);
            gameState.currentQuestionIndex = 0;
        }

        startTimer();
    }


    function nextTurn() {
        let attempts = 0;
        do {
            gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
            attempts++;
        } while (gameState.players[gameState.currentPlayerIndex].hp <= 0 && attempts < gameState.players.length * 2)

        if (gameState.players.every(p => p.hp <= 0)) {
            gameOver();
            return;
        }
        gameState.currentQuestionIndex++;
        const nextPlayerName = gameState.players[gameState.currentPlayerIndex].name;
        showTransition(`Prepare-se, ${nextPlayerName}!`, 5, startTurn);
    }

    function handleAnswer(isCorrect) {
        if (answerLocked) return;
        answerLocked = true;

        const player = gameState.players[gameState.currentPlayerIndex];
        const playerArt = document.getElementById('player-art');
        const originalPose = player.avatar.pose_padrao;

        if (isCorrect) {
            // Dano base
            let damage = 1;

            // Espada lendária: próximo ataque = TRIPLO de dano e depois consome
            if (player.itemEspecial === 'espada') {
                damage = 3;
                player.itemEspecial = null;
            }

            gameState.currentVillainHP -= damage;
            if (gameState.currentVillainHP < 0) gameState.currentVillainHP = 0;

            // anima ataque do herói e hit no vilão
            playerArt.style.backgroundImage = `url('${player.avatar.pose_padrao.replace('-padrao.png', '_ataque.png')}')`;
            triggerHitEffect('villain-art');
            setTimeout(() => {
                playerArt.style.backgroundImage = `url('${originalPose}')`;
            }, 600);

        } else {
            // Escudo divino: ignora um dano e depois consome
            let damageToPlayer = 1;
            if (player.itemEspecial === 'escudo') {
                damageToPlayer = 0;
                player.itemEspecial = null;
            }

            if (gameState.hpMode === 'shared') {
                // aplica dano e garante que fique entre 0 e initialPlayerHP
                gameState.sharedPlayerHP = Math.max(0, Math.min(gameState.initialPlayerHP, (gameState.sharedPlayerHP || 0) - damageToPlayer));
            } else {
                // aplica dano no jogador atual e garante limites
                player.hp = Math.max(0, Math.min(gameState.initialPlayerHP, (player.hp || 0) - damageToPlayer));
            }

            // hit no herói
            triggerHitEffect('player-art');
        }

        updateUI();

        setTimeout(() => {
            // Vilão morreu?
            if (gameState.currentVillainHP <= 0) {
                levelWon();
                answerLocked = false;
                return;
            }

            // Todos derrotados?
            const allPlayersDefeated = (gameState.hpMode === 'shared')
                ? gameState.sharedPlayerHP <= 0
                : gameState.players.every(p => p.hp <= 0);

            if (allPlayersDefeated) {
                gameOver();
                answerLocked = false;
                return;
            }

            // Se modo individual e o jogador atual zerou HP, mostra transição de derrota dele
            const currentPlayerDefeated = (gameState.hpMode === 'individual') && (player.hp <= 0);
            if (currentPlayerDefeated) {
                showTransition(`${player.name} foi derrotado(a)!`, 4, () => {
                    nextTurn();
                    answerLocked = false;
                });
            } else {
                nextTurn();
                answerLocked = false;
            }
        }, 1500);
    }

    let fadaUsada = false;
    let mercadorUsado = false;

    function triggerRandomEvent(callback) {
        // Construir opções: NPC sempre presente; fada/mercador só se já houver 3 inimigos derrotados
        const opcoes = ["npc"];
        if (!fadaUsada && (gameState.enemiesDefeated || 0) >= 3) opcoes.push("fada");
        if (!mercadorUsado && (gameState.enemiesDefeated || 0) >= 3) opcoes.push("mercador");

        const escolha = opcoes[Math.floor(Math.random() * opcoes.length)];

        // Pega herói atual/vencedor
        const vencedor = gameState.lastWinner || gameState.players[gameState.currentPlayerIndex];

        // === EVENTO FADA ===
        if (escolha === "fada") {
            fadaUsada = true;
            const overlay = document.getElementById("event-overlay");
            overlay.classList.remove("hidden");

            document.getElementById("event-bg").style.backgroundImage = `url('${currentBackground}')`;
            document.getElementById("event-player-art").style.backgroundImage = `url('${vencedor.avatar.pose_padrao}')`;
            document.getElementById("event-npc-art").style.backgroundImage = "url('artes/fada.png')";

            const dialogueText = document.getElementById("dialogue-text");
            dialogueText.textContent = "Saudações, bravo herói. Deixe-me cuidar de suas feridas: irei restaurar toda sua vida!";

            document.getElementById("next-dialogue-btn").onclick = () => {
                overlay.classList.add("hidden");

                // efeito: restaura HP (garantindo limites)
                if (gameState.hpMode === "shared") {
                    gameState.sharedPlayerHP = gameState.initialPlayerHP;
                } else {
                    vencedor.hp = gameState.initialPlayerHP;
                }
                updateUI();

                document.getElementById("next-dialogue-btn").onclick = null;
                callback();
            };
            return;
        }

        // === EVENTO MERCADOR ===
        if (escolha === "mercador") {
            mercadorUsado = true;
            const overlay = document.getElementById("event-overlay");
            overlay.classList.remove("hidden");

            document.getElementById("event-bg").style.backgroundImage = `url('${currentBackground}')`;
            document.getElementById("event-player-art").style.backgroundImage = `url('${vencedor.avatar.pose_padrao}')`;
            document.getElementById("event-npc-art").style.backgroundImage = "url('artes/mercador.png')";

            // monta itens
            const itens = [
                { img: "itens/item3.png", desc: "Poção: restaura toda a sua vida", efeito: "pocao" },
                { img: "itens/item1.png", desc: "Escudo: bloqueia o próximo dano", efeito: "escudo" },
                { img: "itens/item2.png", desc: "Espada: triplica o próximo ataque", efeito: "espada" }
            ];

            const itemContainer = document.createElement("div");
            itemContainer.className = "merchant-items-container";

            itens.forEach(item => {
                const div = document.createElement("div");
                div.className = "merchant-item";

                const img = document.createElement("img");
                img.src = item.img;
                img.style.width = "100%";
                img.style.height = "150px";
                img.style.objectFit = "contain";

                const p = document.createElement("p");
                p.textContent = item.desc;
                p.style.fontSize = "0.8em";
                p.style.marginTop = "10px";

                div.appendChild(img);
                div.appendChild(p);

                // Desabilita poção se já estiver com vida cheia (visual + bloqueio de clique)
                if (item.efeito === "pocao") {
                    let cheio = (gameState.hpMode === "shared")
                        ? (gameState.sharedPlayerHP >= gameState.initialPlayerHP)
                        : (vencedor.hp >= gameState.initialPlayerHP);

                    if (cheio) {
                        div.classList.add("disabled");
                        div.style.pointerEvents = "none";
                    }
                }

                div.onclick = () => {
                    if (item.efeito === "pocao") {
                        // poção: cura imediata (garante limites)
                        if (gameState.hpMode === "shared") {
                            gameState.sharedPlayerHP = gameState.initialPlayerHP;
                        } else {
                            vencedor.hp = gameState.initialPlayerHP;
                        }
                        updateUI();
                        vencedor.itemEspecial = null;
                    } else {
                        // escudo ou espada: guardam até serem usados
                        vencedor.itemEspecial = item.efeito;
                    }

                    const container = document.querySelector('#event-overlay .merchant-items-container');
                    if (container) container.remove();
                    overlay.classList.add("hidden");

                    const nextBtn = document.getElementById("next-dialogue-btn");
                    if (nextBtn) nextBtn.onclick = null;

                    callback();
                };

                itemContainer.appendChild(div);
            });

            overlay.appendChild(itemContainer);
            return;
        }

        // === NPC NORMAL ===
        const tiposDisponiveis = Object.keys(npcTypes).filter(tipo =>
            npcTypes[tipo].some(npc => !npcsUsados.has(npc))
        );
        if (tiposDisponiveis.length === 0) {
            callback();
            return;
        }

        const tipo = tiposDisponiveis[Math.floor(Math.random() * tiposDisponiveis.length)];
        const npcsDisponiveis = npcTypes[tipo].filter(npc => !npcsUsados.has(npc));
        const npcEscolhido = npcsDisponiveis[Math.floor(Math.random() * npcsDisponiveis.length)];
        npcsUsados.add(npcEscolhido);

        if (!eventTexts.usadas) eventTexts.usadas = new Set();
        let frasesDisponiveis = eventTexts[tipo].filter(f => !eventTexts.usadas.has(f));
        if (frasesDisponiveis.length === 0) {
            eventTexts.usadas.clear();
            frasesDisponiveis = eventTexts[tipo];
        }
        let frase = frasesDisponiveis[Math.floor(Math.random() * frasesDisponiveis.length)];
        eventTexts.usadas.add(frase);

                document.getElementById("event-bg").style.backgroundImage = `url('${currentBackground}')`;
        document.getElementById("event-player-art").style.backgroundImage = `url('${vencedor.avatar.pose_padrao}')`;
        document.getElementById("event-npc-art").style.backgroundImage = `url('${npcEscolhido}')`;

        const jogador = vencedor.name;
        const inimigo = gameState.levels[gameState.currentLevelIndex].villainName;
        const proximoInimigo = gameState.levels[gameState.currentLevelIndex + 1]?.villainName || "";
        frase = frase.replace(/\[jogador\]/g, jogador)
                    .replace(/\[inimigo\]/g, inimigo)
                    .replace(/\[proximo\]/g, proximoInimigo);

        const dialogueText = document.getElementById("dialogue-text");
        dialogueText.textContent = "";
        let i = 0;
        const interval = setInterval(() => {
            dialogueText.textContent += frase.charAt(i);
            i++;
            if (i >= frase.length) clearInterval(interval);
        }, 40);

        const overlay = document.getElementById("event-overlay");
        overlay.classList.remove("hidden");

        document.getElementById("next-dialogue-btn").onclick = () => {
            overlay.classList.add("hidden");

            // troca fundo de fase depois do NPC
            let fundosDisponiveis = bgList.filter(b => b !== currentBackground);
            if (fundosDisponiveis.length === 0) fundosDisponiveis = [...bgList];
            currentBackground = fundosDisponiveis[Math.floor(Math.random() * fundosDisponiveis.length)];
            document.body.style.backgroundImage = `url('${currentBackground}')`;

            document.getElementById("next-dialogue-btn").onclick = null;
            callback();
        };
    }

    // --- Função que mostra o cutscene final usando o texto de "ending" em gameState.story
    function showEndingCutscene() {
        // garante que o timer e input estejam desativados
        try { clearInterval(timerInterval); } catch(e) {}
        timerInterval = null;
        answerLocked = true;

        // esconde telas que possam estar visíveis
        if (victoryScreen) victoryScreen.classList.add('hidden');
        if (transitionScreen) transitionScreen.classList.add('hidden');
        if (gameOverScreen) gameOverScreen.classList.add('hidden');
        if (gameScreen) gameScreen.classList.add('hidden');

        // pega elementos do HTML
        const ending = document.getElementById("final-victory-screen");
        const textEl = document.getElementById("ending-text");

        // usa exatamente o "ending" da história selecionada em gameState.story
        const text = (gameState && gameState.story && gameState.story.ending)
            ? gameState.story.ending
            : "Parabéns, heróis! Vocês venceram todos os desafios.";

        // coloca o texto
        textEl.textContent = text;

        // reinicia a animação de rolagem do texto (mesma técnica usada para a intro)
        textEl.style.animation = 'none';
        void textEl.offsetWidth; // forçar reflow
        // calcula duração baseada no tamanho do texto (ms)
        const baseSpeed = 120; // ms por caractere
        const minDuration = 4000;  // 4s mínimo
        const maxDuration = 60000; // 60s máximo
        const duration = Math.min(Math.max(text.length * baseSpeed, minDuration), maxDuration);
        textEl.style.animation = `scrollText ${duration}ms linear forwards`;

        // mostra o overlay final
        ending.classList.remove('hidden');
        ending.classList.add('cutscene-active');

        // evita botão duplicado: remove antigo se existir
        const existingBtn = document.getElementById('final-restart-btn');
        if (existingBtn) existingBtn.remove();

        // cria botão para reiniciar o jogo
        const btn = document.createElement("button");
        btn.id = "final-restart-btn";
        btn.textContent = "Jogar Novamente";
        btn.onclick = () => window.location.reload();

        // adiciona o botão (se quiser outro local, mova esta linha)
        ending.appendChild(btn);
    }

    function levelWon() {
        clearInterval(timerInterval);
        timerInterval = null;

        // evita que a rotina de "level won" rode duas vezes em casos de reentradas
        if (gameState.handlingLevelWin) return;
        gameState.handlingLevelWin = true;

        // Salva o herói vencedor antes de trocar para o próximo jogador/nível
        gameState.lastWinner = gameState.players[gameState.currentPlayerIndex];

        // Conta que um inimigo foi derrotado (usado para liberar fada/mercador)
        gameState.enemiesDefeated = (gameState.enemiesDefeated || 0) + 1;

        
        const level = gameState.levels[gameState.currentLevelIndex];
        document.getElementById('victory-art').style.backgroundImage = `url('${level.avatar.pose_derrota}')`;
        document.getElementById('victory-message').textContent = `${level.villainName} FOI DERROTADO!`;
        victoryScreen.classList.remove('hidden');

        // já define o próximo jogador ativo
        let nextPlayerIndex = gameState.currentPlayerIndex;
        let attempts = 0;
        do {
            nextPlayerIndex = (nextPlayerIndex + 1) % gameState.players.length;
            attempts++;
        } while (gameState.players[nextPlayerIndex].hp <= 0 && attempts < gameState.players.length * 2);
        gameState.currentPlayerIndex = nextPlayerIndex;

        // avança para o próximo nível
        gameState.currentLevelIndex++;

        if (gameState.currentLevelIndex >= gameState.levels.length) {
            // todos os inimigos já foram derrotados → mostra final da história
            setTimeout(() => {
                victoryScreen.classList.add('hidden');
                showEndingCutscene();
            }, 3000);
        } else {
            // ainda há inimigos pela frente
            gameState.currentQuestionIndex++;
            if (gameState.currentQuestionIndex >= gameState.questions.length) {
                shuffleArray(gameState.questions);
                gameState.currentQuestionIndex = 0;
            }

            setTimeout(() => {
                victoryScreen.classList.add('hidden');

                // Conta vitórias desde o último evento
                gameState.victoriesSinceLastEvent++;

                if (document.getElementById('enable-story-mode').checked) {
                    // No modo história: sempre mostra cutscene intermediária
                    triggerRandomEvent(() => startLevel());
                } else if (
                    npcsUsados.size < 30 &&
                    gameState.victoriesSinceLastEvent >= (gameState.eventFrequency || 2)
                ) {
                    gameState.victoriesSinceLastEvent = 0; // zera o contador
                    triggerRandomEvent(() => startLevel());
                } else {
                    // simplesmente inicia o próximo nível
                    startLevel();
                }
            }, 5000);
        }
    }

    function gameOver() {

        clearInterval(timerInterval);
        timerInterval = null;

        const level = gameState.levels[gameState.currentLevelIndex];
        document.getElementById('game-over-art').style.backgroundImage = `url('${level.avatar.pose_vitoria}')`;
        document.getElementById('game-over-message').textContent = `${level.villainName} venceu desta vez.`;
        const defeatedArtContainer = document.getElementById('defeated-players-art-container');
        defeatedArtContainer.innerHTML = '';
        gameState.players.forEach(player => {
            const artDiv = document.createElement('div');
            artDiv.className = 'defeated-player-art';
            artDiv.style.backgroundImage = `url('${player.avatar.pose_derrota}')`;
            defeatedArtContainer.appendChild(artDiv);
        });
        gameOverScreen.classList.remove('hidden');
    }

    function updateArt() {
        const level = gameState.levels[gameState.currentLevelIndex];
        const player = gameState.players[gameState.currentPlayerIndex];
        document.getElementById('villain-art').style.backgroundImage = `url('${level.avatar.pose_padrao}')`;
        document.getElementById('player-art').style.backgroundImage = `url('${player.avatar.pose_padrao}')`;
    }

    function updateUI() {
        const level = gameState.levels[gameState.currentLevelIndex];
        const player = gameState.players[gameState.currentPlayerIndex];

        if (gameState.currentQuestionIndex >= gameState.questions.length) {
            shuffleArray(gameState.questions);
            gameState.currentQuestionIndex = 0;
        }

        document.getElementById('villain-name-display').textContent = level.villainName;
        document.getElementById('villain-hp-text').textContent = `HP: ${gameState.currentVillainHP} / ${level.maxVillainHP}`;
        const villainHpPercent = (gameState.currentVillainHP / level.maxVillainHP) * 100;
        document.getElementById('villain-hp-bar').style.width = `${villainHpPercent}%`;

        document.getElementById('turn-indicator').textContent = `É a vez de: ${player.name}`;
        document.getElementById('question-display').textContent = gameState.questions[gameState.currentQuestionIndex];

        if (gameState.hpMode === 'shared') {
            document.getElementById('player-hp-text').textContent = `HP do Time: ${gameState.sharedPlayerHP} / ${gameState.initialPlayerHP}`;
            const playerHpPercent = (gameState.sharedPlayerHP / gameState.initialPlayerHP) * 100;
            document.getElementById('player-hp-bar').style.width = `${playerHpPercent}%`;
        } else {
            document.getElementById('player-hp-text').textContent = `HP de ${player.name}: ${player.hp} / ${gameState.initialPlayerHP}`;
            const playerHpPercent = (player.hp / gameState.initialPlayerHP) * 100;
            document.getElementById('player-hp-bar').style.width = `${playerHpPercent}%`;
        }

        document.getElementById('timer-display').textContent = level.timePerQuestion;
        disableTeacherControls(false);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startTimer() {
        let timeLeft = gameState.levels[gameState.currentLevelIndex].timePerQuestion;
        const timerDisplay = document.getElementById('timer-display');
        timerDisplay.textContent = timeLeft;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "TEMPO ESGOTADO!";
                handleAnswer(false);
            }
        }, 1000);
    }

    function disableTeacherControls(disabled) {
        correctBtn.disabled = disabled;
        incorrectBtn.disabled = disabled;
    }

    function showTransition(message, duration, callback) {
        const msgElement = document.getElementById('transition-message');
        const timerElement = document.getElementById('transition-timer');
        msgElement.textContent = message;
        timerElement.textContent = duration;
        transitionScreen.classList.remove('hidden');

        // Atualiza barra de progresso
        const progressBar = document.getElementById('level-progress-bar');
        if (progressBar) {
            progressBar.innerHTML = '';
            for (let i = 0; i < gameState.levels.length; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i < gameState.currentLevelIndex) dot.classList.add('completed');
                else if (i === gameState.currentLevelIndex) dot.classList.add('active');
                progressBar.appendChild(dot);
            }
        }

        let countdown = duration;
        const countdownInterval = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                transitionScreen.classList.add('hidden');
                if (callback) callback();
            }
        }, 1000);
    }


    // --- Atualizar showTransition para mostrar o primeiro jogador antes da primeira pergunta:
    function showTransition(message, duration, callback) {
        const msgElement = document.getElementById('transition-message');
        const timerElement = document.getElementById('transition-timer');
        msgElement.textContent = message;
        timerElement.textContent = duration;
        transitionScreen.classList.remove('hidden');
        let countdown = duration;
        const countdownInterval = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                transitionScreen.classList.add('hidden');
                if (callback) callback();
            }
        }, 1000);
    }

        // === Adicionar efeitos visuais de HIT ===
    function triggerHitEffect(target) {
        const element = document.getElementById(target);
        if (!element) return;
        element.classList.add('hit-effect');
        setTimeout(() => element.classList.remove('hit-effect'), 500);
    }

    startGameBtn.addEventListener('click', initializeGame);
    addLevelBtn.addEventListener('click', addLevelConfig);
    removeLevelBtn.addEventListener('click', removeLastLevelConfig);
    addPlayerBtn.addEventListener('click', addPlayer);
    correctBtn.addEventListener('click', () => handleAnswer(true));
    incorrectBtn.addEventListener('click', () => handleAnswer(false));
    skipBtn.addEventListener('click', () => {
        if (answerLocked) return;
        clearInterval(timerInterval);
        disableTeacherControls(true);
        gameState.currentQuestionIndex++;
        updateUI();
        startTimer();
        disableTeacherControls(false);
    });

    addLevelConfig();
    addPlayerConfig();
});

