const fetch = require("node-fetch");

const API_URL = "https://games-test.datsteam.dev/api";
const TOKEN = "27fa2e88-8672-431c-af5f-ee0d9701566e";
const HEADERS = {
  "Content-Type": "application/json",
  "X-Auth-Token": TOKEN,
};


// Пауза между ходами (мс)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const USE_MOCK = true;



async function registerPlayer() {
  if (USE_MOCK) {
    console.log('[MOCK] Зарегистрировались (заглушка)');
    return { name: 'MockPlayer', realm: 'antprotocol-test' };
  }

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: HEADERS,
    });
    if (!res.ok) {
      const err = await res.json();

      console.log(
        "⚠️ Возможно, уже зарегистрированы: Ошибка регистрации:",
        err.message || res.statusText
      );
      return;
    }
    const data = await res.json();
    console.log("✅ Зарегистрирован! Имя:", data.name, "| Раунд:", data.realm);
  } catch (error) {
    console.error("⚠️ Ошибка регистрации:", error.message || "Нет ответа");

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
    console.error("❌ Ошибка: Ошибка арены:", error.message || "Нет ответа");
    return null;
  }
}

// =======================
// Отправка хода
// =======================
async function sendMove(moves) {
  try {
    const res = await fetch(`${API_URL}/move`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ moves }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error("❌ Ошибка отправки хода:", err.message || res.statusText);
      return false;
    }
    console.log("✅ Ход отправлен:", moves);
    return true;
  } catch (error) {
    console.error(
      "❌ Ошибка: Ошибка отправки хода:",
      error.message || "Нет ответа"
    );
    return false;
  }
}

// =======================
// Пример простой логики: просто логируем муравьёв
// =======================
async function botLoop() {
  while (true) {
    const arena = await getArena();
    if (arena && arena.ants) {
      console.log(
        `📦 Ход #${arena.turnNo} | Муравьёв: ${arena.ants.length} | Очки: ${arena.score}`
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(' Ошибка: Ошибка отправки ходов:', error.message || 'Нет ответа');

    return null;
  }
}

// =======================
// Запуск
// =======================
(async () => {
  await registerPlayer();
  await delay(2000); // Подождать немного после регистрации
  await botLoop(); // Запустить основной цикл
})();