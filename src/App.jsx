import { useState, useEffect } from 'react'
import './App.css'
import Counter from './components/Counter'
import Header from './components/Header'
import { ArticleTable } from './components/ArticleTable'
import { fetchArticles, daysSinceLastFatality } from './services/articleService'
import { fetchIncidentMetadata, fetchIncidents } from './services/incidentService'
import { IncidentTable } from './components/IncidentTable'

function App() {
  const [articles, setArticles] = useState([])
  const [incidents, setIncidents] = useState([])
  const [incidentMetadata, setIncidentMetadata] = useState(null)
  const [days, setDays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(function onLoadArticles() {
    // Set days for counter
    const days = daysSinceLastFatality(articles)
    setDays(days)
  }, [articles])

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles()
        setArticles(data)
      } catch (err) {
        console.error('Error fetching articles:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, []) // Empty dependency array = runs once on mount

  useEffect(() => {
    const loadIncidents = async () => {
        try {
          const data = await fetchIncidents()
          setIncidents(data.incidents)
        } catch (err) {
          console.error('Error fetching incidents:', err)
          setError(err)
        } finally {
          setLoading(false)
        }
      }

      loadIncidents()
  }, []) // Empty dependency array = runs once on mount

  useEffect(() => {
    const loadIncidentMetadata = async () => {
        try {
          const data = await fetchIncidentMetadata()
          setIncidentMetadata(data)
        } catch (err) {
          console.error('Error fetching incidents:', err)
          setError(err)
        } finally {
          setLoading(false)
        }
      }

      loadIncidentMetadata()
  }, []) // Empty dependency array = runs once on mount

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading articles: {error.message}</div>

  return (
    <>
      <Header />
      <Counter days={incidentMetadata?.number_of_days_since_last_incident ?? 0} />
      {/* <ArticleTable articles={articles} /> */}
      <IncidentTable incidents={incidents} />
    </>
  )
}

export default App
