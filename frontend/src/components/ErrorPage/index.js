import { useHistory } from "react-router-dom";
import "./ErrorPage.css"

const ErrorPage = () => {
    const history = useHistory();
    return (
        <div className="whole-error-page-container">
            <div className="cant-find-page-div">
                <div className="error-page-text">We can't seem to find the page you're looking for... <i className="far fa-frown frown-class"></i></div>
                <img src="https://a0.muscache.com/airbnb/static/error_pages/404-Airbnb_final-d652ff855b1335dd3eedc3baa8dc8b69.gif" alt=""/>
                <button onClick={() => history.push('/')} className="not-hosting-home-btn error-home-btn">Home</button>
            </div>
        </div>
    )
}

export default ErrorPage;
