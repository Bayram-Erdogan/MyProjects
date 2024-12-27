import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import signInServices from '../services/signInServices';
import Notification from "../components/Notification";

const SignIn = ({ setUser }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      const { token } = await signInServices.signIn({ username, password });
      localStorage.setItem('authToken', token);
      console.log('Token:', token);
      setUser({ username });
      setUsername('');
      setPassword('');
      navigate('/admin');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="sign-in ">
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button text={'Sign in'} />
      </form>
      <Notification message={errorMessage} />
    </div>
  );
};

export default SignIn;
