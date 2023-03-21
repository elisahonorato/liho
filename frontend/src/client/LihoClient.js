import React from "react";
import { ApiProvider } from "react-rest-api";

const LihoClient = ({children}) => {
    const baseUrl = "http://localhost:8000";
    const config = {
        headers: {
            // All api calls will take this Content-Type Header
            "Content-Type": "multipart/form-data",
        }
    }
    return (
        <ApiProvider
            url={baseUrl}
            config={config}
        >
            {children}
        </ApiProvider>
    );
}

export default LihoClient
