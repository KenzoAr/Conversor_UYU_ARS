import { useEffect, useState } from "react";
import { FaExchangeAlt, FaClock } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react"; // Aseguramos la importación de React

export default function Home() {
  const [inputValue, setInputValue] = useState<number>(0);
  const [usdRate, setUsdRate] = useState<number>(0);
  const [arsRate, setArsRate] = useState<number>(0);
  const [arsUsdRate, setArsUsdRate] = useState<number>(0);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [arsValue, setArsValue] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const fetchRates = async () => {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await response.json();

      if (data?.result === "success" && data?.rates) {
        const uyurate = data.rates.UYU;
        const arsRate = data.rates.ARS;

        setUsdRate(1 / uyurate);
        setArsRate(arsRate / uyurate);
        setArsUsdRate(arsRate); 
      } else {
        console.error("Respuesta inesperada de la API:", data);
      }
    } catch (err) {
      console.error("Error al obtener tasas:", err);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const convertir = () => {
    fetchRates();
    setUsdValue(inputValue * usdRate);
    setArsValue(inputValue * arsRate);

    const now = new Date();
    const gmt3Time = new Date(now.getTime() - 0 * 60 * 60 * 1000);
    const formattedTime = gmt3Time.toLocaleString('es-UY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setLastUpdated(formattedTime);
  };

  const ExchangeIcon = FaExchangeAlt as unknown as React.FC;

  return (
    <div className={`min-vh-100 d-flex flex-column align-items-center justify-content-center p-4 ${isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
      <div className="mb-4 text-center">
        <h1 className="fw-bold fs-3">🌎 Conversor de Moneda</h1>
      </div>

      <div className={`card shadow-lg w-100 p-4 rounded-4 ${isDarkMode ? 'bg-secondary text-white' : 'bg-white'}`} style={{ maxWidth: '420px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">Peso Uruguayo</h2>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="btn btn-outline-secondary btn-sm rounded-pill"
          >
            {isDarkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>

        <div className="mb-3">
          <input
            type="number"
            inputMode="decimal"
            className="form-control form-control-lg text-center"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value))}
            placeholder="Ingrese monto en UYU"
          />
        </div>

        <button
          onClick={convertir}
          className="btn btn-primary w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
        >
          <ExchangeIcon /> Convertir
        </button>

        <div className="list-group">
          <div className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              🇺🇸 <span className="fw-semibold">USD</span>
            </div>
            <span className="fw-bold">{usdValue.toFixed(2)}</span>
          </div>
          <div className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              🇦🇷 <span className="fw-semibold">ARS</span>
            </div>
            <span className="fw-bold">{arsValue.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4 small">
          <p className="fw-semibold">🔁 Tasas de cambio actuales:</p>
          <ul className="ps-3 mb-2">
            <li>1 UYU = {usdRate.toFixed(4)} USD</li>
            <li>1 UYU = {arsRate.toFixed(4)} ARS</li>
            <li>1 USD = {arsUsdRate.toFixed(2)} ARS</li>
          </ul>
          {lastUpdated && (
            <p className="d-flex align-items-center text-muted">
              <FaClock className="me-2" /> Actualizado: {lastUpdated}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
