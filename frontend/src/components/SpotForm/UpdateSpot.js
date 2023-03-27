import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { thunkUpdateSpot } from "../../store/spotReducer";
import "./UpdateSpot.css"

const UpdateSpot = ({spotById}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spotId = spotById.id;
    const [address, setAddress] = useState(spotById.address);
    const [city, setCity] = useState(spotById.city);
    const [state, setState] = useState(spotById.state);
    const [country, setCountry] = useState(spotById.country);
    // const [lat, setLat] = useState("");
    // const [lng, setLng] = useState("");
    const [name, setName] = useState(spotById.name);
    const [description, setDescription] = useState(spotById.description);
    const [price, setPrice] = useState(spotById.price);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const spotDetails = {
            id: spotId,
            address,
            city,
            state,
            country,
            lat: 100,
            lng: -100,
            name,
            description,
            price
        };

        return await dispatch(thunkUpdateSpot(spotDetails, spotById))
            .then(() => history.push(`/spots/${spotId}`))
            .then(() => closeModal())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    const errorMessages = Object.values(data.errors);
                    const formattedErrorMessages = errorMessages.map(error => error.split(": ")[1]);
                    setErrors(formattedErrorMessages);
                }
            });
    }

    return (
    <div className="update-spot-container">
        <h3 className="update-spot-header"><div className="x-button" onClick={closeModal}><i className="fas fa-times"></i></div><span>Update Spot</span></h3>
        <form
            className="update-form-container"
            onSubmit={handleSubmit}
        >
            {/* <ul className="errors-map">
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul> */}
            <div className="update-input-container">
                {errors.includes("Address must be 100 characters or less") && <span className="spot-errors-map">Address must be 100 characters or less</span>}
                <label>
                    {/* Address: */}
                    <input
                        type='text'
                        name="address"
                        value={address}
                        placeholder="Enter an address"
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </label>
                {errors.includes("City must be 85 characters or less") && <span className="spot-errors-map">City must be 85 characters or less</span>}
                <label>
                    {/* City: */}
                    <input
                        type='text'
                        name="city"
                        value={city}
                        placeholder="Enter a city"
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </label>
                {errors.includes("State must be 20 characters or less") && <span className="spot-errors-map">State must be 20 characters or less</span>}
                <label>
                    {/* State: */}
                    <input
                        type='text'
                        name="state"
                        value={state}
                        placeholder="Enter a state"
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </label>
                {errors.includes("Country must be 60 characters or less") && <span className="spot-errors-map">Country must be 60 characters or less</span>}
                <label>
                    {/* Country: */}
                    <input
                        type='text'
                        name="country"
                        value={country}
                        placeholder="Enter a country"
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </label>
                {errors.includes("Name must be less than 50 characters") && <span className="spot-errors-map">Name must be less than 50 characters</span>}
                <label>
                    {/* Name: */}
                    <input
                        type='text'
                        name="name"
                        value={name}
                        placeholder="Enter a name"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                {errors.includes("Description must be 500 characters or less") && <span className="spot-errors-map">Description must be 500 characters or less</span>}
                <label>
                    {/* Description: */}
                    <input
                        type='text'
                        name="description"
                        value={description}
                        placeholder="Enter a description"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                {errors.includes("Price must be an integer from 1 to 100000") && <span className="spot-errors-map">Price must be an integer from 1 to 100000</span>}
                <label>
                    {/* Price: */}
                    <input
                        type='number'
                        name="price"
                        value={price}
                        min='1'
                        placeholder="Enter a price"
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
    )
}

export default UpdateSpot;
