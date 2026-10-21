const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const os = require('os');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  maxHttpBufferSize: 5e6
});

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Lista oficial apenas com os nomes reais enviados pelo usuário
function getOfficialRealDepartments() {
  return [
    {
      id: 1,
      number: 1,
      name: 'Mídia',
      category: 'Comunicação & Técnica',
      icon: 'video',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_1_1', name: 'Adson', photo: null, votes: 0 }]
    },
    {
      id: 2,
      number: 2,
      name: 'Sonoplastia',
      category: 'Comunicação & Técnica',
      icon: 'volume-2',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_2_1', name: 'Isaac', photo: null, votes: 0 }]
    },
    {
      id: 3,
      number: 3,
      name: 'Programação',
      category: 'Comunicação & Técnica',
      icon: 'calendar-check',
      closedManually: false,
      nullVotes: 0,
      candidates: [
        { id: 'c_3_1', name: 'Ivone', photo: null, votes: 0 },
        { id: 'c_3_2', name: 'Adson', photo: null, votes: 0 }
      ]
    },
    {
      id: 4,
      number: 4,
      name: 'Música',
      category: 'Louvor & Adoração',
      icon: 'music',
      closedManually: false,
      nullVotes: 0,
      candidates: []
    },
    {
      id: 5,
      number: 5,
      name: 'D. Infantil',
      category: 'Ministérios por Faixa Etária',
      icon: 'baby',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_5_1', name: 'Vera', photo: null, votes: 0 }]
    },
    {
      id: 6,
      number: 6,
      name: 'D. Adolescentes',
      category: 'Ministérios por Faixa Etária',
      icon: 'sparkles',
      closedManually: false,
      nullVotes: 0,
      candidates: []
    },
    {
      id: 7,
      number: 7,
      name: 'D. Jovens',
      category: 'Ministérios por Faixa Etária',
      icon: 'flame',
      closedManually: false,
      nullVotes: 0,
      candidates: []
    },
    {
      id: 8,
      number: 8,
      name: 'D. Masculino',
      category: 'Ministérios & Grupos',
      icon: 'shield',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_8_1', name: 'Paulo Portugal', photo: null, votes: 0 }]
    },
    {
      id: 9,
      number: 9,
      name: 'D. Feminino',
      category: 'Ministérios & Grupos',
      icon: 'heart',
      closedManually: false,
      nullVotes: 0,
      candidates: []
    },
    {
      id: 10,
      number: 10,
      name: 'D. Patrimônio',
      category: 'Gestão & Estrutura',
      icon: 'building-2',
      closedManually: false,
      nullVotes: 0,
      candidates: [
        { id: 'c_10_1', name: 'Erivaldo Canjirana', photo: null, votes: 0 },
        { id: 'c_10_2', name: 'Clerisval Café', photo: null, votes: 0 }
      ]
    },
    {
      id: 11,
      number: 11,
      name: 'Ação Social',
      category: 'Cuidado & Missão',
      icon: 'hand-heart',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_11_1', name: 'Dâmara', photo: null, votes: 0 }]
    },
    {
      id: 12,
      number: 12,
      name: 'Ornamentação',
      category: 'Gestão & Estrutura',
      icon: 'flower-2',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_12_1', name: 'Jerusa', photo: null, votes: 0 }]
    },
    {
      id: 13,
      number: 13,
      name: 'Cantina / Cozinha',
      category: 'Comunhão & Hospitalidade',
      icon: 'utensils',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_13_1', name: 'Zenaide', photo: null, votes: 0 }]
    },
    {
      id: 14,
      number: 14,
      name: 'C. Pós Culto',
      category: 'Comunhão & Hospitalidade',
      icon: 'coffee',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_14_1', name: 'Dadai', photo: null, votes: 0 }]
    },
    {
      id: 15,
      number: 15,
      name: 'D. Família',
      category: 'Ministérios & Grupos',
      icon: 'home',
      closedManually: false,
      nullVotes: 0,
      candidates: []
    },
    {
      id: 16,
      number: 16,
      name: 'Missões / Evangelismo',
      category: 'Cuidado & Missão',
      icon: 'globe',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_16_1', name: 'Jorlando', photo: null, votes: 0 }]
    },
    {
      id: 17,
      number: 17,
      name: 'D. Visitação / Conforto',
      category: 'Cuidado & Missão',
      icon: 'heart-handshake',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_17_1', name: 'Hulda', photo: null, votes: 0 }]
    },
    {
      id: 18,
      number: 18,
      name: 'Recepção',
      category: 'Comunhão & Hospitalidade',
      icon: 'door-open',
      closedManually: false,
      nullVotes: 0,
      candidates: [{ id: 'c_18_1', name: 'Ivone', photo: null, votes: 0 }]
    }
  ];
}

