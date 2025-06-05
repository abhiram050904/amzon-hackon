'use client'
import HomeScreen from '@/components/HomeScreen/HomeScreen'
import Navbar from '@/components/Navbar/Navbar'
import Image from 'next/image'
import React from 'react'
import image from '../public/image.png'
const page = () => {
  return (
    <div>
    <Navbar/>
    {/* <HomeScreen/> */}
    <div className='w-full'>
      <Image className='w-full' src={image}/>
    </div>
    </div>
  )
}

export default page
