const fetch = require('node-fetch');

const API_URL = 'https://games-test.datsteam.dev/api';
const TOKEN = '27fa2e88-8672-431c-af5f-ee0d9701566e';
const HEADERS = {
  'Content-Type': 'application/json',
  'X-Auth-Token': TOKEN
};

// Пауза между ходами (мс)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// =======================
// Пример простой логики: просто логируем муравьёв
// =======================
async function botLoop() {
  while (true) {
    const arena = await getArena();
    if (arena && arena.ants) {
      console.log(`📦 Ход #${arena.turnNo} | Муравьёв: ${arena.ants.length} | Очки: ${arena.score}`);
    }
    await delay(2500); // Подождать перед следующим запросом
  }
}

// =======================
// Запуск
// =======================
(async () => {
  await registerPlayer();
  await delay(2000); // Подождать немного после регистрации
  await botLoop();   // Запустить основной цикл
})();
