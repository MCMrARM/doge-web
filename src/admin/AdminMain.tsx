import React, {FocusEvent, useEffect, useRef, useState} from 'react';
import './AdminMain.sass';
import {NavLink, Link, Route, Switch, useParams, Redirect} from "react-router-dom";
import {DashboardIcon, EmojiEventsIcon, ExpandMoreIcon, HistoryEduIcon} from "../icons/Icons";
import {Overview} from "./Overview";
import {Leveling} from "./Leveling";
import {useDispatch, useSelector} from 'react-redux';
import {fetchConfig, selectConfigById} from './redux/serverConfig';
import {fetchServerInfo, selectServerInfoById} from "./redux/serverInfo";
import {RootState} from "../store";
import {BotConfig} from "../shared/BotConfig";
import {Button} from "../components/Button";
import {ServerInfo} from "../shared/ServerInfo";
import {fetchGuildList} from "../redux/guildList";
import {GuildListEntry} from "../AuthApiClient";
import {Logging} from "./Logging";

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

function GuildListDropdown(props: {list: GuildListEntry[]}) {
    const guildElements = (props.list || []).map((g) => {
        let iconUrl = g.icon ? "https://cdn.discordapp.com/icons/" + g.id + "/" + g.icon + ".png?size=32" : null;
        return (
            <li>
                <Link to={`/admin/${g.id}`}>
                    <img src={iconUrl || "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"} alt="Server Icon" className="Icon" />
                    {g.name}
                </Link>
            </li>
        );
    });

    return <ul className="AdminName-sidebar-server-list">
        {guildElements}
    </ul>;
}

export function AdminMain() {
    const dispatch = useDispatch();
    let {id} = useParams<{id: string}>();

    useEffect(() => {
        localStorage.lastAdminServerId = id;
    }, [id]);

    let [serverListExpanded, setServerListExpanded] = useState(false);
    let onServerListBlur = (ev: FocusEvent) => { if (!ev.currentTarget.contains(ev.relatedTarget as Node)) setServerListExpanded(false) };

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
        content = <AdminMainRouter server={rServerInfo.info} config={rConfig.config} />;
    } else if (rServerInfo?.state === "failed" || rConfig?.state === "failed") {
        let retry = () => {
            if (rServerInfo?.state === "failed")
                dispatch(fetchServerInfo(id));
            if (rConfig?.state === "failed")
                dispatch(fetchConfig(id));
        };
        content = (
            <div className="AdminPage">
                <h1 className="AdminPage-Title"><DashboardIcon className="Icon"/> Administration</h1>
                <p>Failed to load server information</p>
                <Button onClick={retry}>Try again</Button>
            </div>
        );
    } else {
        content = (
            <div className="AdminPage">
                <h1 className="AdminPage-Title"><DashboardIcon className="Icon"/> Administration</h1>
                <p>Loading current configuration and server information, please wait...</p>
            </div>
        );
    }

    const guildList = useSelector((s: RootState) => s.guildList);
    useEffect(() => {
        if (!guildList.state)
            dispatch(fetchGuildList());
    }, [guildList, dispatch]);
    let serverListDropDown = serverListExpanded && <GuildListDropdown list={guildList.list || []} />;

    return (
        <div>
            <div className="AdminMain">
                <div className="AdminMain-sidebar">
                    <div className="AdminName-sidebar-server" onClick={() => setServerListExpanded(!serverListExpanded)} onBlur={onServerListBlur} tabIndex={0}>
                        <img src={rServerInfo?.info?.iconUrl || "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"} alt="Server Icon" className="Icon" />
                        {rServerInfo?.info?.name || "Server"}
                        <ExpandMoreIcon className="AdminName-sidebar-server-expand" />
                        {serverListDropDown}
                    </div>
                    <nav>
                        <ul>
                            <li><NavLink to={`/admin/${id}`} exact={true}><DashboardIcon className="Icon"/> Overview</NavLink></li>
                            <li><NavLink to={`/admin/${id}/xp`}><EmojiEventsIcon className="Icon"/> Leveling</NavLink></li>
                            <li><NavLink to={`/admin/${id}/log`}><HistoryEduIcon className="Icon"/> Logging</NavLink></li>
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

function AdminMainRouter(props: {server: ServerInfo, config: BotConfig}) {
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
                    <Leveling server={props.server} config={editableConfig.xp} onChange={(changes) => setEditableConfig({...editableConfig, xp: {...editableConfig!.xp, ...changes}})} />
                </Route>
                <Route path="/admin/:id/log">
                    <Logging server={props.server} config={editableConfig.log} onChange={(changes) => setEditableConfig({...editableConfig, log: {...editableConfig!.log, ...changes}})} />
                </Route>
                <Route path="/admin/:id">
                    <Overview/>
                </Route>
            </Switch>
            <div className={"AdminMain-unsavedPopup-container" + (hasChanges ? " AdminMain-unsavedPopup-container-visible" : "")}>
                <div className="AdminMain-unsavedPopup">
                    <span className="AdminMain-unsavedPopupText">You have unsaved changes!</span>
                    <Button theme="secondary" onClick={() => setEditableConfig(props.config)}>Revert</Button>
                    <Button>Save and apply</Button>
                </div>
            </div>
        </div>
    );
}

export function AdminRedirectToLast() {
    let dispatch = useDispatch();
    let [serverId, setServerId] = useState(localStorage.lastAdminServerId);

    const guildList = useSelector((s: RootState) => s.guildList);
    useEffect(() => {
        if (!guildList.state && !serverId)
            dispatch(fetchGuildList());
        if (guildList.list && guildList.list.length > 0 && !serverId)
            setServerId(guildList.list[0].id)
    }, [guildList, serverId, dispatch]);

    if (serverId)
        return <Redirect to={`/admin/${serverId}`} />;
    return null;
}
