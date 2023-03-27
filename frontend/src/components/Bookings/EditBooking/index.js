import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkEditSpotBooking, thunkLoadSpotBookings, thunkLoadUserBookings } from "../../../store/bookingReducer";
import "./EditBooking.css";

const EditBooking = ({booking}) => {
    const dispatch = useDispatch();
    const history =  useHistory();
    const bookingsArr = Object.values(useSelector(state => state.bookings))
    const date = new Date();
    const isoDate = date.toISOString().slice(0, 10);
    const today = new Date();
    const tomorrow = new Date();
    const sessionUser = useSelector(state => state.session.user)
    const { closeModal } = useModal();

    tomorrow.setDate(today.getDate() + 1);

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [startDate, setStartDate] = useState(booking.startDate)
    const [validationErrors, setValidationErrors] = useState([])
    const newStartDate = new Date(startDate ? startDate : null);
    const dayAfterStart = new Date()
    dayAfterStart.setDate(newStartDate.getDate() + 1)
    const [endDate, setEndDate] = useState(booking.endDate)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(thunkLoadSpotBookings(booking.spotId))
        .then(() => setIsLoaded(true))
    }, [dispatch, booking.spotId, setIsLoaded])

    useEffect(() => {
        const setErrors = []

        if (!sessionUser) return;

        if (startDate && endDate && startDate === endDate) setErrors.push('Must book spot for at least a day');
        if (startDate && endDate && endDate < startDate) setErrors.push('Checkout date must be after check-in date');
        if (!startDate || !endDate) setErrors.push('Please select check-in and checkout dates');
        if (booking.startDate === startDate && booking.endDate === endDate) setErrors.push('Bookings dates are the same as original')
        let conflictWithBooking = false


        bookingsArr.forEach((booking) => {
          let startDateParse = Date.parse(startDate);
          let endDateParse = Date.parse(endDate);
          let startBookingExist = Date.parse(booking.startDate);
          let endBookingExist = Date.parse(booking.endDate);

          if (
            (startDateParse >= startBookingExist && startDateParse <= endBookingExist) ||
            (endDateParse >= startBookingExist && endDateParse <= endBookingExist)
          ) {
            conflictWithBooking = true;
          }

        });

        if (conflictWithBooking){
            setErrors.push(`This spot is already booked for the specified dates`)
        }

        return setValidationErrors(setErrors)
    }, [startDate, endDate])

    const onSubmit = async (e) => {
        e.preventDefault()

        setIsSubmitted(true)

        if(validationErrors.length > 0) return

        const bookingDetails = {
            spotId: booking.spotId,
            startDate: startDate,
            endDate: endDate
        }

        const data = await dispatch(thunkEditSpotBooking(booking.id, bookingDetails))

        if (Array.isArray(data)) {
          const errorMessages = Object.values(data);
          const formattedErrorMessages = errorMessages.map(error => error.split(": ")[1]);
          setValidationErrors(formattedErrorMessages);
        } else {
          alert(`Congratulations, you have booked ${booking.Spot?.name} from ${startDate} - ${endDate}!`)
          history.push('/bookings/current');
          dispatch(thunkLoadUserBookings())
          setStartDate('');
          setEndDate('');
          setIsSubmitted(false);
          closeModal();
        }

    }

    return (
        isLoaded && (
            <div className="spot-booking-container create-booking-div">
                <div className="delete-header-close-button">
                  <span className="close-edit-button" onClick={() => closeModal()}><i className="fas fa-times"></i></span>
                  <div className="delete-header">Edit Booking</div>
              </div>
                {isSubmitted && validationErrors.length > 0 && (
                <div>
                    <div className="booking-errors">
                    {validationErrors.map((error) => (
                        <div className="errors" key={error}>
                        {error}
                        </div>
                    ))}
                    </div>
                </div>
                )}
          <div className="booking-spot-details">
                <div>
                    <span className="booking-spot-price">${booking.Spot?.price}</span>{" "}
                    <span className="booking-spot-night">night</span>
                </div>
          </div>
          <form onSubmit={onSubmit} className="booking-form-inputs">
            <div className="booking-input-field">
              <div className="booking-check-in">
                <div className="label">
                    <label>CHECK-IN</label>
                </div>
                <input
                  type="date"
                  min={isoDate}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={booking.Spot?.ownerId === sessionUser?.id || !sessionUser}
                />
              </div>
              <div className="booking-check-out">
                <div className="label">
                    <label>CHECKOUT</label>
                </div>
                <input
                  type="date"
                  min={startDate ? dayAfterStart.toISOString().slice(0, 10) : isoDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={booking.Spot?.ownerId === sessionUser?.id || !sessionUser}
                />
              </div>
            </div>
            <div className="div-reserve-button">
              <button className="booking-edit-reserve-button" type="submit">Reserve</button>
              <button className="booking-cancel-button" onClick={() => closeModal()}>Cancel</button>
            </div>
          </form>
        </div>
      )
    );
}

export default EditBooking;
