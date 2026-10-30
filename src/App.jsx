import { useState, useEffect } from 'react'
import './App.css'
import Counter from './components/Counter'
import Header from './components/Header'
import Box from '@mui/material/Box';
import { fetchIncidentMetadata, fetchIncidents } from './services/incidentService'
import { IncidentTable } from './components/IncidentTable'
import { IncidentMap } from './components/IncidentMap'
import { FilterBar } from './components/FilterBar'
import { ALL } from './utils/constants';

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
  const [neighborhood, setNeighborhood] = useState(ALL)
  const [severity, setSeverityFilter] = useState(ALL)

  const pageSize = 20
  const getCacheKey = () => `${severity}${neighborhood}${incidentTablePage}`

  async function loadIncidents() {
    const cacheKey = getCacheKey()
    if(shittyCache.has(cacheKey)) {
      setIncidents(shittyCache.get(cacheKey))
      return
    }

    setIncidentTableLoading(true)
    try {
      const data = await fetchIncidents({ severity, neighborhood }, incidentTablePage + 1, pageSize)
      setIncidents(data.incidents)
      setTotalIncidents(data.totalIncidents)
      setIncidentTablePage(incidentTablePage)
      shittyCache.set(cacheKey, data.incidents)
    } catch (err) {
      console.error('Error fetching incidents:', err)
      setError(err)
    } finally {
      setLoading(false)
      setIncidentTableLoading(false)
    }
  }

  useEffect(() => {
    loadIncidents()
  }, [])

  useEffect(() => {
    loadIncidents()
  }, [severity, neighborhood, incidentTablePage])

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
          <FilterBar severity={severity} setSeverityFilter={setSeverityFilter} neighborhood={neighborhood} setNeighborhoodFilter={setNeighborhood} incidentTableLoading={incidentTableLoading}></FilterBar>
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
