import React, { useState } from 'react';
   import { login } from '../services/api';
   import { useHistory } from 'react-router-dom';

   const Login = () => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const history = useHistory();

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         const response = await login(username, password);
         localStorage.setItem('token', response.data.token);
         history.push('/dashboard');
       } catch (error) {
         console.error('Login failed:', error);
       }
     };

     return (
       <form onSubmit={handleSubmit}>
         <input
           type="text"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
           placeholder="Username"
         />
         <input
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           placeholder="Password"
         />
         <button type="submit">Login</button>
       </form>
     );
   };

   export default Login;