import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from './pages/Login';
import Feed from './pages/Feed';
import Friend from './pages/Friend';
//const Login = lazy(() => import('./pages/Login'));
import { ProvideAuth } from "./context/use-auth.js";

function App() {
  return (
    <ProvideAuth>
      <Router basename={process.env.PUBLIC_URL}>
        <Suspense fallback = {<p>loading...</p>}>
          <Routes>
              <Route path = '/' element ={<Login/>} />
              <Route path = '/feed' element ={<Feed/>} />
              <Route path = '/friends' element ={<Friend/>} />
          </Routes>
        </Suspense>
      </Router>

    </ProvideAuth>
      
   
    
  );
}

export default App;
