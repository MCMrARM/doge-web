import React, {useEffect, useState} from "react";
import { useLocation, Redirect } from "react-router-dom";
import {login, clearPendingLoginError} from "./redux/user";
import {useDispatch, useSelector} from "react-redux";
import AuthApiClient from "./AuthApiClient";
import {RootState} from "./store";
import {generateRandomHexString} from "./util";

export function createDiscordLoginUrl(returnTo: string) {
    if (!localStorage.discordLoginNonce)
        localStorage.discordLoginNonce = generateRandomHexString();
    let state = JSON.stringify({
        nonce: localStorage.discordLoginNonce,
        returnTo: returnTo
    });
    return `https://discord.com/api/oauth2/authorize?client_id=${AuthApiClient.clientId}&response_type=code&scope=identify%20guilds&redirect_uri=${encodeURIComponent("http://localhost:3001/auth/discord")}&state=${encodeURIComponent(state)}`;
}

export function DiscordAuthPage() {
    const dispatch = useDispatch();
    let query = new URLSearchParams(useLocation().search);
    let stateStr = query.get("state");
    let code = query.get("code");
    let user = useSelector((s: RootState) => s.user);
    let [dispatchedLogin, setDispatchedLogin] = useState(false);
    let [invalid, setInvalid] = useState(false);
    useEffect(() => {
        let state = stateStr ? JSON.parse(stateStr) : {};
        if (state.nonce !== localStorage.discordLoginNonce) {
            console.log(state.nonce, localStorage.discordLoginNonce);
            setInvalid(true);
            return;
        }
        localStorage.discordLoginNonce = null;
        if (code) {
            setDispatchedLogin(true);
            dispatch(login(code));
        }
    }, [dispatch, stateStr, code]);
    useEffect(() => {
        if (user.hasPendingError)
            dispatch(clearPendingLoginError());
    }, [dispatch, user]);
    if (dispatchedLogin && user.user) {
        let state = stateStr ? JSON.parse(stateStr) : {};
        let redirectTo = typeof(state.returnTo) === "string" ? state.returnTo : "/";
        return (
            <Redirect to={redirectTo} />
        );
    }
    if (invalid) {
        return (
            <div>
                <h1>Couldn't log you in</h1>
                <p>Something went wrong, sorry! Please try again.</p>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Logging you in...</h1>
            </div>
        );
    }
}