import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { createRef } from "react";
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Login() {


  const emailRef = createRef()
  const passwordRef = createRef()
  const [message, setMessage] = useState(null)
  const navigate = useNavigate();

  const onSubmit = ev => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,

    }
    axios.post('http://localhost:8090/users/login', payload)
      .then(({ data }) => {


        if (data.status) {
          console.log("data")

          navigate("/dashboard", { state: { userName: data.userName, userId: data.userId } });
        } else {
          setMessage(data.message);
        }

      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })


  }











  return (
     <fieldset>
     <Stack gap={3}>
        {message &&
          <div className="message">
            <p>{message}</p>
          </div>
        }

        <h1>Login to your Crazy Weather App</h1>
        <div>
          <label htmlFor="staticEmail2">Email</label>
          <input ref={emailRef} type="text" className="form-control" placeholder="Email" />
        </div>
        <div>
          <label htmlFor="inputPassword2">Password</label>
          <input ref={passwordRef} type="password" className="form-control" placeholder="password" />
        </div>
        <div className="text-center">
            <Button  variant="primary" onClick={onSubmit}>Confirm</Button>
        </div>
        <div className="text-center">
          <p className="message">Not Registered? <Link to="/signup">create an account</Link></p>
        </div>

      </Stack>
          </fieldset>
    
  )

}