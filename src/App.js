// import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import {
  HomePage,
  TasksPage,
  
  // Notes
  CreateNotePage,
  NoteDetailPage,
  NoteListPage,

  // Site
  AboutPage,
  PoliciesPage,
  ContactPage,

  // Auth
  LoginPage,
  SignupPage,
  VerificationPage,
  SettingsPage,
  PasswordChangePage,
  PasswordResetPage,
} from 'pages/exports';
import NavigationDrawer from 'layout/navigationDrawer';
import { useAuthData } from 'hooks/exports';
// import { useEffect } from 'react';
import LoadingScreen from 'LoadingScreen';


export default function App() {
  
  const { isLoading, isLoggedIn } = useAuthData();
  
  // useEffect( () => console.log("Logged In:", isLoggedIn), [isLoggedIn]);
  // useEffect( () => console.log("isLoading:", isLoading), [isLoading]);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      {/* <NavigationDrawer /> */}
      <NavigationDrawer />
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="tasks" element={<TasksPage />}/>
        <Route path="about" element={<AboutPage />}/>
        <Route path="policies" element={<PoliciesPage />}/>
        <Route path="contact" element={<ContactPage />}/>
        
        <Route path="notes">
          <Route path="" element={<NoteListPage />}/>
          <Route path="create" element={<CreateNotePage />}/>
          <Route path=":slug" element={<NoteDetailPage />}/>
        </Route>

        { isLoggedIn
          ? <>
              <Route path="settings" element={<SettingsPage />}/>
              <Route path="password-change" element={<PasswordChangePage />}/>
            </>
          :
            <>
              <Route path="login" element={<LoginPage />}/>
              <Route path="signup" element={<SignupPage />}/>
              <Route path="verify" element={<VerificationPage />}/>
              <Route path="password-reset" element={<PasswordResetPage />}/>
            </>
        }
        <Route path="*" element={<Navigate to="/" replace /> }/>
      </Routes>
    </>
  );
}