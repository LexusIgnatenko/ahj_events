import GameController from "../GameController";

describe("GameController", () => {
  let gameController;
  let mockGamePlay;

  beforeEach(() => {
    mockGamePlay = {
      init: jest.fn(),
      startBtnListeners: [],
      gameBoardListeners: [],
      setInitialValues: jest.fn(),
      hideGameMessage: jest.fn(),
      showGoblin: jest.fn(),
      moveGoblin: jest.fn(),
      hideGoblin: jest.fn(),
      showGameMessage: jest.fn(),
      setSkipValue: jest.fn(),
      setHitsValue: jest.fn(),
    };

    gameController = new GameController(mockGamePlay);
  });

  test("должен инициализировать игру", () => {
    gameController.init();

    expect(mockGamePlay.init).toHaveBeenCalled();
    expect(mockGamePlay.setInitialValues).toHaveBeenCalledWith(
      gameController.skip.maxCount,
    );
    expect(gameController.isGameRunning).toBe(false);
  });

  test("должен начать игру при нажатии на кнопку старта", () => {
    gameController.init();
    gameController.onStartBtnClick();

    expect(gameController.isGameRunning).toBe(true);
    expect(mockGamePlay.setInitialValues).toHaveBeenCalledWith(
      gameController.skip.maxCount,
    );
    expect(mockGamePlay.hideGameMessage).toHaveBeenCalled();
  });

  test("должен игнорировать нажатия, если игра не запущена", () => {
    const target = document.createElement("div");
    target.dataset.goblin = "true"; // Используем data-атрибут

    gameController.onGameBoardClick(target);

    expect(gameController.hits).toBe(0);
  });

  test("должен увеличивать количество попаданий при нажатии на гоблина", () => {
    gameController.init();
    gameController.onStartBtnClick();

    const target = document.createElement("div");
    target.dataset.goblin = "true"; // Используем data-атрибут

    gameController.onGameBoardClick(target);

    expect(gameController.hits).toBe(1);
    expect(mockGamePlay.setHitsValue).toHaveBeenCalledWith(1);
  });

  test("должен игнорировать повторные нажатия на гоблина", () => {
    gameController.init();
    gameController.onStartBtnClick();

    const target = document.createElement("div");
    target.dataset.goblin = "true"; // Используем data-атрибут

    gameController.onGameBoardClick(target);
    gameController.onGameBoardClick(target); // повторное нажатие

    expect(gameController.hits).toBe(1);
  });

  test("должен завершать игру, когда исчерпаны попытки", async () => {
    jest.useFakeTimers();
    gameController.init();
    gameController.onStartBtnClick();

    jest.advanceTimersByTime(1000); // Пропускаем время для первого показа гоблина

    expect(mockGamePlay.showGoblin).toHaveBeenCalled();
    expect(mockGamePlay.moveGoblin).toHaveBeenCalled();

    // Уменьшаем количество попыток до 0
    gameController.skip.currentCount = 1;
    gameController.try.success = false;

    jest.advanceTimersByTime(1000); // Пропускаем время для следующего движения гоблина

    expect(mockGamePlay.hideGoblin).toHaveBeenCalled();
    expect(mockGamePlay.showGameMessage).toHaveBeenCalled();
    expect(gameController.isGameRunning).toBe(false);
  });

  test("должен игнорировать нажатия на гоблина после завершения игры", () => {
    gameController.init();
    gameController.onStartBtnClick();

    // Завершаем игру
    gameController.skip.currentCount = 0;
    gameController.try.success = false;

    const target = document.createElement("div");
    target.dataset.goblin = "true"; // Используем data-атрибут

    gameController.onGameBoardClick(target);

    expect(gameController.hits).toBe(1); // Количество попаданий не должно измениться
  });
});
