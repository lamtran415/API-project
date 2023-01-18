import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkDeleteSpot } from "../../store/spotReducer";

const DeleteSpot = ({spotById}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spotId = spotById.id

    const handleClick = async () => {
        dispatch(thunkDeleteSpot(spotId))
        history.push('/')
    }

    return (
        <button onClick={handleClick}>Delete</button>
    )
}

export default DeleteSpot;
