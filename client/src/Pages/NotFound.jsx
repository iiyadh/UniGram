import LogoLight from '../assets/LogoLight.png';
import '../styles/generalstyle.scss';

const NotFound = () =>{
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <h1 className="not-found" style={{ fontSize: '6rem', margin: 0 }}>404</h1>
            <p className="not-found" style={{ fontSize: '1.5rem' }}>Page Not Found</p>
            <img src={LogoLight} alt="Not Found" style={{ width: '300px', marginTop: '20px' }}/>
            <h2 className="not-found" style={{ fontSize: '2rem', margin: 0 ,fontWeight:600 }}>UniCord</h2>
        </div>
    )
}

export default NotFound;