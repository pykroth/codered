import { useState } from 'react'
import Auth from '../Pages/Authentication/Auth';
import Profile from '../Pages/Profile/Profile';
import MedLensHome from '../Pages/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
        <Router>
      <Routes>
        <Route path='/' element={<MedLensHome/>}/>
        <Route path='/login' element={<Auth/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
       </Router>
    </>
  )
}

export default App
