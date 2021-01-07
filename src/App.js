import React, {useState, useEffect} from "react";
import './App.css';
import {
    MenuItem,
    FormControl,
    Select,
    Card,
    Paper,
    CardContent, Typography,
} from "@material-ui/core";
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import Switch from '@material-ui/core/Switch';
import { sortData,prettyPrintStat } from "./components/util";

import Map from "./components/Map";
import "leaflet/dist/leaflet.css";

import InfoBox from "./components/InfoBox";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import numeral from "numeral";


function App() {
    const [country, setInputCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [countries, setCountries] = useState([]);
    const [mapCountries, setMapCountries] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
    const [mapZoom, setMapZoom] = useState(3);
    const [darkMode, setDarkMode] = useState( localStorage.getItem('darkMode')==='dark'?true:false);



    const handleChangeDark = (event) => {
        setDarkMode(event.target.checked)
        localStorage.setItem('darkMode', darkMode ? 'light' : 'dark')
    };
    const theme = createMuiTheme({
        palette: {
            type: localStorage.getItem('darkMode')?localStorage.getItem('darkMode'):'light'
        },
    });


    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country,
                        value: country.countryInfo.iso2,
                    }));
                    let sortedData = sortData(data);
                    setCountries(countries);
                    setMapCountries(data);
                    setTableData(sortedData);
                });
        };

        getCountriesData();
    }, []);
    const onCountryChange = async (e) => {
        const countryCode = e.target.value;

        const url =
            countryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all"
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setInputCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };
    let backgroundDark = {
        background: 'black'
    }
    let backgroundLight = {
        background: '#f5f6fa'
    }


    return (

        <ThemeProvider theme={theme}>
            <div style={localStorage.getItem('darkMode') === 'dark' ? {
                display: 'flex',
                alignItems: 'center',
                background: 'black'
            } : {display: 'flex', alignItems: 'center', background: '#f5f6fa'}}>
                <Switch checked={darkMode} onChange={handleChangeDark} name="checkedA" inputProps={{'aria-label': 'secondary checkbox'}}/>
                <Typography style={{color:localStorage.getItem('darkMode') === 'dark' ?'white':'black'}} variant="h6" gutterBottom color='textSecondary'>
                    Dark Mode
                </Typography>
            </div>
            <div className="app" style={localStorage.getItem('darkMode') === 'dark' ? backgroundDark : backgroundLight}>

                <div className="app__left">
                    <div className="app__header">
                        <h1>C <img alt='O' src="https://img.icons8.com/color/48/000000/coronavirus--v2.png"/> VID-19 Tracker</h1>
                        <FormControl className="app__dropdown">
                            <Select
                                variant="outlined"
                                value={country}
                                onChange={onCountryChange}
                            >
                                <MenuItem value="worldwide">Worldwide</MenuItem>
                                {countries.map((country) => (
                                    <MenuItem value={country.value}>{country.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="app__stats">
                        <InfoBox
                            onClick={(e) => setCasesType("cases")}
                            title="Coronavirus Cases"
                            isRed
                            active={casesType === "cases"}
                            cases={countryInfo.todayCases}
                            total={numeral(countryInfo.cases).format("0.0a")}
                        />
                        <InfoBox
                            onClick={(e) => setCasesType("recovered")}
                            title="Recovered"
                            active={casesType === "recovered"}
                            cases={prettyPrintStat(countryInfo.todayRecovered)}
                            total={numeral(countryInfo.recovered).format("0.0a")}
                        />
                        <InfoBox
                            onClick={(e) => setCasesType("deaths")}
                            title="Deaths"
                            isRed
                            active={casesType === "deaths"}
                            cases={prettyPrintStat(countryInfo.todayDeaths)}
                            total={numeral(countryInfo.deaths).format("0.0a")}
                        />
                    </div>
                    <Map
                        countries={mapCountries}
                        casesType={casesType}
                        center={mapCenter}
                        zoom={mapZoom}
                    />
                </div>
                <Card className="app__right">
                    <CardContent>
                        <Paper className="app__information">
                            <Typography variant="h3" color='textSecondary' gutterBottom>
                                Live cases by country
                            </Typography>
                            <Table countries={tableData}/>
                            <Typography variant="h3" color='textSecondary' gutterBottom>
                                Worldwide new {casesType}
                            </Typography>
                            <LineGraph className='app_graph' casesType={casesType} />
                        </Paper>
                    </CardContent>
                </Card>
            </div>
        </ThemeProvider>


    );
}

export default App
