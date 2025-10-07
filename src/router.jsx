import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Signin } from './components/Signin';
import Signup from './components/Signup';
 import ForgotPassword from './components/ForgotPassword'; 
 import ResetPassword from './components/ResetPassword';

export const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Signin /> },
 { path: '/forgot-password', element: <ForgotPassword /> },
   { path: '/reset-password', element: <ResetPassword/> },
]);
