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
            
            const riskFreeRate = 0.01 / 365;
            let rollingSharpeRatios = [];
            let window = 30; // tamaño de ventana para el cálculo rodante
            
            for (let i = window - 1; i < dailyReturns.length; i++) {
                let windowReturns = dailyReturns.slice(i - window + 1, i + 1);
                let excessReturns = windowReturns.map(r => r - riskFreeRate);
                
                let meanExcessReturn = excessReturns.reduce((a, b) => a + b, 0) / window;
                let variance = excessReturns.reduce((a, b) => a + Math.pow(b - meanExcessReturn, 2), 0) / window;
                let stdDev = Math.sqrt(variance);
                
                let sharpeRatio = meanExcessReturn / stdDev * Math.sqrt(365);
                rollingSharpeRatios.push(sharpeRatio);
            }

            // Añadir 'null' para los primeros 'window - 1' días
            for (let i = 0; i < window - 1; i++) {
                rollingSharpeRatios.unshift(null);
            }

            // Preparar los trazos para Plotly
            const lineTrace = {
                x: dates,
                y: prices,
                mode: 'lines',
                line: { color: 'teal', width: 1 },
                name: 'BTC Price'
            };

            const scatterTrace = {
    x: dates,
    y: prices,
    mode: 'markers',
    marker: {
        size: 10,
        color: rollingSharpeRatios,
        coloraxis: 'coloraxis'
    },
    // Formatea cada valor de Sharpe Ratio a un string con 2 decimales
    text: rollingSharpeRatios.map(ratio => {
        // Verifica si ratio es un número antes de llamar a toFixed para evitar errores
        return ratio !== null ? `Sharpe Ratio: ${ratio.toFixed(2)}` : '';
    }),
    hoverinfo: 'text+x+y',
    name: 'Sharpe Ratio'
};

            // Configurar la disposición del gráfico
            const layout = {
                title: 'Bitcoin Price and Rolling Sharpe Ratio',
                xaxis: { title: 'Date' },
                yaxis: { title: 'Price (USD)' },
                margin: { l: 50, r: 200, b: 50, t: 50, pad: 4 },
                coloraxis: { colorscale: 'RdYlGn', cmin: Math.min(...rollingSharpeRatios), cmax: Math.max(...rollingSharpeRatios) },
                legend: { 
                    x: 1.07,
                    y: 1,
                    font: { size: 10 },
                    bgcolor: 'rgba(255,255,255,0.5)'
                }
            };

            // Crear el gráfico
            Plotly.newPlot('plot', [lineTrace, scatterTrace], layout);
        });
});