// Lista de teste com 2 candidatos em TODOS os 18 departamentos (completa com bots onde havia 0 ou 1 candidato)
function getInitialDepartments() {
  const depts = getOfficialRealDepartments();
  return depts.map((d) => {
    const candidates = [...d.candidates];
    if (candidates.length === 0) {
      candidates.push(
        { id: `c_${d.id}_bot1`, name: `Bot 1 (${d.name})`, photo: null, votes: 0 },
        { id: `c_${d.id}_bot2`, name: `Bot 2 (${d.name})`, photo: null, votes: 0 }
      );
    } else if (candidates.length === 1) {
      candidates.push({
        id: `c_${d.id}_bot2`,
        name: `Bot Concorrente (${d.name})`,
        photo: null,
        votes: 0
      });
    }
    return {
      ...d,
      candidates
    };
  });
}

// Garante que um array de departamentos tenha ao menos 2 candidatos (adicionando bots se faltar)
function ensureTwoCandidatesWithBots(departments) {
  return departments.map((d) => {
    const candidates = [...(d.candidates || [])];
    if (candidates.length === 0) {
      candidates.push(
        { id: `c_${d.id}_bot1`, name: `Bot 1 (${d.name})`, photo: null, votes: 0 },
        { id: `c_${d.id}_bot2`, name: `Bot 2 (${d.name})`, photo: null, votes: 0 }
      );
    } else if (candidates.length === 1) {
      candidates.push({
        id: `c_${d.id}_bot2`,
        name: `Bot Concorrente (${d.name})`,
        photo: null,
        votes: 0
      });
    }
    return {
      ...d,
      nullVotes: d.nullVotes || 0,
      candidates
    };
  });
}

// Estado da aplicação
let state = {
  churchName: 'Assembleia de Votação de Departamentos',
  votingActive: true,
  maxVoters: 0,
  mediaPin: '1234',
  registeredVoters: [],
  departments: getOfficialRealDepartments(),
  votesByVoter: {}
};

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.departments)) {
        state = {
          churchName: parsed.churchName || 'Assembleia de Votação de Departamentos',
          votingActive: typeof parsed.votingActive === 'boolean' ? parsed.votingActive : true,
          maxVoters: typeof parsed.maxVoters === 'number' ? parsed.maxVoters : 0,
          mediaPin: parsed.mediaPin ? String(parsed.mediaPin) : '1234',
          registeredVoters: Array.isArray(parsed.registeredVoters) ? parsed.registeredVoters : [],
          departments: parsed.departments.map((d, idx) => ({
            ...d,
            number: d.number || d.id || idx + 1,
            nullVotes: d.nullVotes || 0,
            candidates: (d.candidates || [])
              .filter(
                (c) =>
                  c &&
                  c.id !== 'NULO' &&
                  String(c.name || '').trim().toLowerCase() !== 'voto nulo'
              )
              .map((c) => ({
                ...c,
                photo: c.photo || null
              }))
          })),
          votesByVoter: parsed.votesByVoter || {}
        };
      }
    }
  } catch (err) {
    console.error('Erro ao carregar state.json, usando estado inicial:', err.message);
  }
  syncRegisteredVoters();
  recalculateVotes();
  saveState();
}

function syncRegisteredVoters() {
  if (!Array.isArray(state.registeredVoters)) {
    state.registeredVoters = [];
  }
  for (const vId of Object.keys(state.votesByVoter)) {
    if (Object.keys(state.votesByVoter[vId] || {}).length > 0) {
      if (!state.registeredVoters.includes(vId)) {
        state.registeredVoters.push(vId);
      }
    }
  }
}

function saveState() {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar state.json:', err.message);
  }
}

