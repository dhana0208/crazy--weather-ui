import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import axios from 'axios'
import Stack from 'react-bootstrap/Stack';



export default function Signup() {
  const nameRef = createRef()
  const emailRef = createRef()
  const passwordRef = createRef()
  const passwordConfirmationRef = createRef()

  const [message, setMessage] = useState(null)


  const onSubmit = ev => {



    const payload = {
      userName: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,

    }
    console.log(!payload.userName || !payload.email || !payload.password || !passwordConfirmationRef.current.value || payload.password !== passwordConfirmationRef.current.value);
    if (!payload.userName || !payload.email || !payload.password || !passwordConfirmationRef.current.value || payload.password !== passwordConfirmationRef.current.value) {

      setMessage("Invalid Form");
    } else {

      axios.post('http://localhost:8090/users', payload)
        .then(({ data }) => {

          if (data.status) {
            setMessage("Success Fully registered, Sign in to login to the application.")
            nameRef.current.value = '';
            emailRef.current.value = '';
            passwordRef.current.value = '';
            passwordConfirmationRef.current.value='';
          } else {

            setMessage(data.message);
          }


        })
    }

  }
  return (
    <div className="login-signUp-form animated FadeInDown">
      <Stack gap={3}>

        <h1 className="title">Signup:</h1>

        {message && <div className="title" >{message}</div>
        }
        <input ref={nameRef} type="text" placeholder="Full Name" />
        <input ref={emailRef} type="email" placeholder="Email Address" />
        <input ref={passwordRef} type="password" placeholder="password" />
        <input ref={passwordConfirmationRef} type="password" placeholder="confirm password" />
        <button className="btn btn-block btn-primary md3" onClick={onSubmit}>signup</button>
        <p className="message align-center">Already registered? <Link to="/">sign in</Link></p>

      </Stack>
    </div>

  )

}










