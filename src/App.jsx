import { useState, useEffect } from 'react'
import './App.css'
import Counter from './components/Counter'
import Header from './components/header'
import { ArticleTable } from './components/ArticleTable'
import { fetchArticles, daysSinceLastFatality } from './services/articleService'

function App() {
  const [articles, setArticles] = useState([])
  const [days, setDays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(function onLoadArticles() {
    // Set days for counter
    const days = daysSinceLastFatality(articles)
    setDays(days)
    console.log('we have set the days to be', days)
  }, [articles])

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles()
        console.log('articles :>> ', data)
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading articles: {error.message}</div>

  return (
    <>
      <Header />
      <Counter days={days} />
      <ArticleTable articles={articles} />
    </>
  )
}

export default App
