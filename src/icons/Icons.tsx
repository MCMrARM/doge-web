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

export function PaletteIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 10 6.5 10s1.5.67 1.5 1.5S7.33 13 6.5 13zm3-4C8.67 9 8 8.33 8 7.5S8.67 6 9.5 6s1.5.67 1.5 1.5S10.33 9 9.5 9zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 6 14.5 6s1.5.67 1.5 1.5S15.33 9 14.5 9zm4.5 2.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" opacity=".3"/>
        <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.21-.64-1.67-.08-.09-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm4 13h-1.77c-1.38 0-2.5 1.12-2.5 2.5 0 .61.22 1.19.63 1.65.06.07.14.19.14.35 0 .28-.22.5-.5.5-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.14 8 7c0 2.21-1.79 4-4 4z"/>
        <circle cx="6.5" cy="11.5" r="1.5"/>
        <circle cx="9.5" cy="7.5" r="1.5"/>
        <circle cx="14.5" cy="7.5" r="1.5"/>
        <circle cx="17.5" cy="11.5" r="1.5"/>
    </svg>;
}

export function BlurIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <circle cx="14" cy="10" r="1.5"/>
        <circle cx="14" cy="18" r="1"/>
        <circle cx="14" cy="14" r="1.5"/>
        <circle cx="14" cy="6" r="1"/>
        <path d="M3 9.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM14.5 3c0-.28-.22-.5-.5-.5s-.5.22-.5.5.22.5.5.5.5-.22.5-.5zM21 14.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/>
        <circle cx="18" cy="18" r="1"/>
        <path d="M13.5 21c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5zM21 10.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/>
        <circle cx="18" cy="14" r="1"/>
        <circle cx="18" cy="6" r="1"/>
        <circle cx="6" cy="18" r="1"/>
        <circle cx="6" cy="14" r="1"/>
        <path d="M3.5 14c0-.28-.22-.5-.5-.5s-.5.22-.5.5.22.5.5.5.5-.22.5-.5z"/>
        <circle cx="10" cy="6" r="1"/>
        <circle cx="6" cy="10" r="1"/>
        <circle cx="6" cy="6" r="1"/>
        <path d="M9.5 21c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5z"/>
        <circle cx="10" cy="18" r="1"/>
        <path d="M10.5 3c0-.28-.22-.5-.5-.5s-.5.22-.5.5.22.5.5.5.5-.22.5-.5z"/>
        <circle cx="10" cy="14" r="1.5"/>
        <circle cx="10" cy="10" r="1.5"/>
        <circle cx="18" cy="10" r="1"/>
    </svg>;
}

export function SecurityIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 3.19L5 6.3V12h7v8.93c3.72-1.15 6.47-4.82 7-8.94h-7v-8.8z" opacity=".3"/>
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 19.93V12H5V6.3l7-3.11v8.8h7c-.53 4.12-3.28 7.79-7 8.94z"/>
    </svg>;
}

export function CheckCircleIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-2 13l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" opacity=".3"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
    </svg>;
}

export function RemoveCircleIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm5 9H7v-2h10v2z" opacity=".3"/>
        <path d="M7 11h10v2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>;
}

export function CancelIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm5 11.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" opacity=".3"/>
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/>
    </svg>;
}

export function AccessTimeIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.25 12.15L11 13V7h1.5v5.25l4.5 2.67-.75 1.23z" opacity=".3"/>
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>;
}

export function CodeIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
    </svg>;
}

export function OutlinedAddPhotoAlternativeIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17l-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z"/>
    </svg>;
}

export function LinkIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
    </svg>;
}

export function MenuIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>;
}


