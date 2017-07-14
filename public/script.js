
var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");

var sizeInput = document.getElementById("size");
var changeSize = document.getElementById("change-size");
var scoreLabel = document.getElementById("score");

var team = "Myself";
var score = 0;
var size = 4;
var width = canvas.width / size - 6;

var cells = [];
var images = [];
var fontSize;
var loss = false;

const database = firebase.database();
testStart();

changeSize.onclick = function () {
	if (sizeInput.value >= 2 && sizeInput.value <= 20) {
		size = sizeInput.value;
		width = canvas.width / size - 6;
		canvasClear();
		startGame();
	}
}

function canvasClear() {
	ctx.clearRect(0, 0, 500, 500);
}

function loadImage(src, x, y) {
	var myImage = new Image();
	myImage.src = src;
	var imWidth = width * 2 / 3;
	myImage.onload = function() {
		ctx.drawImage(myImage,
			x + width / 2 - imWidth / 2,
			y + width / 2 - imWidth / 2,
			imWidth,
			imWidth);
	}
}

function testStart() {
	loss = false;
	canvas.style.opacity = "1.0";
	createCells();	
	cells[0][0].value = 2;
	cells[1][0].value = 2;
	cells[2][0].value = 4;
	drawAllCells();
}

function startGame() {
	loss = false;
	canvas.style.opacity = "1.0";
	createCells();
	drawAllCells();
	pasteNewCell();
}

function cell(row, col) {
	this.value = 0;
	this.x = col * width + 5 * (col + 1);
	this.y = row * width + 5 * (row + 1);
}

function createCells() {
	for (var i = 0; i < size; i++) {
		cells[i] = [];
		for (var j = 0; j < size; j++) {
			cells[i][j] = new cell(i, j);
		}
	}
}

function drawCell(cell) {
	ctx.beginPath();
	ctx.rect(cell.x, cell.y, width, width);

	switch(cell.value) {
		case 0 : ctx.fillStyle = "#FF0000";	
			break;
		case 2 : ctx.fillStyle = "#FF0033";
			loadImage('./resources/Scroll_of_Wisdom.png',
			cell.x,
			cell.y);	
			break;
		case 4 : ctx.fillStyle = "#FF00A6";
			loadImage('./resources/Orb_of_Transmutation.png', cell.x, cell.y);
			break;
		case 8 : ctx.fillStyle = "#DE00FF";
			loadImage('./resources/Orb_of_Alteration.png', cell.x, cell.y);
			break;
		case 16 : ctx.fillStyle = "#6F00FF";
			loadImage('./resources/Orb_of_Chance.png', cell.x, cell.y);
			break;
		case 32 : ctx.fillStyle = "#003CFF";
			loadImage('./resources/Orb_of_Alchemy.png', cell.x, cell.y);
			break;
		case 64 : ctx.fillStyle = "#00EBFF";
			loadImage('./resources/Blessed_Orb.png', cell.x, cell.y);
			break;
		case 128 : ctx.fillStyle = "#00FF8D";
			loadImage('./resources/Orb_of_Regret.png', cell.x, cell.y);
			break;
		case 256 : ctx.fillStyle = "#00FF22";
			loadImage('./resources/Chaos_Orb.png', cell.x, cell.y);
			break;
		case 512 : ctx.fillStyle = "#7CFF00";
			loadImage('./resources/Gemcutter\'s_Prism.png', cell.x, cell.y);
			break;
		case 1024 : ctx.fillStyle = "#F7FF00";
			loadImage('./resources/Divine_Orb.png', cell.x, cell.y);
			break;
		case 2048 : ctx.fillStyle = "#FF7C00";
			loadImage('./resources/Exalted_Orb.png', cell.x, cell.y);
			break;
		case 4096 : ctx.fillStyle = "#FF2F00";
			loadImage('./resources/Mirror_of_Kalandra.png', cell.x, cell.y);
			break;
		default: ctx.fillStyle = "#FFFFFF";
	}
	ctx.fill();
}

function drawAllCells() {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			drawCell(cells[i][j]);	
		}
	}
}

function pasteNewCell() {
	while (true) {
		var row = Math.floor(Math.random() * size);
		var col = Math.floor(Math.random() * size);
		if (!cells[row][col].value) {
			var newValue = 2 * Math.ceil(Math.random() * 2);
			cells[row][col].value = newValue;
			drawAllCells();

			if (noValidMoves()) {
				finishGame();
			}
			return;
		}
	}
}

