import Auth from '../Pages/Authentication/Auth';
import Profile from '../Pages/Profile/Profile';
import MedLensHome from '../Pages/Home/Home';
import UploadReport from '../Pages/UploadReport/UploadReport';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RedirectIfAuthenticated } from '../Components/RedirectIfAuthenticated';
import { ProtectedRoute } from '../Components/ProtectedRoute';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route 
            path='/' 
            element={
              <RedirectIfAuthenticated>
                <MedLensHome/>
              </RedirectIfAuthenticated>
            }
          />
          <Route path='/login' element={<Auth/>}/>
          <Route 
            path='/profile' 
            element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/upload-report' 
            element={
              <ProtectedRoute>
                <UploadReport/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
