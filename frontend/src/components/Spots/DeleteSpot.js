import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkDeleteSpot } from "../../store/spotReducer";
import { thunkLoadAllSpots } from "../../store/spotReducer";

const DeleteSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();

    useEffect(() => {
        dispatch(thunkLoadAllSpots)
    },[])

    const handleClick = () => {
        dispatch(thunkDeleteSpot(spotId))
        history.push('/')
    }

    return (
        <button onClick={handleClick}>Delete</button>
    )
}

export default DeleteSpot;
