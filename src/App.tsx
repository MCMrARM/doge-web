import React, {FocusEvent, useEffect, useState} from 'react';
import './App.sass';
import {BrowserRouter, NavLink, Switch, Route, withRouter, RouteComponentProps, Redirect} from "react-router-dom";
import {Home} from "./Home";
import {AdminMain} from "./admin/AdminMain";
import AuthApiClient from "./AuthApiClient";
import {DiscordAuthPage} from "./DiscordAuthPage";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store";
import {ExpandMoreIcon} from "./icons/Icons";
import { logOut } from './redux/user';

function TopBarUserSection(props: RouteComponentProps) {
    const userInfo = useSelector((s: RootState) => s.user.user);
    const [expanded, setExpanded] = useState(false);
    if (userInfo) {
        let userMenu = expanded && (
            <ul className="TopBarUserSection-menu" onClick={(e) => e.stopPropagation()}>
                <li><NavLink to={{pathname: "/auth/logout", state: {returnTo: props.location}}} onClick={() => setExpanded(false)}>Log out</NavLink></li>
            </ul>
        );
        let onBlur = (ev: FocusEvent) => { if (!ev.currentTarget.contains(ev.relatedTarget as Node)) setExpanded(false) };
        return (<div className={"TopBarUserSection" + (expanded ? " TopBarUserSection-expanded" : "")} onClick={() => setExpanded(!expanded)} tabIndex={0} onBlur={onBlur}>
            <img src={`https://cdn.discordapp.com/avatars/${userInfo.user.id}/${userInfo.user.avatar}.png?size=64`} alt="User Avatar" className="TopBarUserSection-avatar" />
            <span>{userInfo.user.username}</span>
            <ExpandMoreIcon className={"TopBarUserSection-expandIcon"} />
            {userMenu}
        </div>);
    } else {
        return <a href={`https://discord.com/api/oauth2/authorize?client_id=${AuthApiClient.clientId}&response_type=code&scope=identify%20guilds&redirect_uri=${encodeURIComponent("http://localhost:3001/auth/discord")}`} className="App-topNav-login">Log in</a>;
    }
}
const TopBarUserSectionWithRouter = withRouter(TopBarUserSection);

function LogOutPage(props: RouteComponentProps) {
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(logOut());
    });
    return <Redirect to={(props.location.state as any)?.returnTo || {pathname: "/"}} />;
}
const LogOutPageWithRouter = withRouter(LogOutPage);

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <div className="App-topNavContainer">
                    <nav className="App-topNav">
                        <h1>Doge Bot</h1>
                        <ul className="App-topNav-menu">
                            <li><NavLink to="/" exact={true}>Home</NavLink></li>
                            <li><NavLink to="/admin">Administration</NavLink></li>
                            <li><NavLink to="/leaderboard">Leaderboard</NavLink></li>
                            <li><NavLink to="/help">Help</NavLink></li>
                        </ul>
                        <TopBarUserSectionWithRouter />
                    </nav>
                </div>
                <div className="App-contentContainer">
                    <Switch>
                        <Route path="/auth/logout">
                            <LogOutPageWithRouter />
                        </Route>
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
