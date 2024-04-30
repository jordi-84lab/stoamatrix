document.addEventListener('DOMContentLoaded', function() {
  const url = 'https://min-api.cryptocompare.com/data/v2/histoday';
  const params = new URLSearchParams({
    fsym: 'BTC',
    tsym: 'USD',
    limit: '90',
    api_key: '51a7f85760b83b841a27e78aeab8120f99b405a1253c7b58aadaeb9805c12fa7'
  });

  fetch(`${url}?${params}`)
    .then(response => response.json())
    .then(data => {
      const btcData = data.Data.Data;
      const dates = btcData.map(item => new Date(item.time * 1000).toISOString().split('T')[0]);
      const prices = btcData.map(item => item.close);
      const dailyReturns = btcData.map((item, index, arr) => index > 0 ? (item.close - arr[index - 1].close) / arr[index - 1].close : 0);

      // Calculamos la volatilidad como indicador de riesgo
      const meanReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
      const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / dailyReturns.length;
      const volatility = Math.sqrt(variance);

      let riskSignals = dailyReturns.map((returnVal, index) =>
        (returnVal - meanReturn) / volatility
      );

      // Preparar los trazos para Plotly
      const lineTrace = {
        x: dates,
        y: prices,
        mode: 'lines',
        line: {
          color: 'teal',
          width: 1
        },
        name: 'BTC Price'
      };

      const scatterTrace = {
        x: dates,
        y: riskSignals, // Usamos riskSignals en lugar de prices para la y
        mode: 'markers',
        marker: {
          size: 10,
          color: riskSignals, // Usa la volatilidad como color
          coloraxis: 'coloraxis'
        },
        text: riskSignals.map(signal => `Risk Signal: ${signal.toFixed(2)}`),
        hoverinfo: 'text+x',
        name: 'Risk Signal'
      };

      // Configurar la disposición del gráfico
      const layout = {
        title: 'Bitcoin Price and Risk Signal',
        xaxis: {
          title: 'Date'
        },
        yaxis: {
          title: '',
          side: 'right'
        }, // Cambia el título del eje Y
        margin: {
          l: 50,
          r: 200,
          b: 50,
          t: 50,
          pad: 4
        },
        coloraxis: {
          colorscale: 'Picnic',
          cmin: -2,
          cmax: 2
        }, // Ajusta la escala de colores para el riesgo
        legend: {
          x: 1.07,
          y: 1,
          font: {
            size: 10
          },
          bgcolor: 'rgba(255,255,255,0.5)'
        }
      };

      // Crear el gráfico
      Plotly.newPlot('plot', [lineTrace, scatterTrace], layout);
    });
});
