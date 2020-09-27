import React, {FocusEvent, ReactNode, ReactNodeArray, useEffect, useLayoutEffect, useRef, useState} from 'react';
import './AdminMain.sass';
import {NavLink, Link, Route, Switch, useParams, Redirect, useLocation} from "react-router-dom";
import {
    ContactIcon,
    DashboardIcon,
    EmojiEventsIcon,
    ExpandMoreIcon,
    HistoryEduIcon,
    SecurityIcon,
    AccessTimeIcon, CloseIcon
} from "../icons/Icons";
import {Overview} from "./Overview";
import {Leveling} from "./Leveling";
import {useDispatch, useSelector} from 'react-redux';
import {fetchConfig, selectConfigById, uploadConfig} from './redux/serverConfig';
import {fetchServerInfo, selectServerInfoById} from "./redux/serverInfo";
import {RootState} from "../store";
import {BotConfig} from "../shared/BotConfig";
import {Button} from "../components/Button";
import {ServerInfo} from "../shared/ServerInfo";
import {fetchGuildList} from "../redux/guildList";
import {GuildListEntry} from "../AuthApiClient";
import {Logging} from "./Logging";
import {WelcomeCard} from "./WelcomeCard";
import {Permissions} from "./Permissions";
import {PersistentRoles} from "./PersistentRoles";
import {JsonEdit} from "./JsonEdit";
import {EmbedStudio} from "./embed/EmbedStudio";

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
            <li key={g.id}>
                <Link to={`/${g.id}/admin`}>
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
    const location = useLocation();
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

    const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
    const mobileHeaderComponent = (props: {to: string, exact?: boolean, children: ReactNode|ReactNode[]}) => {
        return (
            <Route path={props.to} exact={props.exact}>
                {props.children}
            </Route>
        );
    };

    useLayoutEffect(() => {
        setMobileSidebarVisible(false);
    }, [location]);

    return (
        <div>
            <div className="AdminMain">
                <div className="AdminMain-mobileHeader">
                    <div className="AdminName-sidebar-server" onClick={() => setServerListExpanded(!serverListExpanded)} onBlur={onServerListBlur} tabIndex={0}>
                        <img src={rServerInfo?.info?.iconUrl || "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"} alt="Server Icon" className="Icon" />
                        {rServerInfo?.info?.name || "Server"}
                        <ExpandMoreIcon className="AdminName-sidebar-server-expand" />
                        {serverListDropDown}
                    </div>
                    <div className="AdminMain-mobileHeader-current" onClick={() => setMobileSidebarVisible(true)}>
                        <AdminMainLinkList id={id} component={mobileHeaderComponent} />
                        <ExpandMoreIcon className="AdminMain-mobileHeader-current-expand" />
                    </div>
                </div>
                <div className={"AdminMain-sidebar" + (mobileSidebarVisible ? " AdminMain-sidebar-mobileVisible" : "")}>
                    <div className="AdminName-sidebar-server" onClick={() => setServerListExpanded(!serverListExpanded)} onBlur={onServerListBlur} tabIndex={0}>
                        <img src={rServerInfo?.info?.iconUrl || "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"} alt="Server Icon" className="Icon" />
                        {rServerInfo?.info?.name || "Server"}
                        <ExpandMoreIcon className="AdminName-sidebar-server-expand" />
                        {serverListDropDown}
                        <div className="AdminName-sidebar-mobileClose" onClick={(ev) => { setMobileSidebarVisible(false); ev.stopPropagation(); }}><CloseIcon /></div>
                    </div>
                    <nav>
                        <ul>
                            <li><NavLink to={`/${id}/admin`} exact={true}><DashboardIcon className="Icon"/> Overview</NavLink></li>
                            <li><NavLink to={`/${id}/admin/embed`}><DashboardIcon className="Icon"/> Embed Studio</NavLink></li>
                            <li><NavLink to={`/${id}/admin/xp`}><EmojiEventsIcon className="Icon"/> Leveling</NavLink></li>
                            <li><NavLink to={`/${id}/admin/log`}><HistoryEduIcon className="Icon"/> Logging</NavLink></li>
                            <li><NavLink to={`/${id}/admin/welcome`}><ContactIcon className="Icon"/> Welcome Card</NavLink></li>
                            <li><NavLink to={`/${id}/admin/role`}><AccessTimeIcon className="Icon"/> Saved & Timed Roles</NavLink></li>
                            <li><NavLink to={`/${id}/admin/permission`}><SecurityIcon className="Icon"/> Permissions</NavLink></li>
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

function AdminMainLinkList(props: {component: React.ComponentType<{to: string, exact?: boolean, children: ReactNode|ReactNode[]}>, id: string}) {
    const {id} = props;
    return (
        <React.Fragment>
            <props.component to={`/${id}/admin`} exact={true}><DashboardIcon className="Icon"/> Overview</props.component>
            <props.component to={`/${id}/admin/embed`}><DashboardIcon className="Icon"/> Embed Studio</props.component>
            <props.component to={`/${id}/admin/xp`}><EmojiEventsIcon className="Icon"/> Leveling</props.component>
            <props.component to={`/${id}/admin/log`}><HistoryEduIcon className="Icon"/> Logging</props.component>
            <props.component to={`/${id}/admin/welcome`}><ContactIcon className="Icon"/> Welcome Card</props.component>
            <props.component to={`/${id}/admin/role`}><AccessTimeIcon className="Icon"/> Saved & Timed Roles</props.component>
            <props.component to={`/${id}/admin/permission`}><SecurityIcon className="Icon"/> Permissions</props.component>
        </React.Fragment>
    )
}

function AdminMainRouter(props: {server: ServerInfo, config: BotConfig}) {
    const dispatch = useDispatch();

    let [editableConfig, setEditableConfig] = useState<BotConfig>(props.config);
    let [overrideImages, setOverrideImages] = useState<{[key: string]: [string, File]}>({});
    useEffect(() => {
        if (props.config) {
            setEditableConfig(props.config);
            setOverrideImages({});
        }
    }, [props.config]);

    let debouncedEditableConfig = useDebounce(editableConfig, 100);
    let [hasChanges, setHasChanges] = useState(false);
    useEffect(() => {
        setHasChanges(JSON.stringify(debouncedEditableConfig) !== JSON.stringify(props.config));
    }, [debouncedEditableConfig, props.config]);
    let uiHasChanges = hasChanges || Object.keys(overrideImages).length > 0;

    let save = () => {
        const images: {[key: string]: string} = {};
        for (const k in overrideImages)
            images[k] = overrideImages[k][0];
        dispatch(uploadConfig({serverId: props.server.id, config: editableConfig, images: images}));
    };

    return (
        <div>
            <Switch>
                <Route path="/:id/admin/embed">
                    <EmbedStudio server={props.server} />
                </Route>
                <Route path="/:id/admin/xp">
                    <Leveling server={props.server} config={editableConfig.xp} onChange={(changes) => setEditableConfig({...editableConfig, xp: {...editableConfig!.xp, ...changes}})} />
                </Route>
                <Route path="/:id/admin/log">
                    <Logging server={props.server} config={editableConfig.log} onChange={(changes) => setEditableConfig({...editableConfig, log: {...editableConfig!.log, ...changes}})} />
                </Route>
                <Route path="/:id/admin/welcome">
                    <WelcomeCard server={props.server} config={editableConfig.welcome} onChange={(changes) => setEditableConfig({...editableConfig, welcome: {...editableConfig!.welcome, ...changes}})} overrideImages={overrideImages} onSetImage={(k, v, f) => setOverrideImages({...overrideImages, [k]: [v, f]})} />
                </Route>
                <Route path="/:id/admin/role">
                    <PersistentRoles server={props.server} config={editableConfig.role} onChange={(changes) => setEditableConfig({...editableConfig, role: {...editableConfig!.role, ...changes}})} />
                </Route>
                <Route path="/:id/admin/permission">
                    <Permissions server={props.server} config={editableConfig.permission} onChange={(changes) => setEditableConfig({...editableConfig, permission: {...editableConfig!.permission, ...changes}})} />
                </Route>
                <Route path="/:id/admin/rawjson">
                    <JsonEdit server={props.server} config={editableConfig} onChange={(config) => setEditableConfig(config)} />
                </Route>
                <Route path="/:id/admin">
                    <Overview/>
                </Route>
            </Switch>
            <div className={"AdminMain-unsavedPopup-container" + (uiHasChanges ? " AdminMain-unsavedPopup-container-visible" : "")}>
                <div className="AdminMain-unsavedPopup">
                    <span className="AdminMain-unsavedPopupText">You have unsaved changes!</span>
                    <Button theme="secondary" onClick={() => { setEditableConfig(props.config); setOverrideImages({}); }}>Revert</Button>
                    <Button onClick={() => save()}>Save and apply</Button>
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
        return <Redirect to={`/${serverId}/admin`} />;
    return null;
}
