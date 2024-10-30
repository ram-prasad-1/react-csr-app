import {useState} from 'react'
import {Routes, Route, Outlet, Link} from "react-router-dom";
import './app.css'
import Home from "@/pages/Home";
import NoMatch from "@/pages/NoMatch";
import DummyPage from "@/pages/DummyPage";


function Routes() {

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/dummy" element={<DummyPage/>}/>

            <Route path="*" element={<NoMatch/>}/>
        </Routes>
    )
}

export default Routes
