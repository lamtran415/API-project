import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { thunkDeleteSpot } from "../../store/spotReducer";
import "./DeleteSpot.css"

const DeleteSpot = ({spotId}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const spotInfo = useSelector(state => state.spots[spotId])

    const handleClick =  async (e) => {
        e.preventDefault();
        await dispatch(thunkDeleteSpot(spotId))
            .then(() => history.push("/"))
            .then(() => closeModal())
    }

    return (
        <div className="delete-modal-container">
        <div className="delete-pop-up">
            <div className="delete-header-close-button">
                <div className="delete-header">Delete Spot</div>
                <span className="close-edit-button" onClick={() => closeModal()}><i className="fas fa-times"></i></span>
            </div>
            <p className="delete-text-p-tag">Are you sure you want to delete <span className="spot-info-name">{spotInfo?.name}</span>?</p>
            <form className="delete-form-container" onSubmit={handleClick}>
                <button className="cancel-button" onClick={() => closeModal()}>Cancel</button>
                <button className="delete-button" type="submit">Delete</button>
            </form>
        </div>
    </div>
    )
}

export default DeleteSpot;
