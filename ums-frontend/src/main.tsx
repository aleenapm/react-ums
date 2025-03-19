import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import {PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer/>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App/>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
