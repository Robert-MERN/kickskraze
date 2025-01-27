
export const get_cookie = (cookie_name, { req, res }) => {
    const cookie_header = req.headers.cookie || "";
    const cookies = Object.fromEntries(cookie_header.split(";").map(e => e.split("=")));
    return cookies[cookie_name];
}

export const get_cookies = ({ req, res }) => {
    const cookie_header = req.headers.cookie || "";
    const cookies = Object.fromEntries(cookie_header.split(";").map(e => e.split("=")));
    return cookies;
}


export const set_cookie = (cookie_name, cookie_value, { req, res, expires }) => {
    let stringify_value;
    if (typeof cookie_value === "object") {
        stringify_value = JSON.stringify(cookie_value);
    } else {
        stringify_value = cookie_value.toString()
    }
    return res.setHeader('Set-Cookie', `${cookie_name}=${stringify_value}; Path=/; Max-Age=${expires}; sameSite=Strict`);
}