import React from 'react'
import { useNavigate , useLocation } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'

function Navbar() {

    const navigate = useNavigate()
    const location = useLocation()

     const pathMatchRoute = (route)=>{
        if(route === location.pathname) return true
     }

  return (
    <footer className='navbar'>
        <nav className="navbarNav">
            <ul className="navbarListItems">
               
                <li className="navbarListItem">
                    <ExploreIcon fill={ pathMatchRoute('/house-marketplace') ? '#2c2c2c' :'#8f8f8f'} width='36px' height='36px' onClick={()=> navigate('/house-marketplace')}/>
                    <p className={pathMatchRoute('/house-marketplace') ? 'navbarListItemNameActive':'navbarListItemName' }>اکسپلور</p>
                </li>
              
                <li className="navbarListItem" 
                onClick={()=> 
                navigate('/house-marketplace/create-listing')}>
                    <OfferIcon 
                    fill={ pathMatchRoute('/house-marketplace/create-listing') 
                    ? '#2c2c2c' 
                    :'#8f8f8f'} 
                    width='36px' 
                    height='36px' />
                    <p className={pathMatchRoute('/house-marketplace/create-listing') ? 'navbarListItemNameActive':'navbarListItemName' }>
                        افزودن
                    </p>
                </li>
              
                <li className="navbarListItem">
                    <PersonOutlineIcon 
                    fill={ pathMatchRoute('/house-marketplace/profile') ? '#2c2c2c' :'#8f8f8f'} 
                    width='36px' height='36px' 
                    onClick={()=> 
                    navigate('/house-marketplace/profile')}/>
                    <p className={pathMatchRoute('/house-marketplace/profile') ? 'navbarListItemNameActive':'navbarListItemName' }>
                        پروفایل
                    </p>
                </li>

            </ul>
        </nav>
    </footer>
  )
}

export default Navbar