function recalculateVotes() {
  for (const dept of state.departments) {
    dept.nullVotes = 0;
    for (const cand of dept.candidates) {
      cand.votes = 0;
    }
  }

  for (const voterId of Object.keys(state.votesByVoter)) {
    const voterChoices = state.votesByVoter[voterId] || {};
    for (const deptIdStr of Object.keys(voterChoices)) {
      const deptId = Number(deptIdStr);
      const candidateId = voterChoices[deptIdStr];
      const dept = state.departments.find((d) => d.id === deptId);
      // Votos (inclusive nulos) só são contabilizados em departamentos com 2+ candidatos reais
      if (dept && dept.candidates.length >= 2) {
        if (candidateId === 'NULO') {
          dept.nullVotes += 1;
        } else {
          const cand = dept.candidates.find((c) => c.id === candidateId);
          if (cand) {
            cand.votes += 1;
          }
        }
      }
    }
  }
}

function getEnrichedDepartments() {
  recalculateVotes();
  return state.departments.map((dept, idx) => {
    // Regra estrita:
    // 0 candidatos -> 'empty' (Sem Candidato)
    // 1 candidato  -> 'elected_single' (Eleito automaticamente - voto nulo NUNCA conta como candidato)
    // 2+ candidatos -> 'voting' ou 'closed'
    let status = 'empty';
    if (dept.candidates.length === 0) {
      status = 'empty';
    } else if (dept.candidates.length === 1) {
      status = 'elected_single';
    } else {
      status = dept.closedManually ? 'closed' : 'voting';
    }

    const candidateVotes =
      dept.candidates.length >= 2
        ? dept.candidates.reduce((acc, c) => acc + c.votes, 0)
        : 0;
    const nullVotes = dept.candidates.length >= 2 ? dept.nullVotes || 0 : 0;
    const totalVotes = candidateVotes + nullVotes;

    return {
      ...dept,
      number: dept.number || dept.id || idx + 1,
      validVotes: candidateVotes,
      nullVotes,
      totalVotes,
      status
    };
  });
}

const activeVoters = new Map(); // socketId -> voterId
const activeMediaDevices = new Map(); // socketId -> { socketId, deviceName, voterId, votersServed }

function getVoterStatus(voterId) {
  if (!voterId) {
    return { isRegistered: false, voterNumber: null, limitReached: false };
  }
  const idx = state.registeredVoters.indexOf(voterId);
  const isRegistered = idx !== -1;
  const voterNumber = isRegistered ? idx + 1 : null;
  const limitReached =
    !isRegistered && state.maxVoters > 0 && state.registeredVoters.length >= state.maxVoters;

  return {
    isRegistered,
    voterNumber,
    limitReached,
    maxVoters: state.maxVoters,
    registeredCount: state.registeredVoters.length
  };
}

function getMediaDevicesList() {
  const list = [];
  for (const [sockId, info] of activeMediaDevices.entries()) {
    const vId = activeVoters.get(sockId) || info.voterId;
    const votesCastByCurrent = vId && state.votesByVoter[vId] ? Object.keys(state.votesByVoter[vId]).length : 0;
    list.push({
      socketId: sockId,
      deviceName: info.deviceName || 'Aparelho da Mídia',
      currentVoterId: vId,
      votesCastByCurrent,
      votersServed: info.votersServed || 0
    });
  }
  return list;
}

function getPublicPayload() {
  const departments = getEnrichedDepartments();
  const uniqueConnectedVoters = new Set(activeVoters.values()).size;
  const totalVotersWhoVoted = Object.keys(state.votesByVoter).filter(
    (vId) => Object.keys(state.votesByVoter[vId] || {}).length > 0
  ).length;
  const registeredCount = state.registeredVoters.length;
  const remainingSlots =
    state.maxVoters > 0 ? Math.max(0, state.maxVoters - registeredCount) : null;

  return {
    churchName: state.churchName,
    votingActive: state.votingActive,
    maxVoters: state.maxVoters,
    mediaPin: state.mediaPin || '1234',
    mediaDevices: getMediaDevicesList(),
    departments,
    stats: {
      votingActive: state.votingActive,
      connectedDevices: uniqueConnectedVoters,
      registeredCount,
      remainingSlots,
      maxVoters: state.maxVoters,
      totalVotersWhoVoted,
      totalVotesCast: departments.reduce((sum, d) => sum + d.totalVotes, 0),
      votingCount: departments.filter((d) => d.status === 'voting').length,
      electedSingleCount: departments.filter((d) => d.status === 'elected_single').length,
      closedCount: departments.filter((d) => d.status === 'closed').length,
      emptyCount: departments.filter((d) => d.status === 'empty').length
    }
  };
}

