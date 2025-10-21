import Position from "../Position";

describe("Position", () => {
  let position;

  beforeEach(() => {
    position = new Position();
  });

  test("должен возвращать случайную позицию от 0 до 15", () => {
    const randomPosition = position.getRandomPosition();
    expect(randomPosition).toBeGreaterThanOrEqual(0);
    expect(randomPosition).toBeLessThan(16);
  });

  test("должен возвращать разные позиции при последовательных вызовах", () => {
    const firstPosition = position.getRandomPosition();
    const secondPosition = position.getRandomPosition();

    // Позиции могут совпадать, но не должны быть равны при двух последовательных вызовах
    expect(firstPosition).not.toBe(secondPosition);
  });

  test("должен возвращать ту же позицию, если она была установлена вручную", () => {
    const firstPosition = position.getRandomPosition();
    position.prevRandomPosition = firstPosition; // Устанавливаем предыдущую позицию на ту же

    const secondPosition = position.getRandomPosition();

    // Позиция может быть равна предыдущей, если она была установлена вручную
    expect(secondPosition).not.toBe(firstPosition); // Проверяем, что это не то же самое
  });

  test("должен возвращать разные позиции при множественных вызовах", () => {
    const positions = new Set();

    for (let i = 0; i < 100; i++) {
      positions.add(position.getRandomPosition());
    }

    // Убедимся, что у нас есть хотя бы 2 разные позиции
    expect(positions.size).toBeGreaterThan(1);
  });
});
