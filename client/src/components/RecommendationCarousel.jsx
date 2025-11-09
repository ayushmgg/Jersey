import { useQuery } from 'react-query'
import api from '../utils/api'
import JerseyCard from './JerseyCard'
import './RecommendationCarousel.css'

const RecommendationCarousel = ({ title = 'Recommended for You', limit = 10 }) => {
  const { data, isLoading, error } = useQuery(
    ['recommendations', limit],
    async () => {
      const response = await api.get(`/recommendations?limit=${limit}`)
      return response.data
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    }
  )

  if (isLoading) {
    return (
      <section className="recommendation-section">
        <h2 className="section-title">{title}</h2>
        <div className="loading-jerseys">Loading recommendations...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="recommendation-section">
        <h2 className="section-title">{title}</h2>
        <div className="error-message">
          Failed to load recommendations. Showing popular jerseys instead.
        </div>
      </section>
    )
  }

  const recommendations = data?.data || []
  const jerseys = recommendations.map(rec => rec.jersey || rec)

  if (jerseys.length === 0) {
    return null
  }

  return (
    <section className="recommendation-section">
      <h2 className="section-title">{title}</h2>
      <div className="jersey-grid">
        {jerseys.map((jersey) => (
          <JerseyCard key={jersey._id} jersey={jersey} />
        ))}
      </div>
    </section>
  )
}

export default RecommendationCarousel

