// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './ui/ErrorFallback.jsx'
// import { AuthProvider } from './services/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AuthProvider>
    <ErrorBoundary FallbackComponent={ErrorFallback} >
      <App />
    </ErrorBoundary>

  </AuthProvider>
  // {/* </StrictMode>, */}
)
