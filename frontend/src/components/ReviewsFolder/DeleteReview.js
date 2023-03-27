import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { thunkDeleteReview } from "../../store/reviewReducer";
import { thunkLoadOneSpot } from "../../store/spotReducer";
import "./DeleteReview.css"

const DeleteReview = ({review}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal()
    const { spotId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);

    const handleClick = async () => {
        dispatch(thunkDeleteReview(review.id))
        setIsLoaded(true)
    }

    useEffect(() => {
        dispatch(thunkLoadOneSpot(spotId))
        setIsLoaded(false);
    },[dispatch, spotId, isLoaded])

    return (
        <div className="delete-modal-container">
        <div className="delete-pop-up">
            <div className="delete-header-close-button">
                <span className="close-edit-button" onClick={() => closeModal()}><i className="fas fa-times"></i></span>
                <div className="delete-header">Delete Review</div>
            </div>
            <p className="delete-text-p-tag">Are you sure you want to delete this review?</p>
            <form className="delete-form-container" onSubmit={handleClick}>
                <button className="cancel-button" onClick={() => closeModal()}>Cancel</button>
                <button className="delete-button" type="submit">Delete</button>
            </form>
        </div>
    </div>
    )
}

export default DeleteReview;
