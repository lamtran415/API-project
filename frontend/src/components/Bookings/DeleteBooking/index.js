import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkDeleteUserBooking, thunkLoadUserBookings } from "../../../store/bookingReducer";

const DeleteBooking = ({booking}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleClick = async (e) => {
        e.preventDefault();
        await dispatch(thunkDeleteUserBooking(booking.id))
            .then(() => alert(`Your booking for ${booking.Spot.name} from ${booking.startDate} - ${booking.endDate} has been removed.`))
            .then(() => dispatch(thunkLoadUserBookings()))
            .then(() => closeModal())
    }

    return (
        <div className="delete-modal-container">
        <div className="delete-pop-up">
            <div className="delete-header-close-button">
                <span className="close-edit-button" onClick={() => closeModal()}><i className="fas fa-times"></i></span>
                <div className="delete-header">Delete Booking</div>
            </div>
            <p className="delete-text-p-tag">Are you sure you want to delete your booking for <span className="spot-info-name">{booking.Spot?.name}</span>?</p>
            <form className="delete-form-container" onSubmit={handleClick}>
                <button className="cancel-button" onClick={() => closeModal()}>Cancel</button>
                <button className="delete-button" type="submit">Delete</button>
            </form>
        </div>
    </div>
    )
}

export default DeleteBooking;
