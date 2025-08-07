import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';
import App from "./components/App.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);