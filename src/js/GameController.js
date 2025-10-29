import Position from './Position';

export default class GameController {
  constructor(gamePlay) {
    this.gamePlay = gamePlay;
    this.isGameRunning = false;
    this.goblinDelay = 1000; // Время между движениями гоблина
    this.position = new Position();
    this.try = { success: false }; // Флаг успеха атаки
    this.hits = 0;
    this.skip = { maxCount: 5, currentCount: undefined };
  }

  init() {
    this.gamePlay.init();
    this.gamePlay.startBtnListeners.push(this.onStartBtnClick.bind(this));
    this.gamePlay.gameBoardListeners.push(this.onGameBoardClick.bind(this));
    this.gamePlay.setInitialValues(this.skip.maxCount);
  }

  onStartBtnClick() {
    if (this.isGameRunning) return;
    this.isGameRunning = true;
    this.gamePlay.setInitialValues(this.skip.maxCount);
    this.hits = 0;
    this.skip.currentCount = this.skip.maxCount;
    this.gamePlay.hideGameMessage();

    // Показываем гоблина спустя небольшую паузу
    setTimeout(() => {
      this.gamePlay.showGoblin();
      this.gamePlay.moveGoblin(this.position.getRandomPosition());

      // Главный игровой цикл с использованием таймера
      const intervalID = setInterval(() => {
        if (!this.try.success && this.skip.currentCount > 0) {
          this.skip.currentCount--;
          this.gamePlay.setSkipValue(this.skip.currentCount);

          // Меняем позицию гоблина, если он не был убит
          this.gamePlay.moveGoblin(this.position.getRandomPosition());
        }

        // Завершаем игру, если закончились попытки
        if (this.skip.currentCount <= 0) {
          clearInterval(intervalID);
          this.gamePlay.hideGoblin();
          this.gamePlay.showGameMessage();
          this.isGameRunning = false;
        }

        this.try.success = false; // Всегда сбрасываем флаг успеха
      }, this.goblinDelay);
    }, this.goblinDelay);
  }

  onGameBoardClick(target) {
    if (!this.isGameRunning || this.isProcessingClick) return; // Блокируем последующие клики
    const isGoblinClicked = target.dataset.goblin === 'true';
    if (!isGoblinClicked) return;

    // Начинаем обрабатывать успешный клик
    this.isProcessingClick = true;
    this.try.success = true;
    this.hits++;
    this.gamePlay.setHitsValue(this.hits);

    // Перемещаем гоблина
    this.gamePlay.moveGoblin(this.position.getRandomPosition());

    // Через короткое время разрешаем новые клики
    setTimeout(() => {
      this.isProcessingClick = false;
    }, 100); // Пауза для надёжности
  }

}