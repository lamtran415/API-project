import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Modal } from "../../../context/Modal";
import { thunkCreateSpotBooking, thunkLoadSpotBookings } from "../../../store/bookingReducer";
import LoginFormModal from "../../LoginFormModal";
import "./CreateBooking.css"

const CreateBooking = ({spotById}) => {
    const dispatch = useDispatch();
    const bookingsArr = Object.values(useSelector(state => state.bookings))
    const { spotId } = useParams()
    const date = new Date();
    const isoDate = date.toISOString().slice(0, 10);
    const today = new Date();
    const tomorrow = new Date();
    const sessionUser = useSelector(state => state.session.user)

    tomorrow.setDate(today.getDate() + 1);

    const [showModal, setShowModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [validationErrors, setValidationErrors] = useState([])
    const newStartDate = new Date(startDate ? startDate : null);
    const dayAfterStart = new Date()
    dayAfterStart.setDate(newStartDate.getDate() + 1)
    const [endDate, setEndDate] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
        dispatch(thunkLoadSpotBookings(spotId))
        .then(() => setIsLoaded(true))
    }, [dispatch, spotId, setIsLoaded])


    useEffect(() => {
        const errors = []

        if (startDate && endDate && startDate === endDate) errors.push('Must book spot for at least a day')
        if (startDate && endDate && endDate < startDate) errors.push('Checkout date must be after check-in date')
        if (!startDate || !endDate) errors.push('Please select check-in and checkout dates')

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

        if (conflictWithBooking === true){
            errors.push(`This spot is already booked for the specified dates`)
        }

        return setValidationErrors(errors)
    }, [startDate, endDate])

    const onSubmit = async (e) => {
        e.preventDefault()

        if(!sessionUser){
            return
        }


        setIsSubmitted(true)

        if(validationErrors.length > 0) return

        const bookingDetails = {
            spotId: spotId,
            startDate: startDate,
            endDate: endDate
        }

        await dispatch(thunkCreateSpotBooking(spotId, bookingDetails))

        alert(`Congratulations, you have booked ${spotById?.name} from ${startDate} - ${endDate}!`)
        setIsSubmitted(false)
        setStartDate('')
        setEndDate('')

    }

    let session;
    if (spotById?.ownerId === sessionUser?.user?.id || !sessionUser) {
        session = (
            <button className="booking-reserve-button disabled" type="submit">
              Reserve
            </button>
          )
        } else {
            session = (
                <button className="booking-reserve-button" type="submit">
          Reserve
        </button>
      )
    }

    return (
        isLoaded && (
            <div className="spot-booking-container create-booking-div">
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
                    <span className="booking-spot-price">${spotById?.price}</span>{" "}
                    <span className="booking-spot-night">night</span>
                </div>
              <div className="booking-spot-star-container">
                <i className="fa fa-star fa-s"></i>
                    {Number(spotById?.avgStarRating).toFixed(2)} · {}
                <span className="booking-review-span">
                    {spotById?.numReviews} {spotById?.numReviews !== 1 ? "reviews" : "review"}
                </span>
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
                />
              </div>
            </div>
            <div className="div-reserve-button">
                {session}
            </div>
          </form>
        </div>
      )
    );

}


export default CreateBooking;
