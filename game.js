var rows = 10;
var columns = 10;
var grid = [];

var gridElement = document.getElementById('grid');

function getImage(value) {
    if(value == 1)
        return "https://user-images.githubusercontent.com/56004853/68697435-159fc880-057f-11ea-8f66-9258fbcc421a.jpg";
    else if (value == 2)
        return "https://user-images.githubusercontent.com/56004853/68697441-16d0f580-057f-11ea-8be9-1768e3e616bc.jpg";
    else if (value == 3)
        return "https://user-images.githubusercontent.com/56004853/68697442-16d0f580-057f-11ea-88c2-dd4f2b4065d5.jpg";
    else if (value == 4)
        return "https://user-images.githubusercontent.com/56004853/68697443-16d0f580-057f-11ea-9ae4-c5b84ad30fa4.jpg";
    else if (value == 5)
        return "https://user-images.githubusercontent.com/56004853/68697446-17698c00-057f-11ea-94f4-8618237a8f8e.jpg";
    else if (value == 6)
        return "https://user-images.githubusercontent.com/56004853/68697448-18022280-057f-11ea-8421-fac10e7e7b2a.jpg";
    else if (value == 7)
        return "https://user-images.githubusercontent.com/56004853/68697447-17698c00-057f-11ea-9d0e-9f0b85f7fc21.jpg";
    else if (value == 8)
        return "https://user-images.githubusercontent.com/56004853/68697434-15073200-057f-11ea-9565-cd8daa5b2101.jpg";
}

function setCellImageByNumber(x, y, which) {
    var cell = grid[y][x];

    cell.image.setAttribute("src", getImage(which));
}

function setCellImage(x, y, source) {
    var cell = grid[y][x];

    cell.image.setAttribute("src", source);
}

function generateGrid () {
    var tableElement = document.createElement("table");
    gridElement.appendChild(tableElement);

    for(var i = 0; i < rows; ++i) {
        var row = [];

        // create new row element and add  it
        var rowElement = document.createElement("tr");
        tableElement.appendChild(rowElement);

        for(var j = 0; j < columns; ++j) {
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
                {x: j,
                 y: i}
            );

            row.push(cell);
        }

        grid.push(row);
    }

    // set closed images to each cell

    for(var i = 0; i < rows; ++i) {
        for(var j = 0; j < columns; ++j) {
            setCellImage(j, i, "https://user-images.githubusercontent.com/56004853/68697433-15073200-057f-11ea-864a-9cb54fe0bfd8.jpg");
        }
    }
}

function checkCell(x, y) {
    console.log('Clicked: ' + x + ' ' + y);

    if(inGrid(x, y)) {

    }
}

function inGrid(x, y) {
    return x >= 0 && x < columns && y >= 0 && y < rows;
}

generateGrid();