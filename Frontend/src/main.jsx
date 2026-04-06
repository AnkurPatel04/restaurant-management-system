import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { StoreContextProvider } from './context/StoreContext.jsx';
import 'react-toastify/dist/ReactToastify.css';
// import AxiosProvider from './util/AxiosProvider.jsx';
createRoot(document.getElementById('root')).render(

  <BrowserRouter>
  {/* <AxiosProvider> */}
  <StoreContextProvider>

    <App />
  </StoreContextProvider>
  {/* </AxiosProvider> */}
  </BrowserRouter>
)
