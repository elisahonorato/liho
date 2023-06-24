import React from "react";
import { ApiProvider } from "react-rest-api";

const LihoClient = ({ children }) => {
    const baseUrl = "https://your-render-url/probando/";
    const config = {
      headers: {
        // All API calls will take this Content-Type Header
        "Content-Type": "multipart/form-data",
      },
    };
    return (
      <ApiProvider url={baseUrl} config={config}>
        {children}
      </ApiProvider>
    );
  };
  
  export default LihoClient;
