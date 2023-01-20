import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkDeleteReview } from "../../store/reviewReducer";
import { thunkLoadOneSpot } from "../../store/spotReducer";
import "./DeleteReview.css"

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
        dispatch(thunkLoadOneSpot(spotId))
        setIsLoaded(false);
    },[dispatch, spotId, isLoaded])

    return (
            <>
                <button className="delete-review" onClick={handleClick}>Delete</button>
            </>
    )
}

export default DeleteReview;
