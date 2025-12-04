import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Upload, Activity, Brain, FileText, AlertTriangle, CheckCircle2, Loader2, ScanLine, User, Calendar, Clock, ChevronRight } from 'lucide-react'

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

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div style={styles.layout}>
      {/* SIDEBAR GAUCHE - Navigation */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}><Brain size={24} /></div>
          <span>Neuro<span style={styles.textAccent}>Vision</span></span>
        </div>
        <nav style={styles.navMenu}>
          <div style={{...styles.navItem, ...styles.navItemActive}}><ScanLine size={20} /> Diagnostic IA</div>
          <div style={styles.navItem}><User size={20} /> Patients</div>
          <div style={styles.navItem}><Calendar size={20} /> Historique</div>
          <div style={styles.navItem}><Activity size={20} /> Monitoring</div>
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.doctorCard}>
            <div style={styles.doctorAvatar}>Dr</div>
            <div style={styles.doctorInfo}>
              <span style={styles.doctorName}>Dr. Bouzekraoui</span>
              <span style={styles.doctorRole}>Radiologue</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main style={styles.mainContent}>
        <header style={styles.topBar}>
          <div style={styles.breadcrumbs}>
            <span style={styles.textMuted}>Système</span>
            <ChevronRight size={14} style={styles.textMuted} />
            <span style={styles.textWhite}>Analyse Tumeur Cérébrale</span>
          </div>
          <div style={styles.statusIndicator}>
            <span style={styles.dotOnline}></span>
            Système en ligne v2.4
          </div>
        </header>

        <div style={styles.dashboardGrid}>
          {/* COLONNE 1 : SÉLECTION & APERÇU */}
          <section style={styles.panel}>
            <div style={styles.panelHeader}>
              <Upload size={18} style={{ color: '#00d4ff' }} />
              <h3 style={styles.panelTitle}>Source Imagerie</h3>
            </div>
            <div style={styles.panelBody}>
              <div 
                style={{
                  ...styles.uploadZone,
                  ...(preview ? styles.uploadZoneHasFile : {}),
                  cursor: result ? 'default' : 'pointer'
                }}
                onClick={() => !result && fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  hidden
                  accept="image/*"
                />
                {preview ? (
                  <div style={styles.previewContainer}>
                    <img src={preview} alt="Scan" style={styles.scanImage} />
                    <div style={styles.scanOverlay}></div>
                  </div>
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <div style={styles.uploadIconCircle}><Upload size={32} /></div>
                    <p style={styles.uploadText}>
                      Glisser le fichier DICOM ou <span style={styles.textAccent}>cliquer pour parcourir</span>
                    </p>
                    <span style={styles.uploadSubtext}>Supporte JPG, PNG, DCM</span>
                  </div>
                )}
              </div>

              <div style={styles.patientInfoBox}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>ID Patient</span>
                  <span style={styles.infoValue}>{patientData.id}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Date</span>
                  <span style={styles.infoValue}>{patientData.date}</span>
                </div>
              </div>

              {!result ? (
                <button
                  style={{
                    ...styles.btnPrimary,
                    ...((!selectedFile || loading) ? styles.btnDisabled : {})
                  }}
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Analyse des tenseurs...
                    </>
                  ) : (
                    "Lancer le Diagnostic"
                  )}
                </button>
              ) : (
                <button
                  style={styles.btnPrimary}
                  onClick={handleReset}
                >
                  <Upload size={18} /> Nouvelle Analyse
                </button>
              )}

              {error && (
                <div style={styles.errorMsg}>
                  <AlertTriangle size={16}/> {error}
                </div>
              )}
            </div>
          </section>

          {/* COLONNE 2 : RÉSULTATS & ANALYTIQUE */}
          <section style={styles.panel}>
            <div style={styles.panelHeader}>
              <Activity size={18} style={{ color: '#00d4ff' }} />
              <h3 style={styles.panelTitle}>Rapport d'Analyse</h3>
            </div>
            <div style={{...styles.panelBody, ...styles.scrollable}}>
              {!result ? (
                <div style={styles.emptyState}>
                  <ScanLine size={64} strokeWidth={1} />
                  <p style={styles.emptyStateText}>En attente de traitement...</p>
                  <span style={styles.emptyStateSubtext}>Veuillez charger une image pour commencer l'analyse.</span>
                </div>
              ) : (
                <div style={styles.resultContainer}>
                  {/* 1. STATUS HEADER */}
                  <div style={{
                    ...styles.diagnosticBanner,
                    ...(result.confidence > 0.8 ? styles.bannerSafe : styles.bannerWarning)
                  }}>
                    <div style={styles.bannerIcon}>
                      {result.confidence > 0.8 ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
                    </div>
                    <div style={styles.bannerText}>
                      <span style={styles.bannerTitle}>
                        {result.confidence > 0.8 ? "Diagnostic Haute Confiance" : "Diagnostic Incertain"}
                      </span>
                      <span style={styles.bannerSubtitle}>
                        Validation par le modèle CNN v4
                      </span>
                    </div>
                    <div style={styles.confidenceScore}>
                      <span style={styles.scoreLabel}>Confiance</span>
                      <span style={styles.scoreValue}>{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* 2. GRID DETAILS */}
                  <div style={styles.metricsGrid}>
                    <div style={styles.metricCard}>
                      <span style={styles.metricLabel}>Classification</span>
                      <span style={styles.metricValue}>{result.tumor_class}</span>
                    </div>
                    <div style={styles.metricCard}>
                      <span style={styles.metricLabel}>Temps de calcul</span>
                      <span style={styles.metricValueMono}>0.42s</span>
                    </div>
                    <div style={styles.metricCard}>
                      <span style={styles.metricLabel}>Résolution</span>
                      <span style={styles.metricValueMono}>224x224</span>
                    </div>
                  </div>

                  {/* 3. VISUALISATION AVANCÉE */}
                  <div style={styles.visualizationSection}>
                    <h4 style={styles.visTitle}>Segmentation IA</h4>
                    <div style={styles.xrayContainer}>
                      {result.image ? (
                        <img 
                          src={`data:image/jpeg;base64,${result.image.replace("data:image/jpeg;base64,", "")}`}
                          alt="AI Analysis" 
                          style={styles.resultImage}
                        />
                      ) : (
                        <div style={styles.noVis}>Pas de visualisation disponible</div>
                      )}
                      <svg style={styles.overlaySvg} width="100%" height="100%">
                        <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="rgba(255,255,255,0.2)" strokeDasharray="5,5" />
                      </svg>
                    </div>
                    <p style={styles.visCaption}>
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

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: '280px',
    background: 'rgba(10, 14, 39, 0.95)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '48px',
  },
  brandIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #00d4ff, #0066ff)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAccent: {
    color: '#00d4ff',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  navItemActive: {
    background: 'rgba(0, 212, 255, 0.1)',
    color: '#00d4ff',
    borderLeft: '3px solid #00d4ff',
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  doctorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  doctorAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00d4ff, #0066ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },
  doctorInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  doctorName: {
    fontSize: '14px',
    fontWeight: '600',
  },
  doctorRole: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  mainContent: {
    flex: 1,
    padding: '24px',
    overflow: 'auto',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  textMuted: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  textWhite: {
    color: '#ffffff',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dotOnline: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#00ff88',
    boxShadow: '0 0 10px #00ff88',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '24px',
  },
  panel: {
    background: 'rgba(26, 31, 58, 0.6)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  panelTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
  },
  panelBody: {
    padding: '24px',
  },
  scrollable: {
    maxHeight: '600px',
    overflowY: 'auto',
  },
  uploadZone: {
    border: '2px dashed rgba(0, 212, 255, 0.3)',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    transition: 'all 0.3s',
    minHeight: '280px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadZoneHasFile: {
    border: '2px solid rgba(0, 212, 255, 0.5)',
    padding: '0',
  },
  uploadPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  uploadIconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(0, 212, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#00d4ff',
  },
  uploadText: {
    fontSize: '14px',
    margin: 0,
  },
  uploadSubtext: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  previewContainer: {
    position: 'relative',
    width: '100%',
    height: '280px',
  },
  scanImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, transparent 60%, rgba(0, 212, 255, 0.1) 100%)',
    borderRadius: '12px',
  },
  patientInfoBox: {
    marginTop: '24px',
    padding: '16px',
    background: 'rgba(0, 212, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 212, 255, 0.2)',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
  },
  infoLabel: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  infoValue: {
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    marginTop: '20px',
    background: 'linear-gradient(135deg, #00d4ff, #0066ff)',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  errorMsg: {
    marginTop: '16px',
    padding: '12px',
    background: 'rgba(255, 59, 48, 0.1)',
    border: '1px solid rgba(255, 59, 48, 0.3)',
    borderRadius: '8px',
    color: '#ff3b30',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  emptyStateText: {
    marginTop: '24px',
    fontSize: '16px',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  diagnosticBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid',
  },
  bannerSafe: {
    background: 'rgba(0, 255, 136, 0.1)',
    borderColor: 'rgba(0, 255, 136, 0.3)',
    color: '#00ff88',
  },
  bannerWarning: {
    background: 'rgba(255, 159, 10, 0.1)',
    borderColor: 'rgba(255, 159, 10, 0.3)',
    color: '#ff9f0a',
  },
  bannerIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  bannerTitle: {
    fontSize: '16px',
    fontWeight: '600',
  },
  bannerSubtitle: {
    fontSize: '12px',
    opacity: 0.7,
  },
  confidenceScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: '11px',
    opacity: 0.7,
  },
  scoreValue: {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  metricCard: {
    padding: '16px',
    background: 'rgba(0, 212, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  metricLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #00d4ff, #0066ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  metricValueMono: {
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  visualizationSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  visTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
  },
  xrayContainer: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(0, 212, 255, 0.3)',
  },
  resultImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  noVis: {
    padding: '80px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  overlaySvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
  visCaption: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    margin: 0,
  },
}

export default App