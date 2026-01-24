import { useState, useEffect } from 'react'
import './App.css'
import Counter from './components/Counter'
import Header from './components/Header'
import Box from '@mui/material/Box';
import { fetchIncidentMetadata, fetchIncidents } from './services/incidentService'
import { IncidentTable } from './components/IncidentTable'
import { IncidentMap } from './components/IncidentMap'

const shittyCache = new Map()

function App() {
  const [incidents, setIncidents] = useState([])
  const [totalIncidents, setTotalIncidents] = useState(0)
  const [days, setDays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [incidentTableLoading, setIncidentTableLoading] = useState(true)
  const [incidentTablePage, setIncidentTablePage] = useState(0)
  const [error, setError] = useState(null)
  const [hoveredIncidentId, setHoveredIncidentId] = useState(null)

  const pageSize = 20

  useEffect(() => {
    const loadIncidents = async () => {
        try {
          const data = await fetchIncidents(1, pageSize)
          setIncidents(data.incidents)
          setTotalIncidents(data.totalIncidents)
          shittyCache.set(1, data.incidents)
        } catch (err) {
          console.error('Error fetching incidents:', err)
          setError(err)
        } finally {
          setLoading(false)
          setIncidentTableLoading(false)
        }
      }

      loadIncidents()
  }, []) // Empty dependency array = runs once on mount

  useEffect(() => {
    const loadIncidentMetadata = async () => {
        try {
          const incidentMetadata = await fetchIncidentMetadata()
          const daysResponse = incidentMetadata?.number_of_days_since_last_incident ?? 0
          setDays(daysResponse)
        } catch (err) {
          console.error('Error fetching incidents:', err)
          setError(err)
        } finally {
          setLoading(false)
        }
      }

      loadIncidentMetadata()
  }, []) // Empty dependency array = runs once on mount

  const onPageChange = async (_, newPage) => {
    const pageParam = newPage + 1; // Convert zero-based to one-based index
    
    // Fetch new incidents for the selected page
    setIncidentTableLoading(true)
    if (shittyCache.has(pageParam)) {
      const cachedIncidents = shittyCache.get(pageParam)
      setIncidents(cachedIncidents)
    } else {
      // Get from backend
      const newIncidents = await fetchIncidents(pageParam, pageSize)
      setIncidents(newIncidents.incidents)
      setTotalIncidents(newIncidents.totalIncidents)
      
      // Set cache
      shittyCache.set(pageParam, newIncidents.incidents)
    }
    setIncidentTableLoading(false)
    setIncidentTablePage(newPage)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading articles: {error.message}</div>

  return (
    <>
      <Header />
      <Counter days={days} />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        alignItems: 'stretch',
        height: 500,
        padding: 2,
      }}>
        <Box sx={{ flex: 1 }}>
          <IncidentMap
            incidents={incidents}
            hoveredIncidentId={hoveredIncidentId}
            onMarkerHover={setHoveredIncidentId}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <IncidentTable
            loading={incidentTableLoading}
            incidents={incidents}
            page={incidentTablePage}
            pageSize={pageSize}
            totalIncidents={totalIncidents}
            onPageChange={onPageChange}
            hoveredIncidentId={hoveredIncidentId}
            onHoverChange={setHoveredIncidentId}
          />
        </Box>
      </Box>
      {/* <ArticleTable articles={articles} /> */}
    </>
  )
}

export default App
