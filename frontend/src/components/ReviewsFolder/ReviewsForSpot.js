import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadReviewsForSpot } from "../../store/reviewReducer";
import CreateReviewForSpots from "./CreateReviewForSpot";
import OpenModalButton from "../OpenModalButton";
import DeleteReview from "./DeleteReview";
import UpdateReviewForSpot from "./UpdateReviewForSpot";
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
        {copySessionUser.user.id !== spotById?.ownerId ? (
          <div>
            <OpenModalButton
              className="review-button"
              buttonText="Leave Review"
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
      <div className="description-for-reviews">
        <i className="fa fa-star fa-s"></i>
        <h3 className="avg-star-rating">{parseFloat(spotById?.avgStarRating).toFixed(2)} </h3>
        <div>&#x2022;</div>
        <h3>{`${spotById?.numReviews} reviews`} </h3>
        {userLoggedIn}
      </div>
      <div className="lower-section-container">
        {reviewsArr.map((review) => (
          <div key={review?.id} className="review-and-pic">
            <div className="above-review-comment">
              <i className="fas fa-user fa-2x" />
            </div>
            <div className="review-with-delete">
              <div className="review-user-firstname">{review?.User?.firstName}</div>
              <div className="review-date">{new Date(review?.createdAt).toLocaleString('en-US',{ month: 'long'})}{" "}{new Date(review.createdAt).getFullYear()}</div>
              <div className="review-by-user">{review?.review}</div>
            </div>
            <div>
            {sessionUser.user !== null &&
            copySessionUser.user.id === review.userId ? (
              <OpenModalButton
                    className="delete-review"
                    buttonText="Edit"
                    modalComponent={
                      <UpdateReviewForSpot
                        review={review}
                      />
                    }
                  />
              ) : null}
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
