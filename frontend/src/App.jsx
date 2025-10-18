import Auth from '../Pages/Authentication/Auth';
import Profile from '../Pages/Profile/Profile';
import MedLensHome from '../Pages/Home/Home';
import UploadReport from '../Pages/UploadReport/UploadReport';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
        <Router>
      <Routes>
        <Route path='/' element={<MedLensHome/>}/>
        <Route path='/login' element={<Auth/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/upload-report' element={<UploadReport/>}/>
      </Routes>
       </Router>
    </>
  )
}

export default App
