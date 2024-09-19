import React from 'react'
import { Route, Routes } from "react-router-dom"
import Login from '../pages/Login/login'
import Register from '../pages/Register/register'
import AdminDashboard from '../pages/adminDashboard/adminDashboard'
import Load from '../pages/adminDashboard/load/load'
import Reportes from '../pages/adminDashboard/reportes/reportes'
import HeaderAdmin from '../components/HeaderAdmin'
import ViewUser from '../pages/adminDashboard/viewuser/viewuser'
import User from '../pages/adminDashboard/viewuser/user'
import PostsView from '../pages/adminDashboard/viewpost/postview'
import Post from '../pages/adminDashboard/viewpost/post'
import UserHome from '../pages/userDashboard/inicio'
import Trending from '../pages/userDashboard/tendencias'
import Profile from '../pages/userDashboard/profile/profile'
import NewUserPost from '../pages/userDashboard/post/post'
import UserProfile from '../pages/userDashboard/profile/usersProfile'
export const AppRouter = () => {
  return (

      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
        <Route path='/admin/load' element={<Load/>}/>
        <Route path='/admin/reportes' element={<Reportes/>}/>
        <Route path='/HeaderAdmin' element={<HeaderAdmin/>}/>
        <Route path='/admin/userview' element={<ViewUser/>}/>
        <Route path='/admin/userview/user' element={<User/>}/>
        <Route path='/admin/userview/user/:username' element={<User/>}/>
        <Route path='/admin/posts' element={<PostsView/>}/>
        <Route path='/admin/posts/post/:id' element={<Post/>}/>
        <Route path='/inicio' element={<UserHome/>}/>
        <Route path='/trending' element={<Trending/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/NewPost' element={<NewUserPost/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path="/user/:username" element={<UserProfile/>} />
    </Routes>
)
}

