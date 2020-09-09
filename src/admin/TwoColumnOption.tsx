import React from 'react';
import './TwoColumnOption.sass';

export function TwoColumnOption(props: { title: React.ReactNode, description?: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="TwoColumnOption">
            <div className="TwoColumnOption-info" style={props.description ? {} : {alignSelf: "center"}}>
                <h3>{props.title}</h3>
                <p>{props.description}</p>
            </div>
            {props.children}
        </div>
    );
}