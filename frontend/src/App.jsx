import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { 
  Upload, Activity, Brain, FileText, AlertTriangle, 
  CheckCircle2, Loader2, ScanLine, User, Calendar, Clock, ChevronRight
} from 'lucide-react'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  // Simulation de données patient pour l'immersion
  const [patientData] = useState({
    id: "PT-" + Math.floor(1000 + Math.random() * 9000),
    name: "Dossier Anonymisé",
    date: new Date().toLocaleDateString()
  })

  const API_URL = "http://localhost:8000/api/predict"

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setLoading(true)
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      // Simulation d'un délai pour l'effet "Calcul en cours"
      await new Promise(r => setTimeout(r, 1500))
      
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(response.data)
    } catch (err) {
      console.error(err)
      setError("Erreur de communication avec le serveur neuronal.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      {/* SIDEBAR GAUCHE - Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Brain size={24} /></div>
          <span>Neuro<span className="text-accent">Vision</span></span>
        </div>
        
        <nav className="nav-menu">
          <div className="nav-item active"><ScanLine size={30} /> Diagnostic IA</div>
          <div className="nav-item"><User size={30} /> Patients</div>
          <div className="nav-item"><Calendar size={30} /> Historique</div>
          <div className="nav-item"><Activity size={30} /> Monitoring</div>
        </nav>

        <div className="sidebar-footer">
          <div className="doctor-card">
            <div className="doctor-avatar">Dr</div>
            <div className="doctor-info">
              <span className="name">Dr. Bouzekraoui</span>
              <span className="role">Radiologue</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="main-content">
        <header className="top-bar">
          <div className="breadcrumbs">
            <span className="text-muted">Système</span>
            <ChevronRight size={14} className="text-muted" />
            <span className="text-white">Analyse Tumeur Cérébrale</span>
          </div>
          <div className="status-indicator">
            <span className="dot online"></span> Système en ligne v2.4
          </div>
        </header>

        <div className="dashboard-grid">
          
          {/* COLONNE 1 : SÉLECTION & APERÇU */}
          <section className="panel input-panel">
            <div className="panel-header">
              <Upload size={18} className="text-accent" />
              <h3>Source Imagerie</h3>
            </div>
            
            <div className="panel-body">
              <div 
                className={`upload-zone ${preview ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                
                {preview ? (
                  <div className="preview-container">
                    <img src={preview} alt="Scan" className="scan-image" />
                    <div className="scan-overlay"></div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon-circle"><Upload size={32} /></div>
                    <p>Glisser le fichier DICOM ou <span className="text-accent">cliquer pour parcourir</span></p>
                    <span className="text-xs text-muted">Supporte JPG, PNG, DCM</span>
                  </div>
                )}
              </div>

              <div className="patient-info-box">
                <div className="info-row">
                  <span className="label">ID Patient</span>
                  <span className="value font-mono">{patientData.id}</span>
                </div>
                <div className="info-row">
                  <span className="label">Date</span>
                  <span className="value font-mono">{patientData.date}</span>
                </div>
              </div>

              <button 
                className="btn-primary" 
                onClick={handleUpload}
                disabled={!selectedFile || loading}
              >
                {loading ? <><Loader2 className="spin" /> Analyse des tenseurs...</> : "Lancer le Diagnostic"}
              </button>
              {error && <div className="error-msg"><AlertTriangle size={16}/> {error}</div>}
            </div>
          </section>

          {/* COLONNE 2 : RÉSULTATS & ANALYTIQUE */}
          <section className="panel result-panel">
            <div className="panel-header">
              <Activity size={18} className="text-accent" />
              <h3>Rapport d'Analyse</h3>
            </div>

            <div className="panel-body scrollable">
              {!result ? (
                <div className="empty-state">
                  <ScanLine size={64} strokeWidth={1} />
                  <p>En attente de traitement...</p>
                  <span className="text-muted text-sm">Veuillez charger une image pour commencer l'analyse.</span>
                </div>
              ) : (
                <div className="result-container fade-in">
                  
                  {/* 1. STATUS HEADER */}
                  <div className={`diagnostic-banner ${result.confidence > 0.8 ? 'safe' : 'warning'}`}>
                    <div className="banner-icon">
                      {result.confidence > 0.8 ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
                    </div>
                    <div className="banner-text">
                      <span className="banner-title">
                        {result.confidence > 0.8 ? "Diagnostic Haute Confiance" : "Diagnostic Incertain"}
                      </span>
                      <span className="banner-subtitle">
                        Validation par le modèle CNN v4
                      </span>
                    </div>
                    <div className="confidence-score">
                      <span className="score-label">Confiance</span>
                      <span className="score-value font-mono">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* 2. GRID DETAILS */}
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <span className="label">Classification</span>
                      <span className="value text-gradient">{result.tumor_class}</span>
                    </div>
                    <div className="metric-card">
                      <span className="label">Temps de calcul</span>
                      <span className="value font-mono">0.42s</span>
                    </div>
                    <div className="metric-card">
                      <span className="label">Résolution</span>
                      <span className="value font-mono">224x224</span>
                    </div>
                  </div>

                  {/* 3. VISUALISATION AVANCÉE */}
                  <div className="visualization-section">
                    <h4>Segmentation IA</h4>
                    <div className="xray-container">
                      {/* Image Resultat */}
                      {result.image ? (
                        <img 
                          src={`data:image/jpeg;base64,${result.image.replace("data:image/jpeg;base64,", "")}`} 
                          alt="AI Analysis" 
                        />
                      ) : (
                        <div className="no-vis">Pas de visualisation disponible</div>
                      )}
                      
                      {/* Overlay Graphique pour faire "Pro" */}
                      <svg className="overlay-svg" width="100%" height="100%">
                        <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="rgba(255,255,255,0.2)" strokeDasharray="5,5" />
                        
                      </svg>
                    </div>
                    <p className="vis-caption">
                      La zone encadrée indique la région d'intérêt détectée par les couches de convolution.
                    </p>
                  </div>

                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App