import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export function DashboardIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M5 5h4v6H5zm10 8h4v6h-4zM5 17h4v2H5zM15 5h4v2h-4z" opacity=".3"/>
        <path d="M3 13h8V3H3v10zm2-8h4v6H5V5zm8 16h8V11h-8v10zm2-8h4v6h-4v-6zM13 3v6h8V3h-8zm6 4h-4V5h4v2zM3 21h8v-6H3v6zm2-4h4v2H5v-2z"/>
    </svg>;
}

export function EmojiEventsIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12,14c-1.65,0-3-1.35-3-3V5h6v6C15,12.65,13.65,14,12,14z" opacity=".3"/>
        <path d="M19,5h-2V3H7v2H5C3.9,5,3,5.9,3,7v1c0,2.55,1.92,4.63,4.39,4.94c0.63,1.5,1.98,2.63,3.61,2.96V19H7v2h10v-2h-4v-3.1 c1.63-0.33,2.98-1.46,3.61-2.96C19.08,12.63,21,10.55,21,8V7C21,5.9,20.1,5,19,5z M5,8V7h2v3.82C5.84,10.4,5,9.3,5,8z M12,14 c-1.65,0-3-1.35-3-3V5h6v6C15,12.65,13.65,14,12,14z M19,8c0,1.3-0.84,2.4-2,2.82V7h2V8z"/>
    </svg>;
}

export function ExpandMoreIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/>
    </svg>;
}

export function CloseIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>;
}

export function AddIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>>
    </svg>;
}

export function HistoryEduIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.34,9.76L9.93,8.34C8.98,7.4,7.73,6.88,6.39,6.88C5.76,6.88,5.14,7,4.57,7.22l1.04,1.04h2.28v2.14 c0.4,0.23,0.86,0.35,1.33,0.35c0.73,0,1.41-0.28,1.92-0.8L11.34,9.76z" opacity=".3"/>
        <path d="M11,6.62l6,5.97V14h-1.41l-2.83-2.83l-0.2,0.2c-0.46,0.46-0.99,0.8-1.56,1.03V15h6v2c0,0.55,0.45,1,1,1s1-0.45,1-1V6h-8 V6.62z" opacity=".3"/>
        <path d="M9,4v1.38c-0.83-0.33-1.72-0.5-2.61-0.5c-1.79,0-3.58,0.68-4.95,2.05l3.33,3.33h1.11v1.11c0.86,0.86,1.98,1.31,3.11,1.36 V15H6v3c0,1.1,0.9,2,2,2h10c1.66,0,3-1.34,3-3V4H9z M7.89,10.41V8.26H5.61L4.57,7.22C5.14,7,5.76,6.88,6.39,6.88 c1.34,0,2.59,0.52,3.54,1.46l1.41,1.41l-0.2,0.2c-0.51,0.51-1.19,0.8-1.92,0.8C8.75,10.75,8.29,10.63,7.89,10.41z M19,17 c0,0.55-0.45,1-1,1s-1-0.45-1-1v-2h-6v-2.59c0.57-0.23,1.1-0.57,1.56-1.03l0.2-0.2L15.59,14H17v-1.41l-6-5.97V6h8V17z"/>
    </svg>
}

export function ContactIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path opacity="0.3" d="M 2,19 H 22 V 5 H 2 Z M 9,6 c 1.65,0 3,1.35 3,3 0,1.65 -1.35,3 -3,3 C 7.35,12 6,10.65 6,9 6,7.35 7.35,6 9,6 Z M 3,16.59 C 3,14.08 6.97,13 9,13 c 2.03,0 6,1.08 6,3.58 V 18 H 3 Z" />
        <path d="M 22,3 H 2 C 0.9,3 0,3.9 0,5 v 14 c 0,1.1 0.9,2 2,2 h 20 c 1.1,0 1.99,-0.9 1.99,-2 L 24,5 C 24,3.9 23.1,3 22,3 Z m 0,16 H 2 V 5 H 22 Z M 9,12 c 1.65,0 3,-1.35 3,-3 C 12,7.35 10.65,6 9,6 7.35,6 6,7.35 6,9 c 0,1.65 1.35,3 3,3 z M 9,8 c 0.55,0 1,0.45 1,1 0,0.55 -0.45,1 -1,1 C 8.45,10 8,9.55 8,9 8,8.45 8.45,8 9,8 Z m 6,8.59 c 0,-2.5 -3.97,-3.58 -6,-3.58 -2.03,0 -6,1.08 -6,3.58 V 18 H 15 Z M 5.48,16 C 6.22,15.5 7.7,15 9,15 c 1.3,0 2.77,0.49 3.52,1 z" />
    </svg>;
}

export function OpenWithIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>
    </svg>;
}
export const MoveIcon = OpenWithIcon;

export function ZoomOutIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M17.3 5.3l-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM9 3H3v6l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3zm-.83 11.41L5.3 17.3 3 15v6h6l-2.3-2.3 2.89-2.87zm7.66 0l-1.42 1.42 2.89 2.87L15 21h6v-6l-2.3 2.3z"/>
    </svg>;
}
export const ResizeIcon = ZoomOutIcon;

export function ArrowExpandHorizontalIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M9,11H15V8L19,12L15,16V13H9V16L5,12L9,8V11M2,20V4H4V20H2M20,20V4H22V20H20Z"/>
    </svg>;
}

export function FormatSizeIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M2 4V7H7V19H10V7H15V4H2M21 9H12V12H15V19H18V12H21V9Z"/>
    </svg>;
}