function broadcastState(eventMeta = null) {
  saveState();
  const publicPayload = getPublicPayload();
  io.emit('state:update', {
    ...publicPayload,
    eventMeta
  });

  for (const [sockId, vId] of activeVoters.entries()) {
    io.to(sockId).emit('voter:status', getVoterStatus(vId));
  }
}

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        candidates.push({ name, address: iface.address });
      }
    }
  }
  const preferred =
    candidates.find((c) => c.address.startsWith('192.168.')) ||
    candidates.find((c) => c.address.startsWith('10.')) ||
    candidates[0];
  return preferred ? preferred.address : 'localhost';
}

loadState();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/votar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'votar.html'));
});

app.get('/api/qrcode', async (req, res) => {
  try {
    const customUrl = req.query.url;
    const port = server.address()?.port || 3000;
    const localIp = getLocalIp();
    const hostHeader = req.headers['x-forwarded-host'] || req.headers.host || '';
    const protoHeader = (req.headers['x-forwarded-proto'] || req.protocol || 'http').split(',')[0].trim();
    const isLocalhost =
      !hostHeader ||
      hostHeader.startsWith('localhost') ||
      hostHeader.startsWith('127.0.0.1');

    const defaultVoteUrl = process.env.PUBLIC_URL
      ? `${process.env.PUBLIC_URL.replace(/\/$/, '')}/votar`
      : !isLocalhost
      ? `${protoHeader}://${hostHeader}/votar`
      : `http://${localIp}:${port}/votar`;

    const voteUrl = customUrl || defaultVoteUrl;
    const qrDataUrl = await QRCode.toDataURL(voteUrl, {
      width: 600,
      margin: 0,
      color: {
        dark: '#1C1917',
        light: '#FAF9F5'
      }
    });
    res.json({
      voteUrl,
      localIp,
      port,
      qrDataUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/state', (req, res) => {
  const voterId = req.query.voterId;
  const myVotes = voterId && state.votesByVoter[voterId] ? state.votesByVoter[voterId] : {};
  res.json({
    ...getPublicPayload(),
    myVotes,
    voterStatus: getVoterStatus(voterId)
  });
});

io.on('connection', (socket) => {
  const role = socket.handshake.query.role || 'viewer';
  const voterId = socket.handshake.query.voterId ? String(socket.handshake.query.voterId) : null;
  const isMediaDevice = socket.handshake.query.isMedia === 'true';
  const mediaDeviceName = socket.handshake.query.mediaDeviceName || '';

  if (role === 'voter' && voterId) {
    activeVoters.set(socket.id, voterId);
    if (isMediaDevice) {
      activeMediaDevices.set(socket.id, {
        socketId: socket.id,
        deviceName: mediaDeviceName || 'Aparelho da Mídia',
        voterId,
        votersServed: 0
      });
    }
    if (!state.registeredVoters.includes(voterId)) {
      if (state.maxVoters === 0 || state.registeredVoters.length < state.maxVoters) {
        state.registeredVoters.push(voterId);
      }
    }
    broadcastState();
  } else {
    socket.emit('state:update', getPublicPayload());
  }

  if (voterId) {
    socket.emit('voter:myVotes', state.votesByVoter[voterId] || {});
    socket.emit('voter:status', getVoterStatus(voterId));
  }

  socket.on('voter:checkin', ({ voterId: vId }, callback) => {
    const cleanId = String(vId || '');
    if (!cleanId) {
      if (callback) callback({ ok: false, error: 'Identificador inválido.' });
      return;
    }

    activeVoters.set(socket.id, cleanId);

    if (!state.registeredVoters.includes(cleanId)) {
      if (state.maxVoters > 0 && state.registeredVoters.length >= state.maxVoters) {
        if (callback) {
          callback({
            ok: false,
            error: `O limite de ${state.maxVoters} eleitores presentes na assembleia já foi atingido.`
          });
        }
        return;
      }
      state.registeredVoters.push(cleanId);
    }

    broadcastState();
    if (callback) callback({ ok: true, voterStatus: getVoterStatus(cleanId) });
  });

  // Autorizar aparelho como terminal da Equipe de Mídia mediante PIN
  socket.on('media:authorize', ({ pin, deviceName }, callback) => {
    const cleanPin = String(pin || '').trim();
    if (cleanPin !== String(state.mediaPin || '1234')) {
      if (callback) callback({ ok: false, error: 'PIN da Equipe de Mídia incorreto.' });
      return;
    }

    const currentVoterId = activeVoters.get(socket.id) || voterId;
    const existing = activeMediaDevices.get(socket.id);
    activeMediaDevices.set(socket.id, {
      socketId: socket.id,
      deviceName: (deviceName || (existing && existing.deviceName) || 'Aparelho da Mídia').trim(),
      voterId: currentVoterId,
      votersServed: existing ? existing.votersServed : 0
    });

    broadcastState();
    if (callback) callback({ ok: true, deviceName: activeMediaDevices.get(socket.id).deviceName });
  });

  // Equipe de Mídia: Resetar aparelho para o PRÓXIMO eleitor sem perder os votos anteriores
  socket.on('media:nextVoter', ({ pin, currentVoterId, deviceName }, callback) => {
    const cleanPin = String(pin || '').trim();
    if (cleanPin !== String(state.mediaPin || '1234')) {
      if (callback) callback({ ok: false, error: 'PIN da Equipe de Mídia incorreto.' });
      return;
    }

    const oldVoterId = String(currentVoterId || activeVoters.get(socket.id) || '');
    const oldVotesCount =
      oldVoterId && state.votesByVoter[oldVoterId]
        ? Object.keys(state.votesByVoter[oldVoterId]).length
        : 0;

    // Se o eleitor anterior NÃO deu nenhum voto, libera a vaga dele para não desperdiçar quórum.
    // Se ele votou, mantém o registro e todos os votos salvos permanentemente na contagem!
    if (oldVoterId && oldVotesCount === 0) {
      state.registeredVoters = state.registeredVoters.filter((id) => id !== oldVoterId);
      delete state.votesByVoter[oldVoterId];
    }

    // Verifica se há vaga no limite de presentes da assembleia para o novo eleitor
    if (state.maxVoters > 0 && state.registeredVoters.length >= state.maxVoters) {
      if (callback) {
        callback({
          ok: false,
          error: `O limite de ${state.maxVoters} presentes na assembleia já foi atingido! Aumente o limite no painel antes de liberar para mais um eleitor.`
        });
      }
      return;
    }

    const newVoterId =
      'v_midia_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now().toString(36);

    state.registeredVoters.push(newVoterId);
    activeVoters.set(socket.id, newVoterId);

    const mediaInfo = activeMediaDevices.get(socket.id) || {
      socketId: socket.id,
      deviceName: deviceName || 'Aparelho da Mídia',
      votersServed: 0
    };
    mediaInfo.voterId = newVoterId;
    if (oldVotesCount > 0) {
      mediaInfo.votersServed = (mediaInfo.votersServed || 0) + 1;
    }
    if (deviceName) {
      mediaInfo.deviceName = deviceName;
    }
    activeMediaDevices.set(socket.id, mediaInfo);

    broadcastState();
    socket.emit('voter:myVotes', {});
    socket.emit('voter:status', getVoterStatus(newVoterId));

    if (callback) {
      callback({
        ok: true,
        newVoterId,
        votersServed: mediaInfo.votersServed,
        voterStatus: getVoterStatus(newVoterId)
      });
    }
  });

  //Registrar voto do eleitor (suporta candidato ou 'NULO')
  socket.on('vote:cast', ({ voterId: vId, deptId, candidateId }, callback) => {
    const cleanId = String(vId || '');
    if (!cleanId || !deptId || !candidateId) {
      if (callback) callback({ ok: false, error: 'Dados incompletos para o voto.' });
      return;
    }

    if (!state.votingActive) {
      if (callback) callback({ ok: false, error: 'A votação está pausada no momento. Aguarde a liberação.' });
      return;
    }

    const isAlreadyRegistered = state.registeredVoters.includes(cleanId);
    if (!isAlreadyRegistered) {
      if (state.maxVoters > 0 && state.registeredVoters.length >= state.maxVoters) {
        if (callback) {
          callback({
            ok: false,
            error: `Limite atingido! Apenas os ${state.maxVoters} eleitores presentes contabilizados na assembleia podem votar.`
          });
        }
        return;
      }
      state.registeredVoters.push(cleanId);
    }

    const dept = state.departments.find((d) => d.id === Number(deptId));
    if (!dept) {
      if (callback) callback({ ok: false, error: 'Departamento não encontrado.' });
      return;
    }

    if (dept.candidates.length < 2) {
      if (callback) callback({ ok: false, error: 'Este departamento possui candidato único e já está eleito.' });
      return;
    }

    if (dept.closedManually) {
      if (callback) callback({ ok: false, error: 'A votação para este departamento já foi encerrada.' });
      return;
    }

    if (candidateId !== 'NULO') {
      const cand = dept.candidates.find((c) => c.id === candidateId);
      if (!cand) {
        if (callback) callback({ ok: false, error: 'Candidato não encontrado.' });
        return;
      }
    }

    if (!state.votesByVoter[cleanId]) {
      state.votesByVoter[cleanId] = {};
    }

    state.votesByVoter[cleanId][dept.id] = candidateId;

    broadcastState({
      type: 'vote_cast',
      deptId: dept.id,
      deptName: dept.name
    });

    socket.emit('voter:myVotes', state.votesByVoter[cleanId]);
    socket.emit('voter:status', getVoterStatus(cleanId));
    if (callback) callback({ ok: true, myVotes: state.votesByVoter[cleanId] });
  });

  socket.on('admin:setVotingActive', ({ active }, callback) => {
    state.votingActive = Boolean(active);
    broadcastState({
      type: 'voting_active_changed',
      votingActive: state.votingActive
    });
    if (callback) callback({ ok: true, votingActive: state.votingActive });
  });

  socket.on('admin:setMaxVoters', ({ maxVoters }, callback) => {
    const parsed = Math.max(0, parseInt(maxVoters, 10) || 0);
    state.maxVoters = parsed;

    if (parsed > 0 && state.registeredVoters.length > parsed) {
      const withVotes = state.registeredVoters.filter(
        (vId) => Object.keys(state.votesByVoter[vId] || {}).length > 0
      );
      const withoutVotes = state.registeredVoters.filter(
        (vId) => Object.keys(state.votesByVoter[vId] || {}).length === 0
      );
      state.registeredVoters = [...withVotes, ...withoutVotes].slice(0, Math.max(parsed, withVotes.length));
    }

    if (parsed === 0 || state.registeredVoters.length < parsed) {
      for (const [, vId] of activeVoters.entries()) {
        if (!state.registeredVoters.includes(vId)) {
          if (parsed === 0 || state.registeredVoters.length < parsed) {
            state.registeredVoters.push(vId);
          }
        }
      }
    }

    broadcastState({
      type: 'max_voters_updated',
      maxVoters: state.maxVoters
    });

    if (callback) callback({ ok: true, maxVoters: state.maxVoters });
  });

  socket.on('admin:releaseIdleSlots', (_, callback) => {
    const beforeCount = state.registeredVoters.length;
    state.registeredVoters = state.registeredVoters.filter(
      (vId) => Object.keys(state.votesByVoter[vId] || {}).length > 0
    );
    const released = beforeCount - state.registeredVoters.length;

    broadcastState({
      type: 'idle_slots_released',
      released
    });

    if (callback) callback({ ok: true, released });
  });

  socket.on('admin:addCandidate', ({ deptId, candidateName, photo }, callback) => {
    const cleanName = (candidateName || '').trim();
    if (!cleanName) {
      if (callback) callback({ ok: false, error: 'Informe o nome do candidato.' });
      return;
    }

    if (['voto nulo', 'nulo', 'votos nulos'].includes(cleanName.toLowerCase())) {
      if (callback) {
        callback({
          ok: false,
          error: 'O Voto Nulo já é uma opção automática e não deve ser cadastrado como candidato.'
        });
      }
      return;
    }

    const dept = state.departments.find((d) => d.id === Number(deptId));
    if (!dept) {
      if (callback) callback({ ok: false, error: 'Departamento não encontrado.' });
      return;
    }

    const alreadyExists = dept.candidates.some(
      (c) => c.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (alreadyExists) {
      if (callback) callback({ ok: false, error: 'Este candidato já está cadastrado neste departamento.' });
      return;
    }

    const previousCount = dept.candidates.length;
    const newCandidate = {
      id: `c_${dept.id}_${Date.now()}`,
      name: cleanName,
      photo: photo || null,
      votes: 0
    };

    dept.candidates.push(newCandidate);
    if (dept.candidates.length >= 2) {
      dept.closedManually = false;
    }

    const becameContested = previousCount <= 1 && dept.candidates.length >= 2;

    broadcastState({
      type: 'candidate_added',
      deptId: dept.id,
      deptName: dept.name,
      candidateName: cleanName,
      becameContested
    });

    if (callback) callback({ ok: true, becameContested });
  });

  socket.on('admin:editCandidate', ({ deptId, candidateId, candidateName, photo }, callback) => {
    const cleanName = (candidateName || '').trim();
    if (!cleanName) {
      if (callback) callback({ ok: false, error: 'O nome do candidato não pode ficar vazio.' });
      return;
    }

    const dept = state.departments.find((d) => d.id === Number(deptId));
    if (!dept) {
      if (callback) callback({ ok: false, error: 'Departamento não encontrado.' });
      return;
    }

    const cand = dept.candidates.find((c) => c.id === candidateId);
    if (!cand) {
      if (callback) callback({ ok: false, error: 'Candidato não encontrado.' });
      return;
    }

    const duplicate = dept.candidates.some(
      (c) => c.id !== candidateId && c.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      if (callback) callback({ ok: false, error: 'Já existe outro candidato com esse nome neste departamento.' });
      return;
    }

    cand.name = cleanName;
    if (photo !== undefined) {
      cand.photo = photo;
    }

    broadcastState({
      type: 'candidate_edited',
      deptId: dept.id,
      deptName: dept.name,
      candidateName: cleanName
    });

    if (callback) callback({ ok: true });
  });

  socket.on('admin:removeCandidate', ({ deptId, candidateId }, callback) => {
    const dept = state.departments.find((d) => d.id === Number(deptId));
    if (!dept) {
      if (callback) callback({ ok: false, error: 'Departamento não encontrado.' });
      return;
    }

    dept.candidates = dept.candidates.filter((c) => c.id !== candidateId);

    for (const vId of Object.keys(state.votesByVoter)) {
      if (
        state.votesByVoter[vId][dept.id] === candidateId ||
        dept.candidates.length <= 1
      ) {
        delete state.votesByVoter[vId][dept.id];
      }
    }

    if (dept.candidates.length <= 1) {
      dept.closedManually = false;
    }

    broadcastState({
      type: 'candidate_removed',
      deptId: dept.id,
      deptName: dept.name
    });

    for (const [sockId, vId] of activeVoters.entries()) {
      io.to(sockId).emit('voter:myVotes', state.votesByVoter[vId] || {});
    }

    if (callback) callback({ ok: true });
  });

  socket.on('admin:toggleDeptStatus', ({ deptId }, callback) => {
    const dept = state.departments.find((d) => d.id === Number(deptId));
    if (!dept || dept.candidates.length < 2) {
      if (callback) callback({ ok: false, error: 'Apenas departamentos com 2 ou mais candidatos podem ter votação aberta/encerrada.' });
      return;
    }

    dept.closedManually = !dept.closedManually;

    broadcastState({
      type: 'status_toggled',
      deptId: dept.id,
      deptName: dept.name,
      closed: dept.closedManually
    });

    if (callback) callback({ ok: true, closed: dept.closedManually });
  });

  // Admin: Alterar o PIN da Equipe de Mídia
  socket.on('admin:setMediaPin', ({ newPin }, callback) => {
    const clean = String(newPin || '').trim();
    if (!clean || clean.length < 3) {
      if (callback) callback({ ok: false, error: 'Informe um PIN com pelo menos 3 caracteres.' });
      return;
    }
    state.mediaPin = clean;
    broadcastState({ type: 'media_pin_updated' });
    if (callback) callback({ ok: true, mediaPin: state.mediaPin });
  });

  // Admin: Resetar remotamente um aparelho da Equipe de Mídia pelo Painel para o próximo eleitor
  socket.on('admin:resetMediaDevice', ({ targetSocketId }, callback) => {
    const mediaInfo = activeMediaDevices.get(targetSocketId);
    if (!mediaInfo) {
      if (callback) callback({ ok: false, error: 'Aparelho não encontrado ou desconectado.' });
      return;
    }

    const oldVoterId = activeVoters.get(targetSocketId) || mediaInfo.voterId;
    const oldVotesCount =
      oldVoterId && state.votesByVoter[oldVoterId]
        ? Object.keys(state.votesByVoter[oldVoterId]).length
        : 0;

    if (oldVoterId && oldVotesCount === 0) {
      state.registeredVoters = state.registeredVoters.filter((id) => id !== oldVoterId);
      delete state.votesByVoter[oldVoterId];
    }

    if (state.maxVoters > 0 && state.registeredVoters.length >= state.maxVoters) {
      if (callback) {
        callback({
          ok: false,
          error: `O limite de ${state.maxVoters} presentes na assembleia já foi atingido!`
        });
      }
      return;
    }

    const newVoterId =
      'v_midia_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now().toString(36);

    state.registeredVoters.push(newVoterId);
    activeVoters.set(targetSocketId, newVoterId);

    mediaInfo.voterId = newVoterId;
    if (oldVotesCount > 0) {
      mediaInfo.votersServed = (mediaInfo.votersServed || 0) + 1;
    }
    activeMediaDevices.set(targetSocketId, mediaInfo);

    io.to(targetSocketId).emit('media:remoteReset', {
      newVoterId,
      votersServed: mediaInfo.votersServed,
      voterStatus: getVoterStatus(newVoterId)
    });

    broadcastState();
    if (callback) callback({ ok: true, deviceName: mediaInfo.deviceName });
  });

  socket.on('admin:clearVotes', (_, callback) => {
    state.votesByVoter = {};
    state.registeredVoters = [];
    for (const dept of state.departments) {
      dept.closedManually = false;
      dept.nullVotes = 0;
      for (const c of dept.candidates) {
        c.votes = 0;
      }
    }

    for (const [, vId] of activeVoters.entries()) {
      if (!state.registeredVoters.includes(vId)) {
        if (state.maxVoters === 0 || state.registeredVoters.length < state.maxVoters) {
          state.registeredVoters.push(vId);
        }
      }
    }

    broadcastState({ type: 'votes_cleared' });
    io.emit('voter:myVotes', {});
    if (callback) callback({ ok: true });
  });

  // Admin: Carregar modo de teste com 2 candidatos (bots) em todos os 18 departamentos
  socket.on('admin:resetFactory', (_, callback) => {
    state.departments = getInitialDepartments();
    state.votesByVoter = {};
    state.registeredVoters = [];

    for (const [, vId] of activeVoters.entries()) {
      if (!state.registeredVoters.includes(vId)) {
        if (state.maxVoters === 0 || state.registeredVoters.length < state.maxVoters) {
          state.registeredVoters.push(vId);
        }
      }
    }

    broadcastState({ type: 'factory_reset' });
    io.emit('voter:myVotes', {});
    if (callback) callback({ ok: true });
  });

  // Admin: Restaurar apenas os nomes reais da lista oficial (sem os bots)
  socket.on('admin:restoreRealList', (_, callback) => {
    state.departments = getOfficialRealDepartments();
    state.votesByVoter = {};
    state.registeredVoters = [];

    for (const [, vId] of activeVoters.entries()) {
      if (!state.registeredVoters.includes(vId)) {
        if (state.maxVoters === 0 || state.registeredVoters.length < state.maxVoters) {
          state.registeredVoters.push(vId);
        }
      }
    }

    broadcastState({ type: 'official_list_restored' });
    io.emit('voter:myVotes', {});
    if (callback) callback({ ok: true });
  });

  socket.on('disconnect', () => {
    let changed = false;
    if (activeVoters.has(socket.id)) {
      activeVoters.delete(socket.id);
      changed = true;
    }
    if (activeMediaDevices.has(socket.id)) {
      activeMediaDevices.delete(socket.id);
      changed = true;
    }
    if (changed) {
      broadcastState();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log(`====================================================`);
  console.log(`⛪ Sistema de Votação da Igreja rodando com sucesso!`);
  console.log(`🖥️  Telão / Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`📱 Link de Votação (Rede Local): http://${ip}:${PORT}/votar`);
  console.log(`====================================================`);
});
