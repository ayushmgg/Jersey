import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../utils/api'
import RecommendationCarousel from '../components/RecommendationCarousel'
import './JerseyDetails.css'

const JerseyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(
    ['jersey', id],
    async () => {
      const response = await api.get(`/jerseys/${id}`)
      return response.data.data
    }
  )

  const recordInteraction = useMutation(
    async (type) => {
      await api.post('/interactions', {
        jerseyId: id,
        type,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recommendations'])
      },
    }
  )

  useEffect(() => {
    if (id) {
      recordInteraction.mutate('view')
    }
  }, [id])

  const handleAddToCart = () => {
    recordInteraction.mutate('cart')
    alert('Added to cart!')
  }

  const handlePurchase = () => {
    recordInteraction.mutate('purchase')
    alert('Purchase successful!')
  }

  if (isLoading) {
    return <div className="loading">Loading jersey details...</div>
  }

  if (!data) {
    return <div className="error">Jersey not found</div>
  }

  return (
    <div className="jersey-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="jersey-details">
        <div className="jersey-image-large">
          <img
            src={data.imageUrl || 'https://via.placeholder.com/500x600'}
            alt={data.team}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x600'
            }}
          />
        </div>

        <div className="jersey-info-large">
          <h1>{data.team}</h1>
          {data.player && <h2>{data.player}</h2>}
          <p className="category">{data.category}</p>
          <p className="price">${data.price}</p>
          {data.description && <p className="description">{data.description}</p>}

          <div className="action-buttons">
            <button onClick={handleAddToCart} className="btn-cart">
              Add to Cart
            </button>
            <button onClick={handlePurchase} className="btn-purchase">
              Purchase
            </button>
          </div>

          <div className="stock-info">
            {data.inStock ? (
              <span className="in-stock">✓ In Stock</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>
        </div>
      </div>

      <RecommendationCarousel title="You May Also Like" limit={8} />
    </div>
  )
}

export default JerseyDetails

