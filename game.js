var rows = 10;
var columns = 10;
// grid contents
var grid = [];
// how many mines there will be on the grid
var mineCount = 10;

var gridElement = document.getElementById('grid');

// images we'll use for grid numbers, with 0 being empty
var images = [
    "https://user-images.githubusercontent.com/56004853/68697439-16d0f580-057f-11ea-8954-f47b9edb0ca9.jpg",
    "https://user-images.githubusercontent.com/56004853/68697435-159fc880-057f-11ea-8f66-9258fbcc421a.jpg",
    "https://user-images.githubusercontent.com/56004853/68697441-16d0f580-057f-11ea-8be9-1768e3e616bc.jpg",
    "https://user-images.githubusercontent.com/56004853/68697442-16d0f580-057f-11ea-88c2-dd4f2b4065d5.jpg",
    "https://user-images.githubusercontent.com/56004853/68697443-16d0f580-057f-11ea-9ae4-c5b84ad30fa4.jpg",
    "https://user-images.githubusercontent.com/56004853/68697446-17698c00-057f-11ea-94f4-8618237a8f8e.jpg",
    "https://user-images.githubusercontent.com/56004853/68697448-18022280-057f-11ea-8421-fac10e7e7b2a.jpg",
    "https://user-images.githubusercontent.com/56004853/68697447-17698c00-057f-11ea-9d0e-9f0b85f7fc21.jpg",
    "https://user-images.githubusercontent.com/56004853/68697434-15073200-057f-11ea-9565-cd8daa5b2101.jpg"
];

function getImage(which) {
    // empty or number
    if(which >= 0)
        return images[which];
    // mine
    else if(which == -1)
        return "https://user-images.githubusercontent.com/56004853/68697437-159fc880-057f-11ea-93c3-fec5bbb29385.jpg";

    // we don't know what this is, so return nothing :D
    return "";
}

function setCellImage(x, y, source) {
    var cell = grid[y][x];

    cell.image.setAttribute("src", source);
}

function generateGrid () {
    // reset the entire grid
    grid = [];

    // empty out the grid
    while(gridElement.hasChildNodes()) {
        gridElement.removeChild(gridElement.lastChild);
    }

    var tableElement = document.createElement("table");
    gridElement.appendChild(tableElement);


    for(var y = 0; y < rows; ++y) {
        var row = [];

        // create new row element and add  it
        var rowElement = document.createElement("tr");
        tableElement.appendChild(rowElement);

        for(var x = 0; x < columns; ++x) {
            var td = document.createElement("td");
            rowElement.appendChild(td);

            var imageElement = document.createElement("img");
            td.appendChild(imageElement);

            var cell = {
                revealed: false,
                // value of this cell (how many mines are around it), with 0 being empty (no mines around) and -1 is a mine
                value: 0,
                // the html element we'll use
                image: null
            };

            cell.image = imageElement;
            cell.image.onclick = function() {
                checkCell(this.x, this.y);
            }.bind(
                {x: x,
                 y: y}
            );

            row.push(cell);
        }

        grid.push(row);
    }

    console.log('grid: ', grid);

    // set closed images to each cell

    for(var y = 0; y < rows; ++y) {
        for(var x = 0; x < columns; ++x) {
            setCellImage(x, y, "https://user-images.githubusercontent.com/56004853/68697433-15073200-057f-11ea-864a-9cb54fe0bfd8.jpg");
        }
    }

    // add random mines
    for(var i = 0; i < mineCount; ++i) {
        var x = Math.floor(Math.random() * columns);
        var y = Math.floor(Math.random() * rows);

        grid[y][x].value = -1;
    }

    // we need to generate values for cells which are not mines

    for(var y = 0; y < rows; ++y) {
        for(var x = 0; x < columns; ++x) {
            var cell = grid[y][x];

            if(cell.value != -1)
                cell.value = cellMineCount(x, y);
        }
    }
}

function checkCell(x, y) {
    if(!inGrid(x, y))
        return;

    var cell = grid[y][x];

    console.log('Clicked: ', x, 'x', y, ': ', cell.value);

    // if the cell is already revealed we do nothing
    if(cell.revealed)
        return;

    // if the clicked cell is empty, reveal all other empty cells and values around
    if(cell.value == 0) {
        revealCells(x, y);
        return;
    }

    // clicked on number, reveal it
    if(cell.value > 0) {
        revealCell(x, y);
    }

    // clicked on mine, we're dead
    if(cell.value == -1) {
        youDied(x, y);
    }
}

// die on a given cell
function youDied(x, y) {
    var cell = grid[y][x];

    // give the cell we died on a red background, and make it a bit visible
    cell.image.style = 'background: red; padding: 4px';

    revealCell(x, y);

    // reveal all other mines
    for(var y = 0; y < rows; ++y) {
        for(var x = 0; x < columns; ++x) {
            var cell = grid[y][x];

            if(cell.value == -1)
                revealCell(x, y);
        }
    }
}

function revealCell(x, y) {
    var cell = grid[y][x];
    cell.revealed = true;
    cell.image.setAttribute("src", getImage(cell.value));
}

// reveals given cell at coordinates, and those around it, unless it's a mine
function revealCells(x, y) {
    if(!inGrid(x, y))
        return;

    var cell = grid[y][x];

    // already revealed this cell, don't go further
    if(cell.revealed)
        return;

    if(cell.value > 0) {
        // if number, reveal it but don't go around it
        revealCell(x, y, cell.value);
        return;
    }

    if(cell.value == 0) {
        revealCell(x, y, cell.value);

        revealCells(x + 1, y - 1);
        revealCells(x,     y - 1);
        revealCells(x - 1, y - 1);

        revealCells(x + 1, y);
        revealCells(x - 1, y);

        revealCells(x + 1, y + 1);
        revealCells(x    , y + 1);
        revealCells(x - 1, y + 1);
    }
}

function isEmpty(x, y) {
    var cell = grid[y][x];

    if(cell.value == 0)
        return true;

    return false;
}

function inGrid(x, y) {
    return x >= 0 && x < columns && y >= 0 && y < rows;
}

// get value of a cell
function getValue(x, y) {
    if(!inGrid(x, y))
        // return empty if outside grid
        return 0;

    var cell = grid[y][x];
    return cell.value;
}

// counts mines in and around a cell
function cellMineCount(x, y) {
    var count = 0;

    if(getValue(x + 1, y - 1) == -1)
        ++count;

    if(getValue(x,     y - 1) == -1)
        ++count;

    if(getValue(x - 1, y - 1) == -1)
        ++count;

    if(getValue(x + 1, y) == -1)
        ++count;

    if(getValue(x    , y) == -1)
        ++count;

    if(getValue(x - 1, y) == -1)
        ++count;

    if(getValue(x + 1, y + 1) == -1)
        ++count;

    if(getValue(x    , y + 1) == -1)
        ++count;

    if(getValue(x - 1, y + 1) == -1)
        ++count;

    return count;
}

generateGrid();