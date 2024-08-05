
//          Funcion para convertir los datos de la base de datos a un arreglo
function DataToXML(data) {
    var xml = document.createElement("div");
    xml.innerHTML = data;

    var parsed_data = [];

    for (var i = 0; i < xml.getElementsByTagName("id").length; i++) {
        var id = xml.getElementsByTagName("id")[i].getAttribute("DispositivoID");
        var fecha = xml.getElementsByTagName("fecha")[i].innerHTML;
        var hora = xml.getElementsByTagName("hora")[i].innerHTML;
        var temp = xml.getElementsByTagName("temperatura")[i].innerHTML;
        var red = xml.getElementsByTagName("rojo")[i].innerHTML;
        var green = xml.getElementsByTagName("verde")[i].innerHTML;
        var blue = xml.getElementsByTagName("azul")[i].innerHTML;
        parsed_data.push([id, fecha, hora, temp, red, green, blue]);
    }

    return parsed_data;
}

//          Cargar la tabla al cargar la pagina
window.onload = function () { $.ajax({
    url: '/php/mariaDB_getTable.php',
    success: function (data) {

        parsed_data = DataToXML(data);

        createTable(parsed_data);
    }
})
    addStyle(styles);
};

//          Colores para la temperatura
const temp_colors = ["#37537C","#26436F","#254f77","#2b5b79","#27678a","#287593","#438190","#648c89","#879a84","#aaa97d","#c2ab77","#c19d61","#c38a53","#be704c","#af4d4c","#9f294c","#87203e","#6e1531","#560c25","#3d0216"];

function createTable(tableData) {
    var table = document.createElement('table');

    var tableBody = document.createElement('tbody');

    // Crear encabezado
    var headerRow = document.createElement('tr');

    var headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('ID'));
    headerRow.appendChild(headerCell);

    headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('Fecha'));
    headerRow.appendChild(headerCell);

    headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('Hora'));
    headerRow.appendChild(headerCell);

    headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('Temperatura'));
    headerRow.appendChild(headerCell);

    headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('Red'));
    headerRow.appendChild(headerCell);

    headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('Green'));
    headerRow.appendChild(headerCell);

    headerCell = document.createElement('th');
    headerCell.appendChild(document.createTextNode('Blue'));
    headerRow.appendChild(headerCell);

    tableBody.appendChild(headerRow);

    // Crear filas de datos
    tableData.forEach(function(rowData) {
        var row = document.createElement('tr');

        rowData.forEach(function(cellData, index) {
            var cell = document.createElement('td');
            if (index == 3) {
                if (cellData < 50.0) {
                    cell.style.backgroundColor = temp_colors[Math.floor(Math.abs(cellData/2.5 - 1))]
                } else {
                    cell.style.backgroundColor = temp_colors[19]
                }
            }
            if (index == 4 || index == 5 || index == 6) {
                cell.style.backgroundColor = "rgb("+rowData[4]+","+rowData[5]+","+rowData[6]+")";
            }
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    var div = document.getElementById('table-div');

    div.appendChild(table);
}

//          Agregar estilo CSS a los elementos creados
function addStyle(styles) {

    //  Crear un elemento style
    var css = document.createElement('style');
    css.type = 'text/css';

    if (css.styleSheet)
        css.styleSheet.cssText = styles;
    else
        css.appendChild(document.createTextNode(styles));

    //  Agregar el elemento style al encabezado
    document.getElementsByTagName("head")[0].appendChild(css);

    //  Agregar el elemento style a los botones
    for (var i = 0; i < 5; i++) {
        document.getElementsByTagName("button")[i].appendChild(css);
    }

}

//          Codigo CSS
var styles = 'table * { border: 1px solid var(--main-bg-color); }';

styles += 'table { margin-left: auto; margin-right: auto; text-align: center; font: 15px "Manrope", sans-serif; border-collapse: collapse; width: 50em; color: var(--main-bg-color); }';

styles += 'tr td:nth-child(5) { background: #671a1a; }'
styles += 'tr td:nth-child(6) { background: #3d5931; }'
styles += 'tr td:nth-child(7) { background: #313959; }'
styles += '.aClassName { background: #313959; }'

//          Botones
btn_1 = document.getElementById("boton-dia");
btn_2 = document.getElementById("boton-mat");
btn_3 = document.getElementById("boton-vesp");
btn_4 = document.getElementById("boton-noct");
btn_5 = document.getElementById("boton-id");

//          Eventos de los botones
btn_1.addEventListener("click", function() {
    $.ajax({
        url: '/php/mariaDB_getTableDia.php',
        success: function (data) {
            parsed_data = DataToXML(data);

            var table = document.getElementsByTagName('table')[0];
            table.remove();
            createTable(parsed_data);
        }
    })
});

btn_2.addEventListener("click", function() {
    $.ajax({
        url: '/php/mariaDB_getTableMatutino.php',
        success: function (data) {
            parsed_data = DataToXML(data);

            var table = document.getElementsByTagName('table')[0];
            table.remove();
            createTable(parsed_data);
        }
    })
});

btn_3.addEventListener("click", function() {
    $.ajax({
        url: '/php/mariaDB_getTableVespertino.php',
        success: function (data) {
            parsed_data = DataToXML(data);

            var table = document.getElementsByTagName('table')[0];
            table.remove();
            createTable(parsed_data);
        }
    })
});

btn_4.addEventListener("click", function() {
    $.ajax({
        url: '/php/mariaDB_getTableNocturno.php',
        success: function (data) {
            parsed_data = DataToXML(data);

            var table = document.getElementsByTagName('table')[0];
            table.remove();
            createTable(parsed_data);
        }
    })
});

btn_5.addEventListener("click", function() {
    $.ajax({
        url: '/php/mariaDB_getTableID.php',
        success: function (data) {
            parsed_data = DataToXML(data);

            var table = document.getElementsByTagName('table')[0];
            table.remove();
            createTable(parsed_data);
        }
    })
});
