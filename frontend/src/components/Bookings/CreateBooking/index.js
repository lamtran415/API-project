import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkCreateSpotBooking, thunkLoadSpotBookings } from "../../../store/bookingReducer";
import LoginFormModal from "../../LoginFormModal";
import OpenModalButton from "../../OpenModalButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateBooking.css";
import { thunkLoadOneSpot } from "../../../store/spotReducer";

const CreateBooking = ({spotById}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const bookingsArr = Object.values(useSelector(state => state.bookings.spotBookings))
    const { spotId } = useParams()
    const date = new Date();
    const isoDate = date.toISOString().slice(0, 10);
    const today = new Date();
    const tomorrow = new Date();
    const sessionUser = useSelector(state => state.session.user)

    tomorrow.setDate(today.getDate() + 1);

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
        const setErrors = []

        if (!sessionUser) return;

        if (startDate && endDate && startDate === endDate ) setErrors.push('Must book spot for at least a day');
        if (startDate && endDate && endDate < startDate ) setErrors.push('Checkout date must be after check-in date');
        if (!startDate || !endDate ) setErrors.push('Please select check-in and checkout dates');


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
            spotId: spotId,
            startDate: startDate,
            endDate: endDate
        }

        const data = await dispatch(thunkCreateSpotBooking(spotId, bookingDetails))

        if (Array.isArray(data)) {
          const errorMessages = Object.values(data);
          const formattedErrorMessages = errorMessages.map(error => error.split(": ")[1]);
          setValidationErrors(formattedErrorMessages);
        } else {
          alert(`Congratulations, you have booked ${spotById?.name} from ${startDate} - ${endDate}!`)
          history.push('/bookings/current')
          setStartDate('')
          setEndDate('')
          setIsSubmitted(false)
        }

    }

    let session;
    if (spotById?.ownerId === sessionUser?.id) {
        session = (
            <button className="booking-reserve-button disabled" type="submit" disabled>
              Reserve
            </button>
          )
    } else if (!sessionUser) {
        session = (
          <OpenModalButton
            className="booking-reserve-button"
            buttonText="Please Log In"
            modalComponent={<LoginFormModal />}
          />
        )
    } else {
            session = (
                <button className="booking-reserve-button" type="submit">
          Reserve
        </button>
      )
    }

    // const currentBookings = bookingsArr
    //   .filter(booking => new Date(booking.endDate) >= new Date())
    //   .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    const currentBookings = bookingsArr
      .filter(booking => new Date(booking.endDate) >= new Date())
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .map((booking) => {
        const formattedStartDate = formatDate(booking.startDate);
        const formattedEndDate = formatDate(booking.endDate);
        return { ...booking, formattedStartDate: formattedStartDate, formattedEndDate: formattedEndDate };
      });

    function formatDate(dateString) {
      const year = dateString.slice(0, 4);
      const month = dateString.slice(5, 7);
      const day = dateString.slice(8, 10);
      return `${month}-${day}-${year}`;
    }

    let spotBookings;
    if (currentBookings.length && sessionUser) {
        spotBookings = (
            <div className="spot-booking-container">
                <div className="booking-title">
                    <div>Bookings</div>
                </div>
                <div className="start-and-end-date-container">
                    <div className="start-date-container">
                        <div className="date-header">Start Date</div>
                        {currentBookings.map((booking) => (
                            <div className="start-end" key={booking.startDate}>
                            {new Date(booking.startDate) > new Date() ? booking.formattedStartDate : "None"}
                            </div>
                        ))}
                    </div>
                  <div className="end-date-container">
                        <div className="date-header">End Date</div>
                        {currentBookings.map((booking) => (
                            <div className="start-end" key={booking.endDate}>
                            {new Date(booking.startDate) > new Date() ? booking.formattedEndDate : "None"}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    else if (!sessionUser) {
        spotBookings = (
            null
        )
    }
    else {
        spotBookings = (
            <div className="spot-booking-container booking-title">
                <div className="spot-name-no-bookings">{spotById.name} has no current bookings</div>
            </div>
        )
    }

    return (
        isLoaded && (
          <>
                {spotBookings}
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
                        {parseFloat(spotById?.avgStarRating).toFixed(2)} · {}
                    <span className="booking-review-span">
                        {spotById?.numReviews} {spotById?.numReviews > 1 ? "reviews" : "review"}
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
                      disabled={spotById?.ownerId === sessionUser?.id || !sessionUser}
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
                      disabled={spotById?.ownerId === sessionUser?.id || !sessionUser}
                    />
                  </div>
                </div>
                <div className="div-reserve-button">
                    {session}
                </div>
              </form>
            </div>
          </>
      )
    );

}


export default CreateBooking;
