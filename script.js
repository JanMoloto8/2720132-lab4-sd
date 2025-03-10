
function func() {
    const country_name = document.getElementById('country-input').value.trim();
    if (country_name == '') {
        alert('Enter country name');
        return;
    }
    fetch_country(country_name);
}

function fetch_country(country_name) {
    document.getElementById('country-info').innerHTML = '';
    document.getElementById('bordering-countries').innerHTML = '';

    const url = `https://restcountries.com/v3.1/name/${country_name}?fullText=true`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                console.log('Country not found');
                alert('Country not found');
                return;
            }
            return response.json();
        })
        .then(data => {
            const country = data[0];
            console.log(country);
            
            // Display country information
            let capital = '';
            if (country.capital) {
                capital = country.capital[0];
            } else {
                capital = 'N/A';
            }

            document.getElementById('country-info').innerHTML = `
                <h2>${country.name.common}</h2>
                <p>Capital: ${capital}</p>
                <p>Population: ${country.population}</p>
                <p>Region: ${country.region}</p>`;

            // Display bordering countries and their flags
            if (country.borders) {
                const borderCountries = country.borders.join(',');
                const borderUrl = `https://restcountries.com/v3.1/alpha?codes=${borderCountries}`;
                fetch(borderUrl)
                    .then(response => response.json())
                    .then(borderData => {
                        const countriesWithFlags = borderData.map(borderCountry => {
                            return `
                                <li>
                                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                                    <strong>${borderCountry.name.common}</strong>
                                </li>`;
                        }).join('<br>');
                        
                        document.getElementById('bordering-countries').innerHTML = `
                            <h2>Bordering Countries:</h2>
                            <ul>${countriesWithFlags}</ul>`;
                    })
                    .catch(error => {
                        console.log('Error fetching bordering countries:', error);
                        alert('An error occurred while fetching bordering countries.');
                    });
            } else {
                document.getElementById('bordering-countries').innerHTML = '<p>No bordering countries.</p>';
            }
        })
        .catch(error => {
            console.log('Error fetching data:', error);
            alert('An error occurred. Please try again later.');
        });
}