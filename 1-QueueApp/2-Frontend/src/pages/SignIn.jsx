import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import signInServices from '../services/signInService';
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
    <div className="sign-in-container">
      <div className="sign-in-form-container">
        <h1>Sign In</h1>
        <Notification message={errorMessage} />
        <form onSubmit={handleSignIn}>
          <div>
            <input
              type="text"
              value={username}
              name="Username"
              placeholder="Username"
              className="sign-in-input"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              name="Password"
              placeholder="Password"
              className="sign-in-input"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button text="Sign In" />
        </form>
      </div>
    </div>

  );
};

export default SignIn;
