import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadReviewsForSpot } from "../../store/reviewReducer";
import CreateReviewForSpots from "./CreateReviewForSpot";
import OpenModalButton from "../OpenModalButton";
import DeleteReview from "./DeleteReview";

const ReviewsForSpot = ({spotById}) => {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    useEffect(() => {
        dispatch(thunkLoadReviewsForSpot(spotId))
    }, [dispatch, spotId]);

    let reviews = useSelector(state => state.reviews);
    let sessionUser = useSelector(state => state.session)
    const copySessionUser = {...sessionUser};

    let reviewsArr = Object.values(reviews);

    if (!reviewsArr) return null;

    return (
        <div>
            <div className="upper-section-reviews">
                <h2>REVIEWS</h2>
                <div>
                    <OpenModalButton
                        buttonText= "Leave a Review"
                        modalComponent={<CreateReviewForSpots spotId={spotId} spotById={spotById} reviews={reviews} />}
                    />
                </div>
                <i className="fa fa-star fa-s"></i>
                <h3 className="avg-star-rating">{" "}{spotById.avgStarRating}{" "}</h3>
                <h3>&#x2022;{" "}{`${spotById.numReviews} reviews`}{" "}</h3>
            </div>
            <div className="lower-section-container">
                {reviewsArr.map(review => (
                    <ul key={review.id}>
                        <div className="above-review-comment">
                            <i className="fas fa-user-circle fa-2x" />
                            {/* <div>{review.User.firstName}</div> */}
                            <div>{new Date(review.createdAt).toDateString()}</div>
                        </div>
                        <div>
                            {review.review}
                            {sessionUser.user !== null && copySessionUser.user.id === review.userId ?
                            <DeleteReview review={review} copySessionUser={copySessionUser}/> : null}
                        </div>
                        {/* {console.log(review)} */}
                    </ul>
                ))}
            </div>
        </div>
    )
}

export default ReviewsForSpot;
