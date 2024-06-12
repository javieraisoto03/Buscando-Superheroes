$(document).ready(function() {
    $('#search-form').on('submit', function(event) {
        event.preventDefault();
        let heroId = $('#hero-id').val();
        if (validateHeroId(heroId)) {
            fetchHeroData(heroId);
        } else {
            alert('Por favor, ingrese un número válido.');
        }
    });
});

function validateHeroId(heroId) {
    return /^\d+$/.test(heroId); // Verifica que solo contiene números
}

function fetchHeroData(heroId) {
    $.ajax({
        url: `https://www.superheroapi.com/api.php/4905856019427443/${heroId}`,
        method: 'GET',
        success: function(data) {
            if (data.response === "success") {
                displayHeroData(data);
                renderChart(data);
            } else {
                alert('Superhéroe no encontrado.');
            }
        },
        error: function() {
            alert('Error al conectar con la API.');
        }
    });
}

function displayHeroData(data) {
    let heroCard = `
        <div class="card mt-4">
            <div class="card-header">
                <h3>${data.name}</h3>
            </div>
            <div class="card-body">
                <img src="${data.image.url}" class="card-img-top" alt="${data.name}">
                <p><strong>Nombre Completo:</strong> ${data.biography['full-name']}</p>
                <p><strong>Alias:</strong> ${data.biography.aliases.join(', ')}</p>
                <p><strong>Editorial:</strong> ${data.biography.publisher}</p>
                <p><strong>Ocupación:</strong> ${data.work.occupation}</p>
            </div>
        </div>
    `;
    $('#results').html(heroCard);
}

function renderChart(data) {
    let chartData = [
        { y: parseInt(data.powerstats.intelligence), label: "Intelligence" },
        { y: parseInt(data.powerstats.strength), label: "Strength" },
        { y: parseInt(data.powerstats.speed), label: "Speed" },
        { y: parseInt(data.powerstats.durability), label: "Durability" },
        { y: parseInt(data.powerstats.power), label: "Power" },
        { y: parseInt(data.powerstats.combat), label: "Combat" }
    ];

    let chartContainer = `
        <div class="mt-4">
            <div id="chartContainer" style="height: 370px; width: 100%;"></div>
        </div>
    `;
    $('#results').append(chartContainer);

    let chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: `Estadísticas de Poder de ${data.name}`
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}",
            dataPoints: chartData
        }]
    });
    chart.render();
}


