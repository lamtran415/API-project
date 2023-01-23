import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkDeleteSpot, thunkLoadAllSpots } from "../../store/spotReducer";

const DeleteSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();

    const handleClick = () => {
        dispatch(thunkDeleteSpot(spotId))
        dispatch(thunkLoadAllSpots())
        history.push('/')
    }

    return (
        <button onClick={handleClick}>Delete</button>
    )
}

export default DeleteSpot;
