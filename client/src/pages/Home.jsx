import { useEffect } from 'react'
import { useQuery } from 'react-query'
import api from '../utils/api'
import RecommendationCarousel from '../components/RecommendationCarousel'
import JerseyCard from '../components/JerseyCard'
import './Home.css'

const Home = () => {
  // Fetch popular jerseys as fallback
  const { data: popularData } = useQuery(
    'popular-jerseys',
    async () => {
      const response = await api.get('/jerseys?limit=10&sort=-popularityScore')
      return response.data
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Discover Your Perfect Jersey</h1>
        <p>Personalized recommendations just for you</p>
      </div>

      <RecommendationCarousel title="Recommended for You" limit={10} />

      {popularData?.data && popularData.data.length > 0 && (
        <section className="popular-section">
          <h2 className="section-title">Popular Jerseys</h2>
          <div className="jersey-grid">
            {popularData.data.map((jersey) => (
              <JerseyCard key={jersey._id} jersey={jersey} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home

