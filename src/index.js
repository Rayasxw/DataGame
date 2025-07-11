const { registerPlayer, getArena, sendMoves, delay } = require('./api/api');
const { decideActions } = require('./bot/decision/decide');

async function botLoop() {
  while (true) {
    const arena = await getArena();
    if (arena && arena.ants) {
      console.log(`Ход #${arena.turnNo} | Муравьёв: ${arena.ants.length} | Очки: ${arena.score}`);

      const moves = decideActions(arena);
      await sendMoves(moves);

      const outputPath = path.join(__dirname, '..', 'visualizer', 'arena.json');
      fs.writeFileSync(outputPath, JSON.stringify(arena, null, 2));
    }
    await delay(2500);
  }
}

(async () => {
  const registered = await registerPlayer();
  if (!registered) {
    console.log('Не удалось зарегистрироваться, выход');
    return;
  }
  await delay(2000);
  await botLoop();
})();
