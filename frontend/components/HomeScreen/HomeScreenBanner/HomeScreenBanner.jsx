import Image from 'next/image'
import React from 'react'
import banner from '../../../public/banner1.jpg'
import './HomeScreenBanner.css';
import bag from '../../../public/juteBag.png'
const HomeScreenBanner = () => {
  return (
    <div className='homeBanner w-full'>
      <Image src={banner}  className='homeBannerimg'/>
      <div className='grayBackgroundHomeBanner'></div>

      {/* <div className='homeBannerItemDiv'>
        <div className='homeBannerItemDivCard'>
          <div className='homeBannerItemDivCardTitle'>Title</div>
          <div className='imgHomeBannerItemDivCard'>
            <div className='imgBannerHomeDiv'>
              <Image className='imgBannerHomeDivImg' src={bag}/>
              <div className='imgBannerImgName'>Bags,Cushion covers &more</div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
    
  )
}

export default HomeScreenBanner
