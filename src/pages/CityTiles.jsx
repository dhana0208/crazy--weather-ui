import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import x from '../assets/x.svg';
import update from '../assets/refresh.svg';


export default function CityTiles(props) {
  const { location, userId } = props;
  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState("");
  const [saveToast, setSaveToast] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);
  const WEATHER = '6e2be62a9f1a155511be452f1503f94e';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER}&units=imperial`;

 /*
 Gets data from our api for all saved cities and then get data from openweather api for latest weather
 */
  useEffect(() => {
    axios.get(`http://localhost:8090/users/${userId}/cities`)
      .then(({ data }) => {
        if (data) {
          const cityNamesPromise = data.map(d => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${d.cityName}&appid=${WEATHER}&units=imperial`;
            return axios.get(url);

          });
          Promise.all(cityNamesPromise).then((responses) => {
            setCities(responses.map((it, index1) => {
              it.data.cityId = data[index1].cityId;
              return it.data;

            }));
          })
        }

      });
  }, [userId]);



  //gets weather from weatherAPI and saves it in cities state
  useEffect(() => {
    if (location === '') {
      console.log('no location');
    } else if (cities.filter(it => it.name.toLowerCase() === location.toLowerCase()).length) {
      setMessage('same  location exists');
    }
    else {
      axios
        .get(url)
        .then((response) => {
          console.log('weather response data', response.data);
          setCities([...cities, response.data]);
        })
        .catch((error) => {
          console.log("herere")
          setMessage(`Error, can't get ${location}'s weather!, Please provide a correct(full) name`);
        });
    }
  }, [props]);


 //Saves city names to our database
  function saveCities() {
   console.log("*******************",cities);
    const cityNames = cities?.filter(city => !city.cityId).map(city => city.name);
    const payload = {
      cities: cityNames
    }
    axios.post(`http://localhost:8090/users/${userId}/cities`, payload)
      .then((response) => {
        if (response.status === 200) {
          setSaveToast(true);
            const updatedCities = cities.map(city => {
              const responseCity = response.data.filter(it=>it.cityName===city.name);
              console.log("&&&&",responseCity);
              if (responseCity.length) {
                city.cityId = responseCity[0].cityId;
              }
              console.log(city,city.cityId)
              return city;
            });
                      
         setCities(updatedCities);

        }

      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })


  }
  //maps data to card tiles
  function DashboardList() {


    const tiles = cities.map((cityprops) => {
      return <CityCard key={cityprops.id} city={cityprops} />;
    });

    return (
      <>
        {message &&
          <div>
            <p>{message}</p>
          </div>
        }

        <Row
          xs="auto"
          md="auto"
          lg="auto"
          className="text-center center--items"
        >
          {tiles}
        </Row>
        <br />
        <div className="align-center">
          <Button onClick={saveCities}>Save</Button>
        </div>

      </>
    );
  }

  //get new weather data from weather API 
  function UpdateCity(id, city) {
    console.log(`refresh weather data for ${city}...`);

    const updateURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER}&units=imperial`;

    axios
      .get(updateURL)
      .then((response) => {
        setCities((current) =>
          current.map((obj) => {
            if (obj.id === id) {
              return response.data;
            }
            return obj;
          })
        );
      })
      .catch((error) => {
        console.log(error);
        console.log(`Error, can't get ${city}'s weather!`);
      });
    return cities;
  }

  //Deletes entry from database
  function DeleteCity(city) {
    if (city.cityId) {
      //delete from db
      axios.delete(`http://localhost:8090/cities/${city.cityId}`)
        .then(({ data }) => {
          console.log("deleted City")
          setDeleteToast(true);
        });
    }
    const id = city.id;
    document.getElementById(id).remove();

    const filterCities = () => {
      setCities((current) =>
        current.filter((city) => {
          return city.id !== id;
        })
      );
    };
    filterCities();
    console.log('city deleted');
  }

  function CityCard(cityprops) {
    return (
      <Col>
        <Card
          id={cityprops.city.id}
          className="mt-1 mb-1 my--card"
          text="dark"
          border="dark"
          style={{ width: '16rem' }}
        >
          <Card.Body>
            <Card.Title className="bold m-auto spreadout" as="h1">
              <button
                className="icon"
                onClick={() => DeleteCity(cityprops.city)}
              >
                <img
                  className="icon--x"
                  src={x}
                  alt="delete {cityprops.city.name} weather tile"
                />
              </button>

              <button
                className="icon"
                onClick={() =>
                  UpdateCity(cityprops.city.id, cityprops.city.name)
                }
              >
                <img
                  className="icon--update"
                  src={update}
                  alt="update {cityprops.city.name} weather"
                />
              </button>
            </Card.Title>
            <Card.Title className="bold m-auto spreadout" as="h2">
              {cityprops.city.name}
            </Card.Title>

            {cityprops.city.main ? (
              <Card.Subtitle className="bold text-center" as="h1">
                {Math.round(cityprops.city.main.temp)}
                <sup>o</sup>
              </Card.Subtitle>
            ) : null}

            <Card.Text as="div">
              {cityprops.city.weather ? (
                <h3 className="text-center mb-0">
                  {cityprops.city.weather[0].description}
                </h3>
              ) : null}

              {cityprops.city.weather ? (
                <img
                  className="weather--icon m-auto"
                  src={`https://openweathermap.org/img/wn/${cityprops.city.weather[0].icon}@2x.png`}
                  alt="weather clouds icon"
                />
              ) : null}

              {cityprops.city.main ? (
                <p className="text-center mb-0">
                  Humidity: {Math.round(cityprops.city.main.humidity)}%
                </p>
              ) : null}

              {cityprops.city.weather ? (
                <p className="text-center mb-0">
                  Wind: {Math.round(cityprops.city.wind.speed)} mph
                </p>
              ) : null}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    );
  }

  return (<div> <Toast onClose={() => setSaveToast(false)} show={saveToast} animation={true}>
    <Toast.Header>
      <strong className="me-auto">Save Toast</strong>
    </Toast.Header>   <Toast.Body>Save Successful</Toast.Body>
  </Toast><Toast onClose={() => setDeleteToast(false)} show={deleteToast} animation={true}>
      <Toast.Header>
        <strong className="me-auto">Delete Toast</strong>
      </Toast.Header>
      <Toast.Body>Delete Successful</Toast.Body>
    </Toast> <DashboardList /></div>);
}