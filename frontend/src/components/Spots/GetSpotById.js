import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadOneSpot } from "../../store/spotReducer";
import OpenModalButton from "../OpenModalButton";
import UpdateSpot from "../SpotForm/UpdateSpot";
import "./GetSpotById.css"

const GetSpotById = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    let spotById = useSelector(state => state.spots[parseFloat(spotId)])
    console.log("1) GET SPOT BY ID COMPONENT================", spotById)
    const sessionUserId = useSelector(state => state.session.user.id)


    useEffect(() => {
        dispatch(thunkLoadOneSpot(spotId))
            .then(() => (setIsLoaded(true)))
    }, [dispatch, spotId])

    return (
        isLoaded && (
            <div className="spot-id-wrapper">
                <div className="spot-name">{spotById.name}</div>
                <div className="description-for-spots">
                    <i className="fa fa-star fa-xs"></i>
                    <div className="avg-star-rating">{" "}{spotById.avgStarRating}{" "}</div>
                    <div>&#x2022;{" "}{`${spotById.numReviews} reviews`}{" "}</div>
                    <div>&#x2022;{" "}{`${spotById.city}, ${spotById.state}, ${spotById.country}`}{" "}</div>
                        {sessionUserId === spotById.ownerId ?
                            <OpenModalButton
                                buttonText="Edit Spot"
                                modalComponent={<UpdateSpot spotById={spotById}/>}
                            />
                            : null
                        }
                </div>
                <img
                    className="spot-images"
                    src={spotById.SpotImages ? spotById.SpotImages.map(image => image.url) : "No Image"}
                    // src= {spotById.SpotImages[0].url}
                    alt=""
                    />
            </div>
        )
    )
}



export default GetSpotById;
