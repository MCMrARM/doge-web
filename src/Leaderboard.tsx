import React, {useEffect, useRef} from "react";
import "./Leaderboard.sass";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store";
import {fetchLeaderboard, selectLeaderboardById} from "./redux/leaderboard";
import {LeaderboardEntry} from "./shared/LeaderboardData";
import {Button} from "./components/Button";
import {colorIntToHexString} from "./colorUtil";
import {usePageScrollCallback} from "./util";

function LeaderboardEntryElementWrapped(props: {rank: number, entry: LeaderboardEntry}) {
    return (
        <div className={"Leaderboard-entry" + (props.entry.userName === null ? " Leaderboard-entry-unknown" : "")}>
            <div className="Leaderboard-rank">{props.rank}</div>
            <img className="Leaderboard-avatar" src={props.entry.userImageUrl} alt="" />
            <div className="Leaderboard-name">{props.entry.userName !== null ? props.entry.userName : "Unknown user"}</div>
            <div className="Leaderboard-counter">
                <span className="title">Messages</span>
                <span className="value">{props.entry.messages}</span>
            </div>
            <div className="Leaderboard-counter">
                <span className="title">Experience</span>
                <span className="value">{props.entry.xp}</span>
            </div>
            <div className="Leaderboard-level">
                <svg>
                    <circle stroke="#aaa" fill="transparent" cx="32" cy="32" r="30" />
                    <circle stroke="white" fill="transparent" strokeWidth="4" strokeDasharray="188.49555921538757 188.49555921538757" strokeDashoffset={188.49555921538757*(1-props.entry.progress)} cx="32" cy="32" r="30" style={{transform: "rotate(-90deg)" ,transformOrigin: "50% 50%"}} />
                </svg>
                <div className="Leaderboard-counter">
                    <span className="title">Level</span>
                    <span className="value">{props.entry.level}</span>
                </div>
            </div>
        </div>
    );
}
const LeaderboardEntryElement = React.memo(LeaderboardEntryElementWrapped);

export function Leaderboard() {
    const {id} = useParams<{id: string}>();
    const dispatch = useDispatch();
    const loadMoreButton = useRef<HTMLButtonElement>(null);
    const rData = useSelector((s: RootState) => selectLeaderboardById(s, id));
    useEffect(() => {
        if (!(rData?.state))
            dispatch(fetchLeaderboard({serverId: id}));
    }, [id, rData, dispatch]);
    usePageScrollCallback(() => {
        if (rData?.state === "available" && rData?.loadMore === undefined && rData?.data?.after) {
            const rect = loadMoreButton.current?.getBoundingClientRect();
            if (!rect || rect.x + rect.width <= 0 || rect.x >= window.innerWidth || rect.y + rect.height <= 0 || rect.y >= window.innerHeight)
                return;
            dispatch(fetchLeaderboard({serverId: id, after: rData.data.after}));
        }
    }, [loadMoreButton]);

    if (rData?.state === "failed") {
        const retry = () => {
            if (rData?.state === "failed")
                dispatch(fetchLeaderboard({serverId: id}));
        };
        return (
            <div style={{marginTop: "64px"}}>
                <h1>An error occurred</h1>
                <p>Leaderboard for this server could not be loaded.</p>
                <Button onClick={retry} style={{marginTop: "16px"}}>Try again</Button>
            </div>
        );
    } else if (rData?.state === "pending") {
        return (
            <div style={{marginTop: "64px"}}>
                <h1>Please wait...</h1>
            </div>
        );
    }

    const loadMore = () => {
        if (rData?.loadMore !== "pending" && rData?.data?.after)
            dispatch(fetchLeaderboard({serverId: id, after: rData.data.after}));
    };

    const xpMultiplier = rData?.data?.meta?.xpMultiplier || 0;
    const avgXp = Math.floor((Math.floor(xpMultiplier * 15) + Math.floor(xpMultiplier * 25)) / 2);

    return (
        <div className="Leaderboard-container">
            <div className="Leaderboard-title">
                <img className="Leaderboard-server-icon" src={rData?.data?.meta?.serverIconUrl} alt="" />
                <span className="Leaderboard-server-name"><strong>{rData?.data?.meta?.serverName}</strong>'s leaderboard</span>
            </div>
            <div className="Leaderboard-main">
                {rData?.data?.leaderboard?.map((x, i) => <LeaderboardEntryElement key={"lb-" + i} rank={i + 1} entry={x}/>)}
                {rData?.loadMore === "pending" && <span>Loading more...</span>}
                {rData?.loadMore !== "pending" && rData?.data?.after && <Button ref={loadMoreButton} theme="colorless" onClick={loadMore}>Load more</Button>}
            </div>
            <div className="Leaderboard-info-ctr">
                <div className="Leaderboard-info">
                    <h3>Information</h3>
                    This is the {rData?.data?.meta?.serverName} server's leaderboard.<br />
                    The server uses a leveling system, which rewards users who are active and engage with the community. Every minute you chat you get around {avgXp}XP.
                </div>
                <div className="Leaderboard-info">
                    <h3>Roles</h3>
                    You can get special roles by leveling up:
                    <table style={{marginTop: "8px"}} className="Leaderboard-role-table">
                        <tbody>
                            {rData?.data?.meta?.xpRoles.map((x, i) => <tr key={"rank-" + i}>
                                <td style={{width: "20%"}} />
                                <td style={{width: "0px"}}><span className="lvl">LVL</span></td>
                                <td style={{width: "0px"}}>{x.level}</td>
                                <td style={{width: "100%"}}><span className="role" style={{color: colorIntToHexString(x.roleColor), borderColor: colorIntToHexString(x.roleColor)}}>{x.roleName}</span></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}