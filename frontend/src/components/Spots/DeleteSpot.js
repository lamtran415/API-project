import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkDeleteSpot, thunkLoadAllSpots } from "../../store/spotReducer";

const DeleteSpot = ({spotById}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spotId = spotById.id

    const handleClick = async () => {
        return await dispatch(thunkDeleteSpot(spotId))
        .then(() => dispatch(thunkLoadAllSpots()))
        .then(() => history.push('/'))
    }



    return (
        <button onClick={handleClick}>Delete</button>
    )
}

export default DeleteSpot;
