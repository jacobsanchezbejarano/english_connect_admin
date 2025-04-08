const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const debug = true;

export const URL = debug ? `${BACKEND_URL}/api` : "http://localhost:5000/api";