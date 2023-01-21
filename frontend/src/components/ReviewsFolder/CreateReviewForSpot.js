import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { thunkCreateReviewForSpot } from "../../store/reviewReducer";
import { thunkLoadOneSpot } from "../../store/spotReducer";
import './CreateReviewForSpot.css'

const CreateReviewForSpots = ({spotId, copySessionUser }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(1);
    const [errors, setErrors] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const { closeModal } = useModal();
    const userObj = {User: {...copySessionUser.user}}
    let reviews = useSelector((state) => state.reviews);
    let reviewsArr = Object.values(reviews)


    useEffect(() => {
        const newErrors = [];
        reviewsArr.forEach(review => {
            if (review.User.id === copySessionUser.user.id) {
                newErrors.push(<li className="cannot-submit-text">Cannot submit another review</li>);
                setIsButtonDisabled(true)
            }
        })
        setErrors(newErrors)
    }, [reviews, copySessionUser.user.id, reviewsArr])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const reviewDetails = {
            review,
            stars
        };

        return await dispatch(thunkCreateReviewForSpot(reviewDetails, spotId, userObj))
            .then(() => history.push(`/spots/${spotId}`))
            .then(setIsLoaded(true))
            .then(() => closeModal())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors)
            });

    }

    useEffect(() => {
        dispatch(thunkLoadOneSpot(spotId))
        setIsLoaded(false);

    }, [dispatch, spotId, isLoaded]);

    return (
        <div className="create-review-container">
            <div className="x-button" onClick={closeModal}>X</div>
            <h2 className="create-review-header">Leave Review</h2>
                <form
                    className="review-form-container"
                    onSubmit={handleSubmit}
                >
                    <ul className="review-error-map">
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    <div className="review-input-container">
                    <label>
                        Review:
                        <input
                            type='text'
                            name='review'
                            value={review}
                            placeholder='Enter a review'
                            onChange={(e) => setReview(e.target.value)}
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
                    <button disabled={isButtonDisabled} type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default CreateReviewForSpots;
