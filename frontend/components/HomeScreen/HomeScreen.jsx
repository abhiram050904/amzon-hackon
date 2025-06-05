import React from 'react'
import HomeScreenBanner from './HomeScreenBanner/HomeScreenBanner'
import HomeDetails from './HomeDetails/HomeDetails'
import HomeHeader from './HomeScreenHeader/HomeHeader'

const HomeScreen = () => {
  return (
    <div className='homeScreen w-full'>
    <HomeHeader/>
      <HomeScreenBanner/>
      <HomeDetails/>
    </div>
  )
}

export default HomeScreen
