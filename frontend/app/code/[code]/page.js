// app/code/[code]/page.js
import { use } from "react";
import StatsClient from "./StatsClient";

export default function CodeStatsPage({ params }) {
  // unwrap the params promise/model
  const { code } = use(params);

  console.log("Server params (unwrapped):", code); // should log "97pOhKnT" (string)

  return <StatsClient code={code} />;
}
