'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import './NavbarBelt.css';
import amazonLogo from '../../public/amazonLogo.png';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import flag from '../../public/india.png'
const NavbarBelt = () => {
  return (
    <div className='navbarBelt'>
      <div className="leftNavBelt">
        <Link href='/' className="leftNavBeltLogo">
          <Image
            className='amazonLogoNavbar'
            src={amazonLogo}
            alt='Amazon Logo'
            width={110}
            height={30}
            priority
          />
          <span className='navbar_inLogo'>.in</span>
        </Link>

        <div className='navbarBeltLocation'>
            <div className='navbarBeltLocationImg'>
                <LocationOnOutlinedIcon className='navbarBeltLocationImgIcon'/>
            </div>
            <div className='navbarBeltLocationPlace'>
                <div className='navbarBeltLocationTop'>Delivering to Pune 411014 </div>
                <div className='navbarBeltLocationBottom'>Update Location</div>
            </div>
        </div>
      </div>

      <div className="navbarBeltSearchBox">
        <div className="navbarBeltSearchDiv">
          <div className="navbarBeltSearchBoxAll">
            <div className="navbarBeltSearchBoxAllText">All</div>
            <ArrowDropDownOutlinedIcon sx={{ fontSize: "20px" }} />
          </div>
          <input type='text' className='navbarBeltInputSearchBox' placeholder='Search Amazon.in'/>
          <div className='searchIconNavbarBelt'>
            <SearchOutlinedIcon sx={{fontSize:"26px"}} className='searchIconNavbarBeltIcon'/>
          </div>
        </div>
      </div>

      <div className="rightSideNavbarBelt">
        <div className="indianFlagCode">
          <Image src={flag} className='indiaFlag'/>
          <div className='indiaCodeNavbarBelt'>EN <ArrowDropDownOutlinedIcon sx={{fontSize:16,marginTop:1,marginLeft:0.4}} className='indiaCodeNavbarBeltDrp'/></div>
        </div>

        <Link href={'/userdashboard'}>
        <div className='helloSignInNavbaeBelt'>
            <div className='helloTopNavbarBelt'>Hello,Abhiram</div> 
            <div className='indiaCodeNavbarBelt'>Accounts &Lists</div>
        </div>
        </Link>  


        <Link href={'/UserOrders'}>
        <div className='helloSignInNavbaeBelt'>
            <div className='helloTopNavbarBelt'>Returns</div> 
            <div className='indiaCodeNavbarBelt'>&Orders</div>
        </div>
        </Link>  



        <Link href={'/usercart'} className="helloSignInNavbaeBelt">
          <span className='cartItemNumberNavbarBelt'>2</span>
          <div className="helloTopNavbarBelt">
            <ShoppingCartOutlinedIcon />
            <span className='cartTitle'>Cart</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavbarBelt;
