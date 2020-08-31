import React from 'react';
import './App.sass';
import {BrowserRouter, NavLink, Switch, Route} from "react-router-dom";
import {Home} from "./Home";
import {AdminMain} from "./admin/AdminMain";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <div className="App-topNavContainer">
                    <nav className="App-topNav">
                        <h1>Doge Bot</h1>
                        <ul>
                            <li><NavLink to="/" exact={true}>Home</NavLink></li>
                            <li><NavLink to="/admin">Administration</NavLink></li>
                            <li><NavLink to="/leaderboard">Leaderboard</NavLink></li>
                            <li><NavLink to="/help">Help</NavLink></li>
                        </ul>
                    </nav>
                </div>
                <div className="App-contentContainer">
                    <Switch>
                        <Route path="/admin/:id">
                            <AdminMain />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
