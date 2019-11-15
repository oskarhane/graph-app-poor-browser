import React from "react";
import "./App.css";
import QueryResponse from "./query-response";
import RelateApiProvider from "./services/relate-api/relate-api-provider";

const App: React.FC = () => {
  return (
    <RelateApiProvider urlString={document.location.href}>
      <div className="App">
        <header className="App-header">
          <p>Cypher over relate-api</p>
        </header>
        <div className="Main">
          <QueryResponse></QueryResponse>
        </div>
      </div>
    </RelateApiProvider>
  );
};

export default App;
