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
import RoleProtection from './Protection/RoleProtection.jsx';
import StudentsTable from './Components/StudentsTable.jsx';
import ClassroomsTable from './Components/ClassroomsTable.jsx';
import GroupesTable from './Components/GroupesTable.jsx';
import LevelsTable from './Components/LevelsTable.jsx';
import SpecialtyTable from './Components/SpecialtyTable.jsx';
import SubjectsTable from './Components/SubjectsTable.jsx';
import TeacherTable from './Components/TeacherTable.jsx';
import ScheduleGroup from './Components/ScheduleGroup.jsx';
import ScheduleClassroom from './Components/ScheduleClassroom.jsx';
import ScheduleTeacher from './Components/ScheduleTeacher.jsx';
import StudentAbsenceCards from './Components/StudentAbsenceCards.jsx';
import TeacherHome from './Pages/Dashboard/TeacherHome.jsx';
import StudentHome from './Pages/Dashboard/StudentHome.jsx';
import ChefHome from './Pages/Dashboard/ChefHome.jsx';

// Create static router with all routes
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'forget-password', element: <ForgetPasswordPage /> },
            { path: 'reset-password/:token', element: <ResetPasswordPage /> },
            
            // Admin routes
            {
                path: 'dashboard',
                element: (
                        <MainContent />
                ),
                children: [
                    { path: 'dep', element: <DepartementTable /> },
                    { path: 'students', element: <StudentsTable /> },
                    { path: 'classrooms/:depid', element: <ClassroomsTable /> },
                    { path: 'groupes/:levelid', element: <GroupesTable /> },
                    { path: 'levels/:specid', element: <LevelsTable /> },
                    { path: 'specialties/:depid', element: <SpecialtyTable /> },
                    { path: 'subjects/:levelid', element: <SubjectsTable /> },
                    { path: 'teachers', element: <TeacherTable /> },
                    { path: 'schedulegroupe/:idgroupe', element: <ScheduleGroup /> },
                    { path: 'scheduleclassroom/:idclassroom', element: <ScheduleClassroom /> },
                    { path: 'scheduleteacher/:idteacher', element: <ScheduleTeacher /> },
                ]
            },
            
            // Chef (Department Head) routes
            {
                path: 'chef-dashboard',
                element: (
                        <MainContent />
                ),
                children: [
                    { index: true, element: <ChefHome /> },
                    { path: 'specialties/:depid', element: <SpecialtyTable /> },
                ]
            },
            
            // Teacher routes
            {
                path: 'teacher-dashboard',
                element: (
                        <MainContent />
                ),
                children: [
                    { index: true, element: <TeacherHome /> },
                    { path: 'schedule/:id', element: <ScheduleTeacher /> },
                ]
            },
            
            // Student routes
            {
                path: 'student-dashboard',
                element: (
                        <MainContent />
                ),
                children: [
                    { index: true, element: <StudentHome /> },
                    { path: 'absence-cards/:id', element: <StudentAbsenceCards /> },
                    { path: 'schedule', element: <ScheduleGroup /> },
                ]
            },
            
            // Not found route
            { path: '*', element: <NotFound /> }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)