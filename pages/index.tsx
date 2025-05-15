import { useEffect, useState } from "react";
import axios from "axios";
import { FaExchangeAlt, FaClock } from "react-icons/fa";

type Moneda = {
  nombre: string;
  simbolo: string;
  precio: number;
};

const Home = () => {
  const [monto, setMonto] = useState<number>(1);
  const [origen, setOrigen] = useState<string>("CLP");
  const [destino, setDestino] = useState<string>("ARS");
  const [resultado, setResultado] = useState<number | null>(null);
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonedas = async () => {
      try {
        const res = await axios.get("/api/monedas");
        setMonedas(res.data.monedas);
        setLastUpdated(res.data.lastUpdated);
      } catch (error) {
        console.error("Error al obtener las monedas", error);
      }
    };

    fetchMonedas();
  }, []);

  const convertir = () => {
    const monedaOrigen = monedas.find((m) => m.simbolo === origen);
    const monedaDestino = monedas.find((m) => m.simbolo === destino);
    if (monedaOrigen && monedaDestino) {
      const valor = (monto * monedaOrigen.precio) / monedaDestino.precio;
      setResultado(valor);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Conversor de Monedas</h1>
      <div className="mb-3">
        <label className="form-label">Monto</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          className="form-control"
        />
      </div>
      <div className="row mb-3">
        <div className="col">
          <label className="form-label">Origen</label>
          <select
            className="form-select"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
          >
            {monedas.map((moneda) => (
              <option key={moneda.simbolo} value={moneda.simbolo}>
                {moneda.nombre} ({moneda.simbolo})
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="form-label">Destino</label>
          <select
            className="form-select"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          >
            {monedas.map((moneda) => (
              <option key={moneda.simbolo} value={moneda.simbolo}>
                {moneda.nombre} ({moneda.simbolo})
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={convertir}
        className="btn btn-primary w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
      >
        <FaExchangeAlt /> Convertir
      </button>
      {resultado !== null && (
        <div className="alert alert-success text-center">
          Resultado: {resultado.toFixed(2)} {destino}
        </div>
      )}
      {lastUpdated && (
        <p className="d-flex align-items-center text-muted">
          <FaClock className="me-2" /> Actualizado: {lastUpdated}
        </p>
      )}
    </div>
  );
};

export default Home;
