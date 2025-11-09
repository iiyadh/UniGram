import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import App from './App.jsx'
import LandingPage from './Pages/LandingPage.jsx';
import NotFound from './Pages/NotFound.jsx';
import LoginPage from './Pages/AuthPages/LoginPage.jsx';
import ForgetPasswordPage from './Pages/AuthPages/ForgetPasswordPage.jsx';
import ResetPasswordPage from './Pages/AuthPages/ResetPasswordPage.jsx';
import MainContent from './Pages/Dashboard/MainContent.jsx';
import DepartementTable from './Components/DepartementTable.jsx';
import AuthProtection from './Protection/AuthProtection.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {index: true, element: <LandingPage />},
            { path: 'login' , element: <LoginPage /> },
            { path: 'forget-password' , element: <ForgetPasswordPage /> },
            { path: 'reset-password/:token' , element: <ResetPasswordPage /> },
            { path: '*' , element: <NotFound /> },
            { path: 'dashboard', element: <AuthProtection><MainContent /></AuthProtection>, 
                children : [
                    { index: true, element: <Navigate to="dep" /> },
                    { path: 'dep', element: <DepartementTable />},
                ]
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)