
window.onload = function () { $.ajax({
    url: '/php/mariaDB_getTable.php', // your php file
    // type: 'GET', // type of the HTTP request
    success: function (data) {
        parsed_data = jQuery.parseJSON(data);
        createTable(parsed_data);
    }
})
    addStyle(styles);
};

function createTable(tableData) {
    var table = document.createElement('table');

    var tableBody = document.createElement('tbody');

    // Create header row
    var headerRow = document.createElement('tr');

    var headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('Fecha'));
    headerRow.appendChild(headerCell);

    headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('Hora'));
    headerRow.appendChild(headerCell);

    headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('ID'));
    headerRow.appendChild(headerCell);

    headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('Temperatura'));
    headerRow.appendChild(headerCell);

    tableBody.appendChild(headerRow);

    // Create data rows
    tableData.forEach(function(rowData) {
        var row = document.createElement('tr');

        rowData.forEach(function(cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.body.appendChild(table);
}

/* Function to add style element */
function addStyle(styles) {

    /* Create style document */
    var css = document.createElement('style');
    css.type = 'text/css';

    if (css.styleSheet)
        css.styleSheet.cssText = styles;
    else
        css.appendChild(document.createTextNode(styles));

    /* Append style to the tag name */
    document.getElementsByTagName("head")[0].appendChild(css);
}

/* Set the style */
var styles = 'table * { border: 1px solid var(--main-bg-color); }';

styles += 'table { font: 15px "Manrope", sans-serif; border-collapse: collapse; width: 100%; color: var(--main-bg-color); }';
