import React from 'react';
import './App.sass';
import {BrowserRouter, NavLink, Switch, Route} from "react-router-dom";
import {Home} from "./Home";
import {AdminMain} from "./admin/AdminMain";
import AuthApiClient from "./AuthApiClient";
import {DiscordAuthPage} from "./DiscordAuthPage";
import {useSelector} from "react-redux";
import {RootState} from "./store";
import {ExpandMoreIcon} from "./icons/Icons";

function TopBarUserSection() {
    const userInfo = useSelector((s: RootState) => s.user.user);
    if (userInfo) {
        return (<div className="TopBarUserSection">
            <img src={`https://cdn.discordapp.com/avatars/${userInfo.user.id}/${userInfo.user.avatar}.png?size=64`} alt="User Avatar" className="TopBarUserSection-avatar" />
            <span>{userInfo.user.username}</span>
            <ExpandMoreIcon className={"TopBarUserSection-expandIcon"} />
        </div>);
    } else {
        return <a href={`https://discord.com/api/oauth2/authorize?client_id=${AuthApiClient.clientId}&response_type=code&scope=identify%20guilds&redirect_uri=${encodeURIComponent("http://localhost:3001/auth/discord")}`}>Log in</a>;
    }
}

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
                        <TopBarUserSection />
                    </nav>
                </div>
                <div className="App-contentContainer">
                    <Switch>
                        <Route path="/auth/discord">
                            <DiscordAuthPage />
                        </Route>
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
