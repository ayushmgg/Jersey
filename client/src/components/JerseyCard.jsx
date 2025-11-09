import { Link } from 'react-router-dom'
import './JerseyCard.css'

const JerseyCard = ({ jersey }) => {
  return (
    <Link to={`/jerseys/${jersey._id || jersey.jersey?._id}`} className="jersey-card">
      <div className="jersey-image">
        <img 
          src={jersey.imageUrl || jersey.jersey?.imageUrl || 'https://via.placeholder.com/300x400'} 
          alt={jersey.team || jersey.jersey?.team}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400'
          }}
        />
      </div>
      <div className="jersey-info">
        <h3 className="jersey-team">{jersey.team || jersey.jersey?.team}</h3>
        {jersey.player && <p className="jersey-player">{jersey.player}</p>}
        <p className="jersey-category">{jersey.category || jersey.jersey?.category}</p>
        <p className="jersey-price">${jersey.price || jersey.jersey?.price}</p>
        {jersey.reason && (
          <span className="recommendation-badge">{jersey.reason}</span>
        )}
      </div>
    </Link>
  )
}

export default JerseyCard

