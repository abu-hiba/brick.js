export const isMobile = () => {
    const userAgents = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return userAgents.some((agent) => {
        return navigator.userAgent.match(agent);
    });
};

