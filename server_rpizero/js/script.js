
// Conversion RGB to HEX
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// Data filtering
function porID_1(value, index, array) {
    if (value[0] == "1") {
        return value.shift();
    }
}

function porID_2(value, index, array) {
    if (value[0] == "3") {
        return value.shift();
    }
}

// Database request
window.onload = function () {
    $.ajax({
        url: '/php/mariaDB_Query.php',
        success: function (data) {
            parsed_data = jQuery.parseJSON(data);
            (function () {

                // --------[Estilo de los graficos]--------

                const layout_temp = {
                    plot_bgcolor: 'rgba(0, 0, 0, 0)',
                    paper_bgcolor: 'rgba(0, 0, 0, 0)',
                    margin: {l: 35, r: 0, b: 70, t: 20, pad: 10},
                    showlegend: false,

                    xaxis: {
                        showgrid: true,
                        tickangle: 60,
                        dtick: 3,
                        tickfont: {size: 14, color: 'rgb(255, 242, 235)', family: 'Manrope'},
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },

                    yaxis: {
                        showgrid: true,
                        zeroline: false,
                        range: [0, 60.0],
                        tickfont: {size: 14, color: 'rgb(255, 242, 235)', family: 'Manrope'},
                        gridcolor: 'rgba(255,255,255,0.2)',
                    }
                };

                const layout_color = {
                    plot_bgcolor: 'rgba(0, 0, 0, 0)',
                    paper_bgcolor: 'rgba(0, 0, 0, 0)',
                    margin: {l: 35, r: 0, b: 70, t: 20, pad: 10},
                    showlegend: false,

                    xaxis: {
                        showgrid: true,
                        tickangle: 60,
                        dtick: 3,
                        tickfont: {size: 14, color: 'rgb(255, 242, 235)', family: 'Manrope'},
                        gridcolor: 'rgba(255,255,255,0.2)'
                    },

                    yaxis: {
                        showgrid: true,
                        zeroline: false,
                        range: [0, 255],
                        tickfont: {size: 14, color: 'rgb(255, 242, 235)', family: 'Manrope'},
                        gridcolor: 'rgba(255,255,255,0.2)',
                    }
                };

                const config = {responsive: true};

                // --------[Plot data]--------

                disp_1 = parsed_data.filter(porID_1);

                plotSetup(disp_1, layout_temp, layout_color, config, 1);

                disp_2 = parsed_data.filter(porID_2);

                plotSetup(disp_2, layout_temp, layout_color, config, 2);

            })()
        }
    })
};

// Init the plots
function plotSetup(data, layout_temp, layout_color, config, id) {
    x_data = data.map(arr => arr[0]);
    y_data = data.map(arr => parseFloat(arr[1]));

    r_data = data.map(arr => parseFloat(arr[2]));
    g_data = data.map(arr => parseFloat(arr[3]));
    b_data = data.map(arr => parseFloat(arr[4]));

    const trace_temp = {
        x: x_data,
        y: y_data,
        type: 'scatter',
        line: {color: 'rgb(14, 14, 14)', width: 1.5},
        marker: {color: 'rgb(255, 242, 235)', size: 5}
    };

    const data_1 = [trace_temp];

    const trace_r = {
        x: x_data,
        y: r_data,
        type: 'scatter',
        line: {color: 'rgb(250,45,45)', width: 1.5},
        marker: {color: 'rgb(248,166,166)', size: 5}
    };

    const trace_g = {
        x: x_data,
        y: g_data,
        type: 'scatter',
        line: {color: 'rgb(91,246,91)', width: 1.5},
        marker: {color: 'rgb(193,248,193)', size: 5}
    };

    const trace_b = {
        x: x_data,
        y: b_data,
        type: 'scatter',
        line: {color: 'rgb(50,50,241)', width: 1.5},
        marker: {color: 'rgb(179,179,255)', size: 5}
    };

    const data_2 = [trace_r, trace_g, trace_b];

    if (id == 1) {
        Plotly.newPlot('plot-id-1', data_1, layout_temp, config);
        document.getElementById('temp-id-1').innerHTML = y_data.pop();

        Plotly.newPlot('plot-id-3', data_2, layout_color, config);
        let hex = "#" + componentToHex(r_data.pop()) + componentToHex(g_data.pop()) + componentToHex(b_data.pop());
        document.getElementById('col-id-1').innerHTML = "<div style='padding: 4px; background-color: " + hex + " ;'>" + hex.toUpperCase() + "</div>";
    } else if (id == 2) {
        Plotly.newPlot('plot-id-2', data_1, layout_temp, config);
        document.getElementById('temp-id-2').innerHTML = y_data.pop();

        Plotly.newPlot('plot-id-4', data_2, layout_color, config);
        let hex = "#" + componentToHex(r_data.pop()) + componentToHex(g_data.pop()) + componentToHex(b_data.pop());
        document.getElementById('col-id-2').innerHTML = "<div style='padding: 4px; background-color: " + hex + " ;'>" + hex.toUpperCase() + "</div>";
    }


}

//  Update the data
function getData() {
    $.ajax({
        url: '/php/mariaDB_Query.php',
        type: 'GET',
        success: function (data) {
            parsed_data = jQuery.parseJSON(data);
            dataToPlot();
        }
    });
}

//          Data processing
function dataToPlot() {

    const transition = {
        transition: {
            duration: 250,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 250
        }
    };

    disp_1 = parsed_data.filter(porID_1);

    plotRead(disp_1, transition, 1);

    disp_2 = parsed_data.filter(porID_2);

    plotRead(disp_2, transition, 2);

}

//          Plot update
function plotRead(data, transition, id) {

    x_data = data.map(arr => arr[0]);
    y_data = data.map(arr => parseFloat(arr[1]));

    r_data = data.map(arr => parseFloat(arr[2]));
    g_data = data.map(arr => parseFloat(arr[3]));
    b_data = data.map(arr => parseFloat(arr[4]));

    const data_temp = {
        data: [{y: y_data, x: x_data}],
        traces: [0],
        layout: {}
    };

    const data_color = {
        data: [{y: r_data, x: x_data}, {y: g_data, x: x_data}, {y: b_data, x: x_data}],
        traces: [0, 1, 2],
        layout: {}
    };

    if (id == 1) {
        Plotly.animate('plot-id-1', data_temp, transition);
        document.getElementById('temp-id-1').innerHTML = y_data.pop();

        Plotly.animate('plot-id-3', data_color, transition);
        let hex = "#" + componentToHex(r_data.pop()) + componentToHex(g_data.pop()) + componentToHex(b_data.pop());
        document.getElementById('col-id-1').innerHTML = "<div style='padding: 4px; background-color: " + hex + " ;'>" + hex.toUpperCase() + "</div>";
    } else if (id == 2) {
        Plotly.animate('plot-id-2', data_temp, transition);
        document.getElementById('temp-id-2').innerHTML = y_data.pop();

        Plotly.animate('plot-id-4', data_color, transition);
        let hex = "#" + componentToHex(r_data.pop()) + componentToHex(g_data.pop()) + componentToHex(b_data.pop());
        document.getElementById('col-id-2').innerHTML = "<div style='padding: 4px; background-color: " + hex + " ;'>" + hex.toUpperCase() + "</div>";
    }


}

//  Request to database every second
setInterval(() => {
    getData();
}, "1000");
