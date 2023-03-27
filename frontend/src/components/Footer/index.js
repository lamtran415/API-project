import './Footer.css'

const Footer = () => {
    return (
        <footer className="whole-footer-container">
            <div className="language-framework">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt=""/>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt=""/>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" alt=""/>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" alt=""/>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt=""/>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt=""/>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt=""/>
            </div>
            <div className='my-name-footer'>
                Austin Lam-Tran
            </div>
            <a href='https://github.com/lamtran415' target='_blank' rel="noreferrer">
                <img
                    className='github-logo'
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                    alt=""
                />
            </a>
            <a href='https://www.linkedin.com/in/austin-lam-tran-93881a155/' target='_blank' rel="noreferrer">
                <img
                    className='linkedin-logo'
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-plain.svg"
                    alt=""
                />
            </a>
        </footer>
    )
}

export default Footer;
