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
    // console.log(spotById)
    // console.log("UPDATE SPOT COMPONENT PROP PLZ HAVE==========!!!!!",spotById)
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
                if (data && data.errors) setErrors(data.errors)
            });
    }

    return (
    <div className="update-spot-container">
        <h1 className="update-spot-header">Update Spot Information</h1>
        <form
            className="update-form-container"
            onSubmit={handleSubmit}
        >
            <ul className="error-map">
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <div className="update-input-container">
                <label>
                    Address:
                    <input
                        type='text'
                        name="address"
                        value={address}
                        placeholder="Enter an address"
                        onChange={(e) => setAddress(e.target.value)}
                        // required
                    />
                </label>
                <label>
                    City:
                    <input
                        type='text'
                        name="city"
                        value={city}
                        placeholder="Enter a city"
                        onChange={(e) => setCity(e.target.value)}
                        // required
                    />
                </label>
                <label>
                    State:
                    <input
                        type='text'
                        name="state"
                        value={state}
                        placeholder="Enter a state"
                        onChange={(e) => setState(e.target.value)}
                        // required
                    />
                </label>
                <label>
                    Country:
                    <input
                        type='text'
                        name="country"
                        value={country}
                        placeholder="Enter a country"
                        onChange={(e) => setCountry(e.target.value)}
                        // required
                    />
                </label>
                <label>
                    Name:
                    <input
                        type='text'
                        name="name"
                        value={name}
                        placeholder="Enter a name"
                        onChange={(e) => setName(e.target.value)}
                        // required
                    />
                </label>
                <label>
                    Description:
                    <input
                        type='text'
                        name="description"
                        value={description}
                        placeholder="Enter a description"
                        onChange={(e) => setDescription(e.target.value)}
                        // required
                    />
                </label>
                <label>
                    Price:
                    <input
                        type='number'
                        name="price"
                        value={price}
                        min='0'
                        placeholder="Enter a price"
                        onChange={(e) => setPrice(e.target.value)}
                        // required
                    />
                </label>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
    )
}

export default UpdateSpot;
