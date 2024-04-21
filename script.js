document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('btcChart').getContext('2d');
    const btcChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Precio de Bitcoin (USD)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                yAxisID: 'y-axis-price'
            }, {
                label: 'Sentimiento del Mercado (Fear and Greed Index)',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                yAxisID: 'y-axis-sentiment'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    id: 'y-axis-price',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        beginAtZero: false
                    }
                }, {
                    id: 'y-axis-sentiment',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        beginAtZero: true,
                        max: 100, // Fear and Greed Index va de 0 a 100
                        min: 0
                    }
                }]
            }
        }
    });

    axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=100&interval=daily')
        .then(function (response) {
            const prices = response.data.prices;
            prices.forEach(function(price) {
                btcChart.data.labels.push(new Date(price[0]).toLocaleDateString());
                btcChart.data.datasets[0].data.push(price[1]);
            });
            btcChart.update();
        })
        .catch(function (error) {
            console.error('Error fetching price data: ', error);
        });

    axios.get('https://api.alternative.me/fng/?limit=100')
        .then(function (response) {
            const fngData = response.data.data;
            fngData.forEach(function(fng, index) {
                btcChart.data.datasets[1].data[index] = fng.value;
            });
            btcChart.update();
        })
        .catch(function (error) {
            console.error('Error fetching Fear and Greed data: ', error);
        });
});

document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('btcChart2').getContext('2d');
    const btcChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Precio de Bitcoin (USD)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                yAxisID: 'y-axis-price'
            }, {
                label: 'Sentimiento del Mercado (Fear and Greed Index)',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                yAxisID: 'y-axis-sentiment'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    id: 'y-axis-price',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        beginAtZero: false
                    }
                }, {
                    id: 'y-axis-sentiment',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        beginAtZero: true,
                        max: 100, // Fear and Greed Index va de 0 a 100
                        min: 0
                    }
                }]
            }
        }
    });

    axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=100&interval=daily')
        .then(function (response) {
            const prices = response.data.prices;
            prices.forEach(function(price) {
                btcChart.data.labels.push(new Date(price[0]).toLocaleDateString());
                btcChart.data.datasets[0].data.push(price[1]);
            });
            btcChart.update();
        })
        .catch(function (error) {
            console.error('Error fetching price data: ', error);
        });

    axios.get('https://api.alternative.me/fng/?limit=100')
        .then(function (response) {
            const fngData = response.data.data;
            fngData.forEach(function(fng, index) {
                btcChart.data.datasets[1].data[index] = fng.value;
            });
            btcChart.update();
        })
        .catch(function (error) {
            console.error('Error fetching Fear and Greed data: ', error);
        });
});
