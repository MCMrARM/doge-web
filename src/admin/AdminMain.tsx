import React, {useEffect, useState} from 'react';
import './AdminMain.sass';
import {NavLink, Route, Switch, useParams} from "react-router-dom";
import {DashboardIcon, EmojiEventsIcon, ExpandMoreIcon} from "../icons/Icons";
import {Overview} from "./Overview";
import {Leveling} from "./Leveling";
import {useDispatch, useSelector} from 'react-redux';
import {fetchConfig, selectConfigById} from './redux/serverConfig';
import {RootState} from "../store";
import {BotConfig} from "../shared/BotConfig";

export function AdminMain() {
    const dispatch = useDispatch();
    let {id} = useParams<{id: string}>();

    const rConfig = useSelector((s: RootState) => selectConfigById(s, id));
    let mainSwitch;
    useEffect(() => {
        if (!(rConfig?.state))
            dispatch(fetchConfig(id));
    }, [id, rConfig, dispatch]);

    let [editableConfig, setEditableConfig] = useState<BotConfig|null>(null);
    useEffect(() => {
        if (rConfig?.config)
            setEditableConfig(rConfig.config);
    }, [rConfig]);

    if (editableConfig !== null) {
        mainSwitch = (
            <Switch>
                <Route path="/admin/:id/xp">
                    <Leveling config={editableConfig.xp} onChange={(changes) => setEditableConfig({...editableConfig, xp: {...editableConfig!.xp, ...changes}})} />
                </Route>
                <Route path="/admin/:id">
                    <Overview/>
                </Route>
            </Switch>
        );
    } else {
        mainSwitch = (
            <div className="AdminPage">
                <h1 className="AdminPage-Title"><DashboardIcon className="Icon"/> Administration</h1>
                <p>Loading configuration, please wait...</p>
            </div>
        );
    }

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
                    {mainSwitch}
                </div>
            </div>
            <p className="AdminMain-bottomtext">Thank you for using Doge!</p>
        </div>
    );
}