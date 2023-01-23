import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkDeleteSpot } from "../../store/spotReducer";

const DeleteSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);

    const handleClick = () => {
        dispatch(thunkDeleteSpot(spotId))
        setIsLoaded(true)
        history.push('/')
    }

    useEffect(() => {
        if (isLoaded) {
            setIsLoaded(false)
        }
    }, [isLoaded])

    return (
        <button onClick={handleClick}>Delete</button>
    )
}

export default DeleteSpot;
