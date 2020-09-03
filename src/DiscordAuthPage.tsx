import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";
import {login} from "./redux/user";
import {useDispatch} from "react-redux";

export function DiscordAuthPage() {
    const dispatch = useDispatch();
    let query = new URLSearchParams(useLocation().search);
    let code = query.get("code");
    useEffect(() => {
        if (code)
            dispatch(login(code));
    }, [code]);
    return (
        <div>
            <h1>Logging you in...</h1>
        </div>
    );
}