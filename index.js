let grid = [];
let hoverColour = "#00a400";
const hoverColourElem = document.getElementById("favcolor");
const slider = document.getElementById("countRange");
const output = document.getElementById("countOutput");
const userInput = document.getElementById("userInput");

hoverColourElem.onchange = () => {
    hoverColour= hoverColourElem.value
}
output.innerHTML = slider.value;

slider.oninput = () => {
    output.innerHTML = slider.value;
}
slider.onchange = () => {
    repaintGrid()
}

const repaintGrid = () => {
    const existingGrid = document.getElementById("grid");
    const loaderWrapper = document.getElementById("loaderWrapper");
    if(!!existingGrid){
        existingGrid.remove();
        loaderWrapper.style.display = "flex";
    }
    window.localStorage.clear();
    setTimeout(() => {
        loaderWrapper.style.display = "none";
        generateGrid();
    }, 1000);
};

const generateGrid = () => {
    grid = [];
    for(let i=0; i < slider.value; i++){
        grid[i] = [];
        for(let j=0; j < slider.value; j++){
            grid[i][j] = Math.round(Math.random());
        }
    }

    const container = document.createElement("div");
    container.setAttribute("id", "grid");
    container.setAttribute("class", "grid-wrapper");
    document.body.appendChild(container);
    for(let i=0;i<grid.length;i++){
        const line = document.createElement("div");
        line.classList.add("row")
        for(let j=0;j<grid[i].length;j++){
            const square = document.createElement("div");
            square.classList.add("square");
            if(grid[i][j]===1) {
                square.classList.add("filled");
                square.setAttribute("id", `${i}-${j}`);
                square.onmouseover = () => {
                    calculateConnection(i,j,square)
                }
                square.onmouseleave = () => {
                    clearColour(square)
                }
                square.addEventListener("click", () => {
                    const countId = square.getAttribute(`data-group`);
                    showCount(countId, square)
                })
            }
            line.appendChild(square);
        }
        document.getElementById("grid").appendChild(line);
    }
};

const scan = (gridCopy, row, column, listToScan, index) => {
    listToScan.splice(index,1);
    if(column > 0 && gridCopy[row][column-1]===1){
        gridCopy[row][column-1] = 2;
        listToScan.push({
            column: column-1,
            row: row
        })
    }
    if(row > 0 && gridCopy[row-1][column]===1){
        gridCopy[row-1][column] = 2;
        listToScan.push({
            column: column,
            row: row - 1
        })
    }
    if((gridCopy.length-1 > row) && gridCopy[row+1][column]===1){
        gridCopy[row+1][column] = 2;
        listToScan.push({
            column: column,
            row: row + 1
        })
    }
    if((gridCopy.length-1 > column) && gridCopy[row][column+1]===1){
        gridCopy[row][column+1] = 2;
        listToScan.push({
            column: column+1,
            row: row
        })
    }
}

const recurseSquares = (gridCopy,count, listToScan, square, classListName) => {
  
    listToScan.forEach((list, index) => {
        const row = list.row;
        const column = list.column;
        const currSquare = document.getElementById(`${row}-${column}`);
        currSquare.dataset.group = classListName;
        count++;
        scan(gridCopy,row,column,listToScan,index);
    });
    
    if(listToScan.length > 0){
        return recurseSquares(gridCopy, count, listToScan, square, classListName);
    } else {
        return count;
    }
}
const calculateConnection = (row, column, square) => {
    if(!square.hasAttribute("data-group")){
        let count = 0;
        const gridCopy = JSON.parse(JSON.stringify(grid));

        let listToScan = [{
            column,
            row
        }];
        const classListName = `${row}-${column}`;

        gridCopy[row][column] = 2;
        const finalCount = recurseSquares(gridCopy,count,listToScan, square, classListName);
        window.localStorage.setItem(classListName, finalCount);
    }
    const groupId = square.getAttribute(`data-group`);
    const elms = document.querySelectorAll(`[data-group="${groupId}"]`);
    elms.forEach(elm => elm.style.backgroundColor = hoverColour);
}

const clearColour = (square) => {
    if(square.hasAttribute("data-group")){
        const elms = document.querySelectorAll('[data-group]');
        elms.forEach(elm => elm.style.backgroundColor = "blue")
    }
}

const showCount = (countId, square) => {
    const count = JSON.parse(window.localStorage.getItem(countId));
    const elWithScore = document.getElementById("countNumber");
    if(!elWithScore){
        const scoreEl = document.createElement('p');
        scoreEl.setAttribute("id","countNumber");
        square.appendChild(scoreEl);
        scoreEl.innerHTML = count;
    } else {
        square.appendChild(elWithScore);
        elWithScore.innerHTML = count;
    }
};
