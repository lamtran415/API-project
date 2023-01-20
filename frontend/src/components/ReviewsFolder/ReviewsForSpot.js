import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadReviewsForSpot } from "../../store/reviewReducer";
import CreateReviewForSpots from "./CreateReviewForSpot";
import OpenModalButton from "../OpenModalButton";
import DeleteReview from "./DeleteReview";
import "./ReviewsForSpot.css";

const ReviewsForSpot = ({ spotById }) => {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  useEffect(() => {
    dispatch(thunkLoadReviewsForSpot(spotId));
  }, [dispatch, spotId]);

  let reviews = useSelector((state) => state.reviews);
  let sessionUser = useSelector((state) => state.session);
  const copySessionUser = { ...sessionUser };

  let reviewsArr = Object.values(reviews);

  let userLoggedIn = null;
  if (sessionUser.user !== null) {
    userLoggedIn = (
      <div className="review-modal-button">
        {copySessionUser.user.id !== spotById.ownerId ? (
          <div>
            <OpenModalButton
              buttonText="Leave a Review"
              modalComponent={
                <CreateReviewForSpots
                  spotId={spotId}
                  copySessionUser={copySessionUser}
                />
              }
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (!reviewsArr) return null;

  return (
    <div className="whole-reviews-container">
      <div className="description-for-spots">
        <i className="fa fa-star fa-s"></i>
        <h3 className="avg-star-rating">{spotById.avgStarRating} </h3>
        <h3>&#x2022; {`${spotById.numReviews} reviews`} </h3>
        {userLoggedIn}
      </div>
      <div className="lower-section-container">
        {reviewsArr.map((review) => (
          <div key={review.id} className="review-and-pic">
            <div className="above-review-comment">
              <i className="fas fa-user-circle fa-2x" />
            </div>
            <div className="review-with-delete">
              <div>{review.User.firstName}</div>
              <div>{new Date(review.createdAt).toDateString()}</div>
              {review.review}
            </div>
            <div>
              {sessionUser.user !== null &&
              copySessionUser.user.id === review.userId ? (
                <DeleteReview
                  review={review}
                  copySessionUser={copySessionUser}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsForSpot;
