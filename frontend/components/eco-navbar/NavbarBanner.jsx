import React from 'react'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import './NavBanner.css';
import Link from 'next/link';
import { FaLeaf } from 'react-icons/fa';
const NavbarBanner = () => {
  const options = [
    { "name": "Fresh" },
    { "name": "Amazon miniT" },
    { "name": "Sell" },
    { "name": "Best Sellers" },
    { "name": "Today's Deals" }, { "name": "Mobiles" }, { "name": "Electronics" }, { "name": "Prime" }, { "name": "Customer Service" }, { "name": "Fashion" }, { "name": "Home & Kitchen" }
  ]
  return (
    <div className="navbarBanner">
      <div className="navbarBannerOptionsLeft">
      <div className='optionsNavbarBanner'>
        <MenuOutlinedIcon sx={{fontSize:"24px"}}/>
        <div className='allOptionsNavbarBanner'>All</div>
      </div>

      {
        options.map((item,index)=>{
          return(
            <div className='optionsNavbarBanner text-3xl' key={index}>
              <div className='allOptionsNavbarBanner'>{item.name}</div>
            </div>
          )
        })
      }

      <div className='optionsNavbarBanner'>
        <div className='allOptionsNavbarBanner'>Amazon MiniT</div>
      </div>

      </div>


{/* <div className='optionsNavbarBanner'>
  <div className='allOptionsNavbarBanner'>
    <Link href='/eco-page'>
      <button className='flex items-center gap-2 rounded-full bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition'>
        <FaLeaf className='text-white' />
        Eco-Page
      </button>
    </Link>
  </div>
</div> */}


      <div className="navbarBannerRightSide">
        <img src="https://f.media-amazon.com/images/G/31/img19/SiddMiniTV/26MayHero/SWM_400x391._CB557661637_.jpg" alt='amazonPrime Logo' />
      </div>
    </div>
  )
}

export default NavbarBanner