export function CustomScriptIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path
              d="M17.31,16.56a9,9,0,0,1,.39-4.06,13.47,13.47,0,0,0,.6-4,7.1,7.1,0,0,0-1.12-4.25H6.57A11.15,11.15,0,0,1,7.3,8.54a16.49,16.49,0,0,1-.53,4.16,15,15,0,0,0-.47,3.72c0,3.16.84,3.87,1,3.87v2c-.71,0-3-.42-3-5.87a16.62,16.62,0,0,1,.52-4.16A14.51,14.51,0,0,0,5.3,8.54c0-2.82-.8-4.13-1.08-4.26l.08-2h13c2,0,3,3.73,3,6.25A15.41,15.41,0,0,1,19.63,13a7,7,0,0,0-.34,3.24"/>
        <path
              d="M8.1,18.25m13.17-2a1.92,1.92,0,0,1,1.27.44,3.35,3.35,0,0,1,.76,2.56,2.91,2.91,0,0,1-3,3H7.3v-2A1.06,1.06,0,0,0,8.07,20a1.1,1.1,0,0,0,.23-.71,4.2,4.2,0,0,0-.2-1.57,1,1,0,0,1,1-1.43m1.08,4H20.3a.91.91,0,0,0,1-1,2.56,2.56,0,0,0-.15-1H10.21a5,5,0,0,1,.09,1A3,3,0,0,1,10.15,20.29Z"/>
        <rect  x="8.2" y="6.75" width="8.71" height="1.5" rx="0.49"/>
        <path
              d="M14.76,11.25H8.59a.45.45,0,0,1-.39-.49v-.52a.45.45,0,0,1,.39-.49h6.17a.45.45,0,0,1,.39.49v.52A.45.45,0,0,1,14.76,11.25Z"/>
        <path
              d="M15.71,14.25H8.19a.49.49,0,0,1-.48-.49v-.52a.49.49,0,0,1,.48-.49h7.52a.48.48,0,0,1,.48.49v.52A.48.48,0,0,1,15.71,14.25Z"/>
        <path
              d="M5.09,6.29H3.85a2.47,2.47,0,0,1-.15-1c0-.61.2-.94.55-1l0,0,.08-2a2.72,2.72,0,0,0-2.6,3,3.3,3.3,0,0,0,.85,2.55,1.7,1.7,0,0,0,1.13.45H5.29A11.81,11.81,0,0,0,5.09,6.29Z"/>
    </svg>;
}


export function DiscordIcon(props: IconProps) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 128 128" fill="currentColor" {...props}>
        <path d="M 48.050781 22.349609 C 48.050781 22.349609 34.450781 22.05 20.050781 32.75 C 20.050781 32.75 5.6503906 58.650781 5.6503906 90.550781 C 5.6503906 90.550781 14.050391 104.95039 36.150391 105.65039 C 36.150391 105.65039 39.849609 101.25117 42.849609 97.451172 C 30.149609 93.651172 25.349609 85.75 25.349609 85.75 C 25.349609 85.75 26.350391 86.451172 28.150391 87.451172 C 28.250391 87.451172 28.350781 87.550391 28.550781 87.650391 C 28.850781 87.850391 29.149219 87.950391 29.449219 88.150391 C 31.949219 89.550391 34.45 90.650781 36.75 91.550781 C 40.85 93.250781 45.749219 94.749609 51.449219 95.849609 C 58.949219 97.249609 67.749609 97.751172 77.349609 95.951172 C 82.049609 95.051172 86.849609 93.750391 91.849609 91.650391 C 95.349609 90.350391 99.249609 88.45 103.34961 85.75 C 103.34961 85.75 98.35 93.850781 85.25 97.550781 C 88.25 101.25078 91.849609 105.55078 91.849609 105.55078 C 113.94961 104.85078 122.34961 90.450781 122.34961 90.550781 C 122.34961 58.650781 107.94922 32.75 107.94922 32.75 C 93.649219 22.05 79.949219 22.349609 79.949219 22.349609 L 78.550781 23.951172 C 95.550781 29.051172 103.44922 36.550781 103.44922 36.550781 C 93.049219 30.950781 82.849609 28.150781 73.349609 27.050781 C 66.149609 26.250781 59.250391 26.45 53.150391 27.25 C 52.550391 27.25 52.049219 27.351172 51.449219 27.451172 C 47.949219 27.851172 39.45 29.05 28.75 33.75 C 25.05 35.35 22.849609 36.550781 22.849609 36.550781 C 22.849609 36.550781 31.050781 28.650781 49.050781 23.550781 L 48.050781 22.349609 z M 45.75 53 C 51.45 53 56.049219 57.9 55.949219 64 C 55.949219 70.1 51.45 75 45.75 75 C 40.15 75 35.550781 70.1 35.550781 64 C 35.550781 57.9 40.05 53 45.75 53 z M 82.25 53 C 87.85 53 92.449219 57.9 92.449219 64 C 92.449219 70.1 87.95 75 82.25 75 C 76.65 75 72.050781 70.1 72.050781 64 C 72.050781 57.9 76.55 53 82.25 53 z " />
    </svg>;
}
