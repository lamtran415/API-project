import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkLoadOneSpot } from "../../store/spotReducer";
import CreateBooking from "../Bookings/CreateBooking";
import SpotBookings from "../Bookings/SpotBookings";
import ErrorPage from "../ErrorPage";
import OpenModalButton from "../OpenModalButton";
import ReviewsForSpot from "../ReviewsFolder/ReviewsForSpot";
import UpdateSpot from "../SpotForm/UpdateSpot";
import DeleteSpot from "./DeleteSpot";
import "./GetSpotById.css"

const GetSpotById = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);
    let spotById = useSelector(state => state.spots[spotId]);
    const copySpotDetails = {...spotById};
    const sessionUser = useSelector(state => state.session);
    const bookings = useSelector(state => state.bookings)

    useEffect(() => {
        dispatch(thunkLoadOneSpot(spotId))
            .then(() => (setIsLoaded(true)))

    }, [dispatch, spotId])

    let session;
    if (sessionUser.user !== null) {
        session = (
            <div className="edit-delete-button">
                {sessionUser.user.id === copySpotDetails.ownerId ?
                    <OpenModalButton
                        className="edit-button"
                        buttonText="Edit Spot"
                        modalComponent={<UpdateSpot spotById={spotById}/>}
                    />
                    : null
                }
                {sessionUser.user.id === copySpotDetails.ownerId ?
                    <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteSpot spotId={spotId}/>}
                />
                : null
                }
            </div>
        )
    }

    if (!spotById) {
        return <ErrorPage />
    }

    return (
        <>
        {isLoaded && (
            <div className="spot-id-wrapper">
                <div className="spot-name">{spotById?.name}</div>
                <div className="description-for-spots">
                    <i className="fa fa-star fa-xs"></i>
                    <div className="avg-star-rating">{" "}{parseFloat(spotById?.avgStarRating).toFixed(2)}{" "}</div>
                    <div>&#x2022;</div>
                    <div className="spot-details">{" "}{`${spotById?.numReviews} ${spotById?.numReviews > 1 ? "reviews" : "review"}`}{" "}</div>
                    <div>&#x2022;</div>
                    <div className="spot-details city-state-country">{" "}{`${spotById?.city}, ${spotById?.state}, ${spotById?.country}`}{" "}</div>
                    {session}
                </div>
                {spotById?.SpotImages ?<img
                    className="spot-images"
                    src={spotById?.SpotImages ? spotById.SpotImages.map(image => image.url) : `No Images`}
                    alt=""
                    onError={e => { e.currentTarget.src = "https://wallpapercave.com/wp/wp1842933.jpg"; }}
                /> : <img className="spot-images" alt=""/>}
                <div className="host-name">
                    <div >Entire home hosted by {spotById?.Owner ? spotById.Owner.firstName : "Anonymous"}</div>
                    <div className="spot-price-div">{`$ ${spotById?.price} night`}</div>
                    <i className="fas fa-user-circle fa-2x" />
                </div>
                <div className="description-booking-div">
                    <div className="spot-id-description">
                        <div className="description-each-spot">
                            {spotById?.description}
                        </div>
                        <div className="review-bookings-div">
                            <div className="left-side-review-bookings">
                                <ReviewsForSpot spotById={spotById}/>
                            </div>
                        </div>

                    </div>
                    <div className="right-side-review-bookings">
                        { !sessionUser ? null :
                        <>
                            {/* <SpotBookings spotById={spotById} /> */}
                            <CreateBooking spotById={spotById} sessionUser={sessionUser} />
                        </>

                        }
                    </div>
                </div>
        </div>
        )}
        </>
    )
}

export default GetSpotById;
