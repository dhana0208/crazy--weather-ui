import React, { useState, useRef, useEffect, useContext } from 'react';
import '../App.css';
import Button from 'react-bootstrap/Button';
import CityTiles from './CityTiles.jsx';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import NavbarBrand from 'react-bootstrap/NavbarBrand';
import NavbarText from 'react-bootstrap/NavbarText'
import Stack from 'react-bootstrap/Stack';
import { useLocation, useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [location, setLocation] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userName, userId } = state || {};

  const inputLocation = useRef(null);

  useEffect(() => {
    if (!userName || !userId) {
      console.log("here")
      return navigate("/")
    }
    inputLocation.current.focus();
  }, []);

  //listens for enter key, has same effect as clicking search button
  const handleKeyDown = (event) => {
    console.log('User pressed: ', event.key);

    if (event.key === 'Enter') {
      console.log('Enter key pressed ✅');
      GetLocation();
    }
  };





  //sets location to call weather API in WeatherTile component
  function GetLocation() {
    setLocation(inputLocation.current.value);
    console.log(location);
    console.log('searching...');
  }

  function SearchBar() {
    return (
      <Stack gap={3}>
        <Form.Control
          type="search"
          ref={inputLocation}
          placeholder="Enter city"
          className="ms-0 mt-2"
          aria-label="Search"
          onKeyDown={handleKeyDown}
        />
        <Button
          className="ms-2 mt-2 myFont bold"
          gap={1}
          variant="primary"
          onClick={() => GetLocation()}
        >
          Search
        </Button>

      </Stack>
    );
  }


  return (
    <div>

      <Navbar data-bs-theme="dark" bg="dark"><Container>
      <NavbarBrand className="brand">Weather Dashboard</NavbarBrand>
      <NavbarText className="justify-content-end">Signed in as :{userName}</NavbarText>
     </Container></Navbar>

      <SearchBar />

      <div>
        <CityTiles location={location} userId={userId} />
      </div>

    </div>
  );

}