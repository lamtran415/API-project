import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { thunkLoadReviewsForSpot, thunkUpdateReviewForSpot } from "../../store/reviewReducer";
import { thunkLoadOneSpot } from "../../store/spotReducer";

const UpdateReviewForSpot = ({review}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [editReview, setEditReview] = useState(review.review);
    const [stars, setStars] = useState(review.stars);
    const [errors, setErrors] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])

        const reviewDetails = {
            id: review.id,
            review: editReview,
            stars
        }

        return await dispatch(thunkUpdateReviewForSpot(reviewDetails, review.id))
            .then(() => history.push(`/spots/${review.spotId}`))
            .then(setIsLoaded(true))
            .then(() => closeModal())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors)
            });
    }

    useEffect(() => {
        dispatch(thunkLoadOneSpot(review.spotId))
        dispatch(thunkLoadReviewsForSpot(review.spotId))
        setIsLoaded(false)
    }, [dispatch, review.spotId, isLoaded])

    return(
        <div className="create-review-container">
            <h3 className="create-review-header"><div className="x-button" onClick={closeModal}>X</div><span>Leave Review</span></h3>
                <form
                    className="review-form-container"
                    onSubmit={handleSubmit}
                >
                    <ul className="review-error-map">
                        {errors.map((error) => <li key={error}>{error}</li>)}
                    </ul>
                    <div className="review-input-container">
                    <label>
                        Review:
                        <input
                            type='text'
                            name='review'
                            value={editReview}
                            placeholder='Enter a review'
                            onChange={(e) => setEditReview(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Star Rating:
                        <input
                            type='number'
                            value={stars}
                            onChange={(e) => setStars(e.target.value)}
                            max='5'
                            min='1'
                            required
                        />
                    </label>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateReviewForSpot
