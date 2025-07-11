const fetch = require('node-fetch');

const API_URL = 'https://games-test.datsteam.dev/api';
const TOKEN = '27fa2e88-8672-431c-af5f-ee0d9701566e';
const HEADERS = {
  'Content-Type': 'application/json',
  'X-Auth-Token': TOKEN
};


// Пауза между ходами (мс)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const USE_MOCK = true;



async function registerPlayer() {
  if (USE_MOCK) {
    console.log('[MOCK] Зарегистрировались (заглушка)');
    return { name: 'MockPlayer', realm: 'antprotocol-test' };
  }

  try {
    const res = await fetch(`${API_URL}/register`, { method: 'POST', headers: HEADERS });
    if (!res.ok) {
      const err = await res.json();
      console.log('Возможно, уже зарегистрированы: Ошибка регистрации:', err.message || res.statusText);
      return null;
    }
    const data = await res.json();
    console.log('Зарегистрирован! Имя:', data.name, '| Раунд:', data.realm);
    return data;
  } catch (error) {

    console.error('⚠️ Ошибка регистрации:', error.message || 'Нет ответа');

    return null;
  }
}


async function getArena() {
  if (USE_MOCK) {
    await delay(500); // имитация задержки
    // Пример фиктивных данных, чтобы тестировать логику
     return {
    turnNo: 1,
    score: 15,
    ants: [
      { id: 'ant1', q: 5, r: 5, type: 0 }, // рабочий рядом с едой
      { id: 'ant2', q: 2, r: 2, type: 0 }, // рабочий далеко
      { id: 'ant3', q: 4, r: 4, type: 1 }  // воин, не собирает еду
    ],
    food: [
      { q: 6, r: 5 },
      { q: 1, r: 1 }
    ],
    map: [
      // Проходимые тайлы
      { q: 5, r: 5, type: 1, cost: 1 },
      { q: 6, r: 5, type: 1, cost: 1 },
      { q: 2, r: 2, type: 1, cost: 1 },
      { q: 3, r: 2, type: 1, cost: 1 },
      { q: 4, r: 2, type: 1, cost: 1 },
      { q: 1, r: 1, type: 1, cost: 1 },
      { q: 4, r: 4, type: 1, cost: 1 },
      { q: 5, r: 4, type: 5 }, // стена
      { q: 6, r: 4, type: 1, cost: 1 }
    ]
  };
  }

  try {
    const res = await fetch(`${API_URL}/arena`, { headers: HEADERS });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || res.statusText);
    }
    return await res.json();
  } catch (error) {
    console.error(' Ошибка: Ошибка арены:', error.message || 'Нет ответа');
    return null;
  }
}


async function sendMoves(moves) {
  if (USE_MOCK) {
    console.log('[MOCK] Отправка ходов:', JSON.stringify(moves, null, 2));
    return { success: true };
  }

  try {
    const res = await fetch(`${API_URL}/move`, {
      method: 'POST',
      headers: HEADERS,

     body: JSON.stringify({ moves })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || res.statusText);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(' Ошибка: Ошибка отправки ходов:', error.message || 'Нет ответа');

    return null;
  }
}

module.exports = {
  registerPlayer,
  getArena,
  sendMoves,
  delay
};

