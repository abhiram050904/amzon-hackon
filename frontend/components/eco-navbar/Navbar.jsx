'use client'
import React from 'react'
import NavbarBanner from './NavbarBanner'
import NavbarBelt from './NavbarBelt'

const Navbar = () => {
  return (
    <div className='flex flex-col w-full'>
      <NavbarBelt/>
      <NavbarBanner/>
    </div>
  )
}

export default Navbar
