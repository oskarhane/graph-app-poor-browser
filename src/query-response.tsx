import React, { useState } from "react";
import neo4j from "neo4j-driver";
import QueryForm from "./query-form";
import { useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { applyGraphTypes } from "./services/types-in-transit/types-in-transit";

type CypherResult = {
  records: any[];
  summary: any;
};

type ResultState = {
  id: number;
  query: string;
  result: CypherResult;
};

const mutation = gql`
  mutation RunCypher($queryInput: BoltSessionInput!) {
    runCypher(input: $queryInput) {
      records
      summary
    }
  }
`;
let counter = 0;
const QueryResponse: React.FC = () => {
  const client = useApolloClient();
  const [results, setResults] = useState([]);
  const onRun = async (input: string) => {
    if (!input.trim()) {
      return;
    }
    try {
      const result = await client.mutate({
        mutation: mutation,
        variables: { queryInput: { statement: input.trim() } },
      });
      const tr: any = applyGraphTypes(result.data.runCypher, neo4j.types);
      const store: ResultState = {
        id: counter++,
        query: input.trim(),
        result: tr,
      };
      console.log("tr: ", tr);

      // @ts-ignore
      setResults([store, ...results]);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <QueryForm onRun={onRun}></QueryForm>
      <div>
        {results.map((r: ResultState) => {
          return (
            <div key={r.id} className="Result">
              <div>
                Query: <pre>{r.query}</pre>
              </div>
              <div>
                Result: <pre>{JSON.stringify(r.result.records, null, 2)}</pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QueryResponse;
