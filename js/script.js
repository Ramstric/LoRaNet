const trace = {
  x: [1, 2, 3, 4],    // Replace with your x data
  y: [16, 5, 11, 9],  // Replace with your y data
  type: 'scatter',
  line: {color: 'rgb(14, 14, 14)'},
  marker: {
    color: 'rgb(255, 242, 235)',
    size: 5
  }
};

const data = [trace];

// noinspection SpellCheckingInspection
const layout = {
  plot_bgcolor: 'rgba(0, 0, 0, 0)',
  paper_bgcolor: 'rgba(0, 0, 0, 0)',
  margin: {
    l: 30,
    r: 0,
    b: 30,
    t: 20,
    pad: 10
  },

  xaxis: {
    showgrid: true,
    tickfont: {
      size: 14,
      color: 'rgb(255, 242, 235)',
      family: 'Manrope'
    },
    gridcolor: 'rgba(255,255,255,0.2)',
  },

  yaxis: {
    showgrid: true,
    tickfont: {
      size: 14,
      color: 'rgb(255, 242, 235)',
      family: 'Manrope'
    },
    gridcolor: 'rgba(255,255,255,0.2)',
  }
};

const config = {responsive: true};

Plotly.newPlot('plot-id-1', data, layout, config);
