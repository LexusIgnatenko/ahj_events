/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	}();
/******/ 	
/************************************************************************/

;// ./src/img/goblin.png
/* harmony default export */ var goblin = (__webpack_require__.p + "img/goblin.png");
;// ./src/img/icons8-thor-hammer-64.png
/* harmony default export */ var icons8_thor_hammer_64 = (__webpack_require__.p + "img/icons8-thor-hammer-64.png");
;// ./src/js/GamePlay.js


class GamePlay {
  constructor() {
    this.gameEls = {
      hits: null,
      skip: null,
      gameBoard: null,
      startBtn: null,
      gameMessage: null,
      goblin: null,
    };
    this.startBtnListeners = [];
    this.gameBoardListeners = [];
    this.boardSize = 4;
    this.cells = [];
  }

  init() {
    this.gameEls.startBtn = document.querySelector(".start");
    this.gameEls.startBtn.addEventListener(
      "click",
      this.onStartBtnClick.bind(this),
    );

    this.gameEls.hits = document.querySelector(".hits");
    this.gameEls.skip = document.querySelector(".skip");

    this.gameEls.gameBoard = document.querySelector(".game-board");
    this.gameEls.gameBoard.addEventListener(
      "click",
      this.onGameBoardClick.bind(this),
    );

    this.gameEls.gameMessage = document.querySelector(".game-message");
    this.createGoblin();
    this.drawBoard();
  }

  onStartBtnClick() {
    this.startBtnListeners.forEach((callback) => callback());
  }

  onGameBoardClick(event) {
    this.gameBoardListeners.forEach((callback) => callback(event.target));
  }

  setInitialValues(skipCount) {
    this.gameEls.hits.textContent = "0";
    this.gameEls.skip.textContent = `${skipCount}`;
  }

  setHitsValue(value) {
    this.gameEls.hits.textContent = `${value}`;
  }

  setSkipValue(value) {
    this.gameEls.skip.textContent = `${value}`;
  }

  showGameMessage() {
    this.gameEls.gameMessage.classList.remove("hidden");
  }

  hideGameMessage() {
    this.gameEls.gameMessage.classList.add("hidden");
  }

  drawBoard() {
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      this.cells.push(cell);
    }
    this.gameEls.gameBoard.append(...this.cells);
  }

  createGoblin() {
    this.gameEls.goblin = document.createElement("img");
    this.gameEls.goblin.classList.add("goblin");
    this.gameEls.goblin.src = goblin;
    this.gameEls.goblin.dataset.goblin = "true";
  }

  showGoblin() {
    this.gameEls.goblin.classList.remove("hidden");
  }

  hideGoblin() {
    this.gameEls.goblin.classList.add("hidden");
  }

  moveGoblin(position) {
    this.cells[position].append(this.gameEls.goblin);
  }
}

;// ./src/js/Position.js
class Position {
  constructor() {
    this.prevRandomPosition = 0;
  }

  getRandomPosition() {
    let randomPosition;
    do randomPosition = Math.floor(Math.random() * 16);
    while (this.prevRandomPosition === randomPosition);
    this.prevRandomPosition = randomPosition;
    return randomPosition;
  }
}

;// ./src/js/GameController.js


class GameController {
  constructor(gamePlay) {
    this.gamePlay = gamePlay;
    this.isGameRunning = false;
    this.goblinDelay = 1000;
    this.position = new Position();
    this.try = { success: false };
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

    setTimeout(() => {
      this.gamePlay.showGoblin();
      this.gamePlay.moveGoblin(this.position.getRandomPosition());
      const intervalID = setInterval(() => {
        if (!this.try.success) {
          this.skip.currentCount -= 1;
          this.gamePlay.setSkipValue(this.skip.currentCount);
          if (this.skip.currentCount === 0) {
            clearInterval(intervalID);
            this.gamePlay.hideGoblin();
            this.gamePlay.showGameMessage();
            this.isGameRunning = false;
          }
        }
        this.try.success = false;
        this.gamePlay.moveGoblin(this.position.getRandomPosition());
      }, this.goblinDelay);
    }, this.goblinDelay);
  }

  onGameBoardClick(target) {
    if (!this.isGameRunning) return;
    const isGoblinClicked = target.dataset.goblin === "true";
    if (this.try.success || !isGoblinClicked) return;

    this.try.success = true;
    this.hits += 1;
    this.gamePlay.setHitsValue(this.hits);
  }
}

;// ./src/js/app.js



const gamePlay = new GamePlay();
const gameCtrl = new GameController(gamePlay);

gameCtrl.init();

;// ./src/index.js




/******/ })()
;