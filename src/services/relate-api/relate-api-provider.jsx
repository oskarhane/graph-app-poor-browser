import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { createClient } from "./relate-api.utils";

export default function RelateApiProvider({ urlString, children }) {
  console.log("urlString: ", urlString);
  // Load relate api graphql client
  const url = new URL(urlString);
  const apiEndpoint = url.searchParams.get("neo4jDesktopApiUrl");
  const apiClientId = url.searchParams.get("neo4jDesktopGraphAppClientId");

  // If not in relate-api env, render children
  if (!apiEndpoint) {
    return children;
  }
  const relateApiClient = createClient(apiEndpoint, apiClientId);

  return <ApolloProvider client={relateApiClient}>{children}</ApolloProvider>;
}
