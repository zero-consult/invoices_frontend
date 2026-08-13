import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from "react-redux";
import store from "./redux/store.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store.store}>
          <PersistGate loading={null} persistor={store.persistor}>
              <App/>
          </PersistGate>
      </Provider>
  </StrictMode>,
)
