import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadOneSpot } from "../../store/spotReducer";
import OpenModalButton from "../OpenModalButton";
import ReviewsForSpot from "../ReviewsFolder/ReviewsForSpot";
import UpdateSpot from "../SpotForm/UpdateSpot";
import DeleteSpot from "./DeleteSpot";
import "./GetSpotById.css"

const GetSpotById = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    let spotById = useSelector(state => state.spots[spotId])
    const copySpotDetails = {...spotById}
    const sessionUser = useSelector(state => state.session)
    // console.log(spotById)

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
                        buttonText="Edit Spot"
                        modalComponent={<UpdateSpot spotById={spotById}/>}
                    />
                    : null
                }
                {sessionUser.user.id === copySpotDetails.ownerId ?
                    <DeleteSpot spotById={spotById}/>
                    : null
                }
            </div>
        )
    }

    return (
        <>
        {isLoaded && (
            <div className="spot-id-wrapper">
            <div className="spot-name">{spotById.name}</div>
            <div className="description-for-spots">
                <i className="fa fa-star fa-xs"></i>
                <div className="avg-star-rating">{" "}{parseFloat(spotById.avgStarRating).toFixed(2)}{" "}</div>
                <div>&#x2022;{" "}{`${spotById.numReviews} reviews`}{" "}</div>
                <div>&#x2022;{" "}{`${spotById.city}, ${spotById.state}, ${spotById.country}`}{" "}</div>
                {session}
            </div>
            {spotById.SpotImages ?<img
                className="spot-images"
                src={spotById.SpotImages ? spotById.SpotImages.map(image => image.url) : `No Images`}
                alt=""
            /> : <img className="spot-images" alt=""/>}
            <div className="host-name">
                <div >Entire home hosted by {spotById.Owner ? spotById.Owner.firstName : "Anonymous"}</div>
                <div className="spot-price-div">{`$ ${spotById.price} night`}</div>
                <i className="fas fa-user-circle fa-2x" />
            </div>
            {spotById.description}
            <ReviewsForSpot spotById={spotById}/>
        </div>
        )}
        </>
    )
}

export default GetSpotById;
