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
import StudentsTable from './Components/StudentsTable.jsx';
import ClassroomsTable from './Components/ClassroomsTable.jsx';
import GroupesTable from './Components/GroupesTable.jsx';
import LevelsTable from './Components/LevelsTable.jsx';
import SpecialtyTable from './Components/SpecialtyTable.jsx';
import SubjectsTable from './Components/SubjectsTable.jsx';
import TeacherTable from './Components/TeacherTable.jsx';

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
            { path: 'dashboard', element: <MainContent />, 
                children : [
                    { index: true, element: <Navigate to="dep" replace /> },
                    { path: 'dep', element: <DepartementTable /> },
                    { path : 'students', element: <StudentsTable />},
                    { path : 'classrooms/:depid', element: <ClassroomsTable />},
                    { path : 'groupes/:levelid', element: <GroupesTable />},
                    { path : 'levels/:specid', element: <LevelsTable />},
                    { path : 'specialties/:depid', element: <SpecialtyTable />},
                    { path : 'subjects/:levelid', element: <SubjectsTable />},
                    { path : 'students', element: <StudentsTable />},
                    { path : 'teachers', element: <TeacherTable />}
                ]
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)