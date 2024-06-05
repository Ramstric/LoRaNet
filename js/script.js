
// --------[Setup lecture]--------
window.onload = function () { $.ajax({
    url: '/php/mariaDB_Query.php', // your php file
    // type: 'GET', // type of the HTTP request
    success: function (data) {
      parsed_data = jQuery.parseJSON(data);
      (function () {
        x_data = parsed_data.map(arr => arr[0]);
        y_data = parsed_data.map(arr => parseFloat(arr[1]));

        const trace = {
          x: x_data,    // Replace with your x data
          y: y_data,  // Replace with your y data
          type: 'scatter',
          line: {color: 'rgb(14, 14, 14)', width: 1.5},
          marker: {color: 'rgb(255, 242, 235)', size: 5}
        };

        const data_1 = [trace];

        const layout = {
          plot_bgcolor: 'rgba(0, 0, 0, 0)',
          paper_bgcolor: 'rgba(0, 0, 0, 0)',
          margin: {l: 35, r: 0, b: 70, t: 20, pad: 10},

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
            tickfont: {size: 14, color: 'rgb(255, 242, 235)', family: 'Manrope'},
            gridcolor: 'rgba(255,255,255,0.2)',
          }
        };

        const config = {responsive: true};

        Plotly.newPlot('plot-id-1', data_1, layout, config);
        document.getElementById('temp-id-1').innerHTML = y_data[y_data.length - 1];
      })()
    }
  })
};


function getData()
{
  $.ajax({
    url: '/php/mariaDB_Query.php', // your php file
    type: 'GET', // type of the HTTP request
    success: function (data) {
      parsed_data = jQuery.parseJSON(data);
      dataToPlot();
    }
  });
}

function dataToPlot() {
  x_data = parsed_data.map(arr => arr[0]);
  y_data = parsed_data.map(arr => parseFloat(arr[1]));

  const data = {
    data: [{y: y_data, x: x_data}],
    traces: [0],
    layout: {}
  };

  const transition = {
    transition: {
      duration: 250,
      easing: 'cubic-in-out'
    },
    frame: {
      duration: 250
    }
  };

  Plotly.animate('plot-id-1', data, transition);
  document.getElementById('temp-id-1').innerHTML = y_data[y_data.length - 1];
}


setInterval(() => {
  getData();
}, "4000");
