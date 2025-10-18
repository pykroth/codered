import { useState } from 'react'
import Auth from '../Pages/Authentication/Auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
        <Router>
      <Routes>
        <Route path='/login' element={<Auth/>} />
      </Routes>
      <div>
        <p className=''>hi</p>
       </div>
       </Router>
    </>
  )
}

export default App
