// Sudoku tábla mérete
const SIZE = 9;

// Üres sudoku tábla
const completed_sudoku_no1 = [
    [' ', ' ', '8', ' ', '5', '2', '3', ' ', ' '],
    [' ', '3', ' ', '9', ' ', '8', ' ', ' ', '6'],
    [' ', '2', ' ', '6', ' ', ' ', '9', ' ', '4'],
    ['8', ' ', ' ', ' ', '7', '9', '4', '5', '1'],
    [' ', ' ', ' ', '5', ' ', ' ', ' ', ' ', '8'],
    [' ', '5', '9', '2', ' ', '8', ' ', ' ', ' '],
    [' ', ' ', ' ', '5', '1', ' ', ' ', '7', '6'],
    [' ', ' ', '2', '4', ' ', '8', '1', ' ', '5']
];

// Sudoku tábla megoldása
const completed_sudoku_no1_solve = [
    '1', '7', '8', '4', '5', '2', '3', '6', '9',
    '6', '3', '2', '9', '4', '8', '5', '1', '6',
    '5', '2', '4', '6', '3', '7', '9', '8', '4',
    '8', '6', '3', '1', '7', '9', '4', '5', '1',
    '7', '9', '1', '5', '6', '4', '2', '3', '8',
    '4', '5', '9', '2', '1', '8', '6', '9', '3',
    '3', '8', '7', '5', '1', '3', '8', '7', '6',
    '9', '3', '2', '4', '3', '8', '1', '7', '5'
];

// Üres sudoku tábla létrehozása és inicializálása az előre megadott értékekkel
function createSudokuTable() {
    const table = document.getElementById('sudoku-table');

    for (let i = 0; i < SIZE; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < SIZE; j++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            const value = completed_sudoku_no1[i][j];
            input.value = value === ' ' ? '' : value;
            input.disabled = value !== ' '; // Az üres mezők engedélyezettek, a kitöltött mezők letiltva vannak
            input.dataset.solution = completed_sudoku_no1_solve[i * SIZE + j]; // Megoldás érték hozzáadása adatként
            input.addEventListener('input', (event) => updateGrid(event));
            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    // Ellenőrzés gomb hozzáadása
    const checkButton = document.createElement('button');
    checkButton.textContent = 'Ellenőrzés';
    checkButton.addEventListener('click', checkSudoku);
    table.insertAdjacentElement('afterend', checkButton);
}

// Input mező frissítése a grid-ben
function updateGrid(event) {
    const input = event.target;
    const value = input.value;
    const solution = input.dataset.solution;

    if (/^[1-9]$/.test(value)) {
        if (value === solution) {
            input.style.color = 'green'; // A helyes szöveg zöld
        } else {
            input.style.color = 'red'; // A helytelen szöveg piros
        }
    } else if (value === '') {
        input.style.color = 'black'; // Ha az érték üres, a szöveg színe legyen fekete
    } else {
        input.style.color = 'black'; // Ha az érték nem megfelelő, a szöveg színe legyen fekete
        input.value = ''; // Ha nem megfelelő karaktert adott meg a felhasználó, töröljük az értéket
    }
}

// Sudoku tábla ellenőrzése
function checkSudoku() {
    const inputs = document.querySelectorAll('#sudoku-table input');
    let isSolved = true;

    // Ellenőrzés soronként
    for (let i = 0; i < SIZE; i++) {
        const rowInputs = Array.from(inputs).slice(i * SIZE, (i + 1) * SIZE);
        const rowValues = rowInputs.map(input => input.value);
        const rowSolution = completed_sudoku_no1_solve.slice(i * SIZE, (i + 1) * SIZE);
        if (!arraysEqual(rowValues, rowSolution)) {
            isSolved = false;
            rowInputs.forEach(input => input.style.color = 'red');
        }
    }

    // Ellenőrzés oszloponként
    for (let j = 0; j < SIZE; j++) {
        const columnInputs = Array.from(inputs).filter((_, index) => index % SIZE === j);
        const columnValues = columnInputs.map(input => input.value);
        const columnSolution = completed_sudoku_no1_solve.filter((_, index) => index % SIZE === j);
        if (!arraysEqual(columnValues, columnSolution)) {
            isSolved = false;
            columnInputs.forEach(input => input.style.color = 'red');
        }
    }

    // Ellenőrzés 3x3-as blokkokban
    for (let block = 0; block < SIZE; block++) {
        const startRow = Math.floor(block / 3) * 3;
        const startColumn = (block % 3) * 3;
        const blockInputs = Array.from(inputs).filter((_, index) => {
            const row = Math.floor(index / SIZE);
            const column = index % SIZE;
            return row >= startRow && row < startRow + 3 && column >= startColumn && column < startColumn + 3;
        });
        const blockValues = blockInputs.map(input => input.value);
        const blockSolution = completed_sudoku_no1_solve.filter((_, index) => {
            const row = Math.floor(index / SIZE);
            const column = index % SIZE;
            return row >= startRow && row < startRow + 3 && column >= startColumn && column < startColumn + 3;
        });
        if (!arraysEqual(blockValues, blockSolution)) {
            isSolved = false;
            blockInputs.forEach(input => input.style.color = 'red');
        }
    }

    if (isSolved) {
        alert('A sudoku megoldása helyes!');
    } else {
        alert('A sudoku megoldása helytelen!');
    }
}

// Két tömb egyenlőségének ellenőrzése
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Az oldal betöltésekor létrehozza a sudoku táblát és hozzáadja az ellenőrzés gombot
window.onload = createSudokuTable;