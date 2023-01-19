import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkDeleteReview } from "../../store/reviewReducer";
import { thunkLoadReviewsForSpot } from "../../store/reviewReducer";

const DeleteReview = ({review}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);

    const handleClick = async () => {
        dispatch(thunkDeleteReview(review.id))
        setIsLoaded(true)
        history.push(`/spots/${spotId}`)
    }

    useEffect(() => {
        dispatch(thunkLoadReviewsForSpot(spotId))
    },[dispatch, spotId, isLoaded])

    return (
            <div>
                <button onClick={handleClick}>Delete</button>
            </div>
    )
}

export default DeleteReview;
