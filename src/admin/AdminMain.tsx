import React, {useEffect, useRef, useState} from 'react';
import './AdminMain.sass';
import {NavLink, Route, Switch, useParams} from "react-router-dom";
import {DashboardIcon, EmojiEventsIcon, ExpandMoreIcon} from "../icons/Icons";
import {Overview} from "./Overview";
import {Leveling} from "./Leveling";
import {useDispatch, useSelector} from 'react-redux';
import {fetchConfig, selectConfigById} from './redux/serverConfig';
import {fetchServerInfo, selectServerInfoById} from "./redux/serverInfo";
import {RootState} from "../store";
import {BotConfig} from "../shared/BotConfig";
import {Button} from "../components/Button";
import {ServerInfo} from "../shared/ServerInfo";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    let current = useRef<T>(value);
    current.current = value;
    let timeout = useRef<NodeJS.Timeout|null>(null);

    useEffect(() => {
        return () => {
            if (timeout.current !== null) {
                clearTimeout(timeout.current);
                timeout.current = null;
            }
        }
    }, []);
    useEffect(() => {
        if (timeout.current === null) {
            timeout.current = setTimeout(() => {
                setDebouncedValue(current.current);
                timeout.current = null;
            }, delay);
        }
    }, [value, delay]);
    return debouncedValue;
}

export function AdminMain() {
    const dispatch = useDispatch();
    let {id} = useParams<{id: string}>();

    const rServerInfo = useSelector((s: RootState) => selectServerInfoById(s, id));
    useEffect(() => {
        if (!(rServerInfo?.state))
            dispatch(fetchServerInfo(id));
    }, [id, rServerInfo, dispatch]);

    const rConfig = useSelector((s: RootState) => selectConfigById(s, id));
    useEffect(() => {
        if (!(rConfig?.state))
            dispatch(fetchConfig(id));
    }, [id, rConfig, dispatch]);

    let content;
    if (rServerInfo?.info && rConfig?.config) {
        content = <AdminMainRouter serverInfo={rServerInfo.info} config={rConfig.config} />;
    } else {
        content = (
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
                        <img src={rServerInfo?.info?.iconUrl || "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"} alt="Server Icon" className="Icon" />
                        {rServerInfo?.info?.name || "Server"}
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
                    {content}
                </div>
            </div>
            <p className="AdminMain-bottomtext">Thank you for using Doge!</p>
        </div>
    );
}

function AdminMainRouter(props: {serverInfo: ServerInfo, config: BotConfig}) {
    let [editableConfig, setEditableConfig] = useState<BotConfig>(props.config);
    useEffect(() => {
        if (props.config)
            setEditableConfig(props.config);
    }, [props.config]);

    let debouncedEditableConfig = useDebounce(editableConfig, 100);
    let [hasChanges, setHasChanges] = useState(false);
    useEffect(() => {
        setHasChanges(JSON.stringify(debouncedEditableConfig) !== JSON.stringify(props.config));
    }, [debouncedEditableConfig, props.config]);

    return (
        <div>
            <Switch>
                <Route path="/admin/:id/xp">
                    <Leveling config={editableConfig.xp} onChange={(changes) => setEditableConfig({...editableConfig, xp: {...editableConfig!.xp, ...changes}})} />
                </Route>
                <Route path="/admin/:id">
                    <Overview/>
                </Route>
            </Switch>
            <div className={"AdminMain-unsavedPopup-container" + (hasChanges ? " AdminMain-unsavedPopup-container-visible" : "")}>
                <div className="AdminMain-unsavedPopup">
                    <span className="AdminMain-unsavedPopupText">You have unsaved changes!</span>
                    <Button theme="secondary">Revert</Button>
                    <Button>Save and apply</Button>
                </div>
            </div>
        </div>
    );
}