import React, {FocusEvent, useEffect, useState} from 'react';
import './App.sass';
import {
    BrowserRouter,
    NavLink,
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
    Redirect,
    useRouteMatch
} from "react-router-dom";
import {Home} from "./Home";
import {AdminMain, AdminRedirectToLast} from "./admin/AdminMain";
import {createDiscordLoginUrl, DiscordAuthPage} from "./DiscordAuthPage";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store";
import {ExpandMoreIcon, MenuIcon} from "./icons/Icons";
import {logout} from "./redux/user";
import {Leaderboard} from "./Leaderboard";

function useActiveServerId(): string|null {
    const matchLb = useRouteMatch<{id: string}>("/:id/leaderboard");
    const matchAdmin = useRouteMatch<{id: string}>("/:id/admin");
    if (matchLb)
        return matchLb.params.id;
    if (matchAdmin)
        return matchAdmin.params.id;
    return null;
}

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
        return <a href={createDiscordLoginUrl(props.location.pathname)} className="App-topNav-login">Log in</a>;
    }
}
const TopBarUserSectionWithRouter = withRouter(TopBarUserSection);

function TopBar() {
    const currentServerId = useActiveServerId();
    const serverPrefix = currentServerId ? `/${currentServerId}` : "";
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <nav className="App-topNav">
            <h1>Doge Bot</h1>
            <div className="App-topNav-mobileOpen" onClick={() => setMobileOpen(!mobileOpen)}><MenuIcon /></div>
            <div className={"App-topNav-main " + (mobileOpen ? "App-topNav-main-mobileOpen" : "")}>
                <ul className="App-topNav-menu">
                    <li><NavLink to="/" exact={true}>Home</NavLink></li>
                    <li><NavLink to={serverPrefix + "/admin"}>Administration</NavLink></li>
                    <li><NavLink to={serverPrefix + "/leaderboard"}>Leaderboard</NavLink></li>
                    <li><NavLink to="/help">Help</NavLink></li>
                </ul>
                <TopBarUserSectionWithRouter />
            </div>
        </nav>
    );
}

function LogOutPage(props: RouteComponentProps) {
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(logout());
    });
    return <Redirect to={(props.location.state as any)?.returnTo || {pathname: "/"}} />;
}
const LogOutPageWithRouter = withRouter(LogOutPage);

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <div className="App-topNavContainer">
                    <TopBar/>
                </div>
                <div className="App-contentContainer">
                    <Switch>
                        <Route path="/auth/logout">
                            <LogOutPageWithRouter />
                        </Route>
                        <Route path="/auth/discord">
                            <DiscordAuthPage />
                        </Route>
                        <Route path="/:id/admin">
                            <AdminMain />
                        </Route>
                        <Route path="/admin" exact={true}>
                            <AdminRedirectToLast />
                        </Route>
                        <Route path="/:id/leaderboard">
                            <Leaderboard />
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
