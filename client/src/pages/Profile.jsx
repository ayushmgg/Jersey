import { useQuery } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import RecommendationCarousel from '../components/RecommendationCarousel'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()

  const { data: interactions, isLoading } = useQuery(
    'user-interactions',
    async () => {
      const response = await api.get('/interactions/me?limit=50')
      return response.data.data
    }
  )

  const purchases = interactions?.filter(i => i.type === 'purchase') || []
  const cartItems = interactions?.filter(i => i.type === 'cart') || []
  const views = interactions?.filter(i => i.type === 'view') || []

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="user-info">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{views.length}</h3>
          <p>Jerseys Viewed</p>
        </div>
        <div className="stat-card">
          <h3>{cartItems.length}</h3>
          <p>In Cart</p>
        </div>
        <div className="stat-card">
          <h3>{purchases.length}</h3>
          <p>Purchases</p>
        </div>
      </div>

      {purchases.length > 0 && (
        <section className="purchases-section">
          <h2>Recent Purchases</h2>
          <div className="interactions-list">
            {purchases.slice(0, 10).map((interaction) => (
              <div key={interaction._id} className="interaction-item">
                {interaction.jerseyId && (
                  <>
                    <img
                      src={interaction.jerseyId.imageUrl || 'https://via.placeholder.com/100'}
                      alt={interaction.jerseyId.team}
                      className="interaction-image"
                    />
                    <div className="interaction-info">
                      <h4>{interaction.jerseyId.team}</h4>
                      {interaction.jerseyId.player && <p>{interaction.jerseyId.player}</p>}
                      <p className="interaction-date">
                        {new Date(interaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <RecommendationCarousel title="Recommended for You" limit={10} />
    </div>
  )
}

export default Profile

