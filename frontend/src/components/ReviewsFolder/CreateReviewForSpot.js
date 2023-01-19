import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { thunkCreateReviewForSpot } from "../../store/reviewReducer";
import { thunkLoadOneSpot } from "../../store/spotReducer";

const CreateReviewForSpots = ({spotId, spotById, reviews}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(1);
    const [errors, setErrors] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const reviewDetails = {
            review,
            stars
        };

        const createNewReview = await dispatch(thunkCreateReviewForSpot(reviewDetails, spotId, spotById, reviews))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors)
        });

        setIsLoaded(true)
        history.push(`/spots/${spotId}`)
        closeModal();

    }

    useEffect(() => {
        dispatch(thunkLoadOneSpot(spotId))
    }, [dispatch, spotId,isLoaded])


    return (
        <>
            <h1>Leave A Review</h1>
            <form
                className="create-review-form"
                onSubmit={handleSubmit}
            >
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <label>
                    Review:
                    <input
                        type='text'
                        name='review'
                        value={review}
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
                {/* <select name="stars-select" > */}
                    {/* <option value="" hidden>--Please choose a rating--</option>
                    <option
                        value={1}
                        onChange={(e) => setStars(e.target.value)}
                    >
                        1
                    </option>
                    <option
                        value={2}
                        onChange={(e) => setStars(e.target.value)}
                    >
                        2
                    </option>
                    <option
                        value={3}
                        onChange={(e) => setStars(e.target.value)}
                    >
                        3
                    </option>
                    <option
                        value={4}
                        onChange={(e) => setStars(e.target.value)}
                    >
                        4
                    </option>
                    <option
                        value={5}
                        onChange={(e) => setStars(e.target.value)}
                    >
                        5
                    </option> */}
                {/* </select> */}
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default CreateReviewForSpots;
