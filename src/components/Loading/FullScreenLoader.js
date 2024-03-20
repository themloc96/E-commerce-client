import React from 'react'
import { ClipLoader } from 'react-spinners'

export default function FullScreenLoader() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <ClipLoader color="#fc5000" />
    </div>
  )
}
