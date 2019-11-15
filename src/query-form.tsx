import React, { useState, ChangeEvent } from "react";

type MyProps = {
  onRun: (input: string) => void;
};
const QueryForm: React.FC<MyProps> = props => {
  const [q, setQ] = useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value;
    setQ(q);
  };
  const handleRun = () => {
    props.onRun(q);
    setQ("");
  };
  return (
    <div>
      <input type="text" onChange={handleChange} value={q} />
      <button onClick={handleRun}>Run query</button>
    </div>
  );
};

export default QueryForm;