document.onkeydown = function(event) {
	if(!loss) {
		if (event.keyCode == 38 || event.keyCode == 87) moveUp();
		else if (event.keyCode == 39 || event.keyCode == 68) moveRight();
		else if (event.keyCode == 40 || event.keyCode == 83) moveDown();
		else if (event.keyCode == 37 || event.keyCode == 65) moveLeft();
		scoreLabel.innerHTML = "Score: " + score;
	}
}

function moveUp() {
	var move = false;
	for (var j = 0; j < size; j++) {
		var stop = 0;
		for (var i = 0; i < size; i++) {
			if (cells[i][j].value) {
				var row  = i;	
				while (row > stop) {
					if (!cells[row - 1][j].value) {
						move = true;
						cells[row - 1][j].value = cells[row][j].value;
						cells[row][j].value = 0;
						row--;
					}
					else if (cells[row - 1][j].value == cells[row][j].value) {
						stop = row;
						move = true;
						cells[row - 1][j].value *= 2;
						score += cells[row - 1][j].value;
						cells[row][j].value = 0;
						
						break;
					}
					else break;
				}
			}
		}
	}
	if (move) pasteNewCell();
}

function moveRight() {
	var move = false;
	for (var i = 0; i < size; i++) {
		var stop = size - 1;
		for (var j = size - 2; j >= 0; j--) {
			if (cells[i][j].value) {
				var col  = j;	
				while (col < stop) {
					if (!cells[i][col + 1].value) {
						move = true;
						cells[i][col + 1].value = cells[i][col].value;
						cells[i][col].value = 0;
						col++;
					}
					else if (cells[i][col + 1].value == cells[i][col].value) {
						stop = col;
						move = true;
						cells[i][col + 1].value *= 2;
						score += cells[i][col + 1].value;		
						cells[i][col].value = 0;
						break;
					}
					else break;
				}
			}
		}
	}
	if (move) pasteNewCell();	
}

function moveDown() {
	var move = false;
	for (var j =  0; j < size; j++) {
		var stop = size - 1;
		for (var i = size - 2; i >= 0; i--) {
			if (cells[i][j].value) {
				var row  = i;	
				while (row < stop) {
					if (!cells[row + 1][j].value) {
						move = true;
						cells[row + 1][j].value = cells[row][j].value;
						cells[row][j].value = 0;
						row++;
					}
					else if (cells[row + 1][j].value == cells[row][j].value) {
						stop = row;
						move = true;
						cells[row + 1][j].value *= 2;
						score += cells[row + 1][j].value;
						cells[row][j].value = 0;
						
						break;
					}
					else break;
				}
			}
		}
	}
	if (move) pasteNewCell();
}

function moveLeft() {
	var move = false;
	for (var i = 0; i < size; i++) {
		var stop = 0;
		for (var j = 1; j < size; j++) {
			if (cells[i][j].value) {
				var col  = j;	
				while (col > stop) {
					if (!cells[i][col - 1].value) {
						move = true;
						cells[i][col - 1].value = cells[i][col].value;
						cells[i][col].value = 0;
						col--;
					}
					else if (cells[i][col - 1].value == cells[i][col].value) {
						stop = col;
						move = true;
						cells[i][col - 1].value *= 2;
						score += cells[i][col - 1].value;
						cells[i][col].value = 0;
						
						break;
					}
					else break;
				}
			}
		}
	}
	if (move) pasteNewCell();
}

function noValidMoves() {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (!cells[i][j].value) {
				return false;
			} 
			else {
				var row = i;
				while (row++ < size - 1) {
					if (!cells[row][j].value) {
						continue;
					} 
					else if (cells[row][j].value == cells[i][j].value) {
						return false;
					}
					else break;
				}
				row = i;
				while (row-- > 0) {
					if (!cells[row][j].value) {
						continue;
					} 
					else if (cells[row][j].value == cells[i][j].value) {
						return false;
					}
					else break;
				}

				var col = j;
				while (col++ < size - 1) {
					if (!cells[i][col].value) {
						continue;
					} 
					else if (cells[i][col].value == cells[i][j].value) {
						return false;
					}
					else break;
				}
				col = j;
				while (col-- > 0) {
					if (!cells[i][col].value) {
						continue;
					} 
					else if (cells[i][col].value == cells[i][j].value) {
						return false;
					}
					else break;
				}
			}
		}
	}
	return true;
}

function finishGame() {
	writeObjectData(team, score);
	canvas.style.opacity = "0.5";
	loss = true;
	score = 0;
}

function writeObjectData(name, value) {
	database.ref('team/' + name).set({
		score: value,
		timestamp: Date.now()
	});
}