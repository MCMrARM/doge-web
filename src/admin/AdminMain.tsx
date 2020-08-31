import React from 'react';
import './AdminMain.sass';
import {NavLink, Route, Switch, useParams} from "react-router-dom";
import {DashboardIcon, EmojiEventsIcon, ExpandMoreIcon} from "../icons/Icons";
import {Overview} from "./Overview";
import {Leveling} from "./Leveling";

export function AdminMain() {
    let {id} = useParams<{id: string}>();
    return (
        <div>
            <div className="AdminMain">
                <div className="AdminMain-sidebar">
                    <div className="AdminName-sidebar-server">
                        <img src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E" className="Icon" />
                        Server Name
                        <ExpandMoreIcon className="AdminName-sidebar-server-expand" />
                    </div>
                    <nav>
                        <ul>
                            <li><NavLink to={`/admin/${id}`} exact={true}><DashboardIcon className="Icon"/> Overview</NavLink></li>
                            <li><NavLink to={`/admin/${id}/xp`}><EmojiEventsIcon className="Icon"/> Leveling</NavLink></li>
                        </ul>
                    </nav>
                </div>
                <div className="AdminMain-content">
                    <Switch>
                        <Route path="/admin/:id/xp">
                            <Leveling/>
                        </Route>
                        <Route path="/admin/:id">
                            <Overview/>
                        </Route>
                    </Switch>
                </div>
            </div>
            <p className="AdminMain-bottomtext">Thank you for using Doge!</p>
        </div>
    );
}