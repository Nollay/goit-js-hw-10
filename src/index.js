import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function editHtml() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}


input.addEventListener('input',
    debounce(evt => {
        const strValue = input.value.trim();
        editHtml()
        if (strValue !== '') {
            fetchCountries(strValue).then(receivedData => {
                if (receivedData.length > 10) {
                    Notiflix.Notify.info(
                        'Too many matches found. Please enter a more specific name.'
                    );
                } else if (receivedData.length === 0) {
                    Notiflix.Notify.failure('Oops, there is no country with that name');
                } else if (receivedData.length >= 2 && receivedData.length <= 10) {
                    renderMarkup(receivedData);
                } else if (receivedData.length === 1) {
                    renderCountry(receivedData);
                }
            });
        }
    }, DEBOUNCE_DELAY)
);

function renderMarkup(countries) {
    const markup = countries.map(country => {
        return `<li>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
        <b>${country.name.official}</b>
        </li>`;
    })
        .join('');
    countryList.innerHTML = markup;
};


function renderCountry(countries) {
    const markup = countries.map(country => {
        return `<li>
        <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
        }" width="30" hight="20">
            <b>${country.name.official}</b>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
        </li>`;
    })
        .join('');
    countryList.innerHTML = markup;
};

