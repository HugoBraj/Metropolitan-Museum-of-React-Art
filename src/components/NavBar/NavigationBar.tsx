import './NavigationBar.css'
import logoSmall from '../../assets/logo.svg'

export function NavigationBar() {
    return (
        <div className="navigation-bar">
            <img className='logo-img' src={logoSmall} alt="Logo" />
            <button className='link-button'>
                Explore Collection
            </button>
            <button className='link-button'>
                Visit
            </button>
            <button className='link-button'>
                Membership
            </button>
            <button className='link-button'>
                About
            </button>
        </div>
    );
}