import { useState, useEffect } from 'react'
import './App.css'
import Counter from './components/Counter'
import Header from './components/Header'
import Box from '@mui/material/Box';
import { fetchIncidentMetadata, fetchIncidents } from './services/incidentService'
import { IncidentTable } from './components/IncidentTable'
import { IncidentMap } from './components/IncidentMap'
import { FilterBar, NEIGHBORHOOD_OPTIONS } from './components/FilterBar'

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
  const [clickedIncidentId, setClickedIncidentId] = useState(null)
  const [neighborhood, setNeighborhood] = useState(NEIGHBORHOOD_OPTIONS[0])

  const pageSize = 20

  useEffect(() => {
    const loadIncidents = async () => {
        setIncidentTableLoading(true)
        try {
          const data = await fetchIncidents({ neighborhood }, 1, pageSize)
          setIncidents(data.incidents)
          setTotalIncidents(data.totalIncidents)
          setIncidentTablePage(0)
          shittyCache.set(`${neighborhood}|1`, data.incidents)
        } catch (err) {
          console.error('Error fetching incidents:', err)
          setError(err)
        } finally {
          setLoading(false)
          setIncidentTableLoading(false)
        }
      }

      loadIncidents()
  }, [neighborhood])

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
    const cacheKey = `${neighborhood}|${pageParam}`
    
    // Fetch new incidents for the selected page
    setIncidentTableLoading(true)
    if (shittyCache.has(cacheKey)) {
      const cachedIncidents = shittyCache.get(cacheKey)
      setIncidents(cachedIncidents)
    } else {
      // Get from backend
      const newIncidents = await fetchIncidents({ neighborhood }, pageParam, pageSize)
      setIncidents(newIncidents.incidents)
      setTotalIncidents(newIncidents.totalIncidents)
      
      // Set cache
      shittyCache.set(cacheKey, newIncidents.incidents)
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
        height: 750,
        padding: 2,
      }}>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <IncidentMap
            incidents={incidents}
            hoveredIncidentId={hoveredIncidentId}
            onMarkerHover={setHoveredIncidentId}
            clickedIncidentId={clickedIncidentId}
            setClickedIncidentId={setClickedIncidentId}
          />
        </Box>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <FilterBar neighborhood={neighborhood} setNeighborhoodFilter={setNeighborhood} incidentTableLoading={incidentTableLoading}></FilterBar>
          <IncidentTable
            loading={incidentTableLoading}
            incidents={incidents}
            page={incidentTablePage}
            pageSize={pageSize}
            totalIncidents={totalIncidents}
            onPageChange={onPageChange}
            hoveredIncidentId={hoveredIncidentId}
            onHoverChange={setHoveredIncidentId}
            setClickedIncidentId={setClickedIncidentId}
          />
        </Box>
      </Box>
      {/* <ArticleTable articles={articles} /> */}
    </>
  )
}

export default App
