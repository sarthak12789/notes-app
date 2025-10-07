import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import { Authcontextprovider } from './components/authcontext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
   
    <Authcontextprovider>
       <RouterProvider router={router}/>
    </Authcontextprovider>
  </StrictMode>,
)
