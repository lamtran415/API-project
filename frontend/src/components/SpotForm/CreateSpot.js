import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkCreateSpot, thunkLoadOneSpot } from "../../store/spotReducer";
import './CreateSpot.css'

const CreateNewSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    // const [lat, setLat] = useState("");
    // const [lng, setLng] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [url, setUrl] = useState("")
    const [errors, setErrors] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const { closeModal } = useModal();

    let spotId;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        if(errors.length > 0) return

        const spotDetails = {
            address,
            city,
            state,
            country,
            lat: 100,
            lng: -100,
            name,
            description,
            price,
            url
        };

        const spot = await dispatch(thunkCreateSpot(spotDetails))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                const errorMessages = Object.values(data.errors);
                const formattedErrorMessages = errorMessages.map(error => error.split(": ")[1]);
                setErrors(formattedErrorMessages);
            }
        });
        spotId = spot.id
        history.push(`/spots/${spot.id}`)
        closeModal()
        setSubmitted(true);
    }


    useEffect(() => {
        if (spotId){
            dispatch(thunkLoadOneSpot(spotId))
            setSubmitted(false);
        }
    }, [dispatch, spotId, submitted])


    return (
        <div className="create-spot-container">
            <h3 className="create-spot-header"><div className="x-button" onClick={closeModal}><i className="fas fa-times"></i></div><span>Host A Spot</span></h3>
            <form
                className="spot-form-container"
                onSubmit={handleSubmit}
            >
                {/* <ul className="errors-map">
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul> */}
                <div className="spot-input-container">
                    {errors.includes("Address must be 100 characters or less") && <span className="spot-errors-map">Address must be 100 characters or less</span>}
                    <label>
                        {/* Address: */}
                        <input
                            type='text'
                            name="address"
                            placeholder="Enter an address"
                            value={address}
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
                            placeholder="Enter a description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            minLength={10}
                            required
                        />
                    </label>
                    {errors.includes("Price must be an integer from 1 to 100000") && <span className="spot-errors-map">Price must be an integer from 1 to 100000</span>}
                    <label>
                        {/* Price: */}
                        <input
                            type='number'
                            name="price"
                            min='1'
                            placeholder="Enter a price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        {/* Image URL: */}
                        <input
                            type="url"
                            name="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter an image URL (http://www.example.com/)"
                            required
                            />
                    </label>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default CreateNewSpot;
