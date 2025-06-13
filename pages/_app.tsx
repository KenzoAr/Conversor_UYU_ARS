import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css'; // Lugar correcto para estilos globales

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;