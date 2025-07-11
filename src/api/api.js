const fetch = require('node-fetch');

const API_URL = 'https://games-test.datsteam.dev/api';
const TOKEN = '27fa2e88-8672-431c-af5f-ee0d9701566e';
const HEADERS = {
  'Content-Type': 'application/json',
  'X-Auth-Token': TOKEN
};

// =======================
// Регистрация
// =======================
async function registerPlayer() {
  try {
    const res = await fetch(`${API_URL}/register`, { method: 'POST', headers: HEADERS });
    if (!res.ok) {
      const err = await res.json();
      console.log('⚠️ Возможно, уже зарегистрированы: Ошибка регистрации:', err.message || res.statusText);
      return;
    }
    const data = await res.json();
    console.log('✅ Зарегистрирован! Имя:', data.name, '| Раунд:', data.realm);
  } catch (error) {
    console.error('⚠️ Ошибка регистрации:', error.message || 'Нет ответа');
    return null;
  }
}

// =======================
// Получение состояния арены
// =======================
async function getArena() {
  try {
    const res = await fetch(`${API_URL}/arena`, { headers: HEADERS });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || res.statusText);
    }
    return await res.json();
  } catch (error) {
    console.error('❌ Ошибка: Ошибка арены:', error.message || 'Нет ответа');
    return null;
  }
}

// -------------------------
// Отправка движения
// -------------------------
async function sendMove(moves) {
  try {
    const res = await fetch(`${API_URL}/move`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ moves }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    console.log('📤 Ход отправлен');
    return data;
  } catch (err) {
    console.error('❌ Ошибка отправки хода:', err.message);
    return null;
  }
}

module.exports = {
  registerPlayer,
  getArena,
  sendMove,
};