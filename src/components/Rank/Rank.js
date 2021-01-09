import React, { useEffect, useState } from "react";

const Rank = ({ entries, name }) => {
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    rankEmoji(entries);
  }, [entries, name]);

  const rankEmoji = (entries) => {
    fetch(
      `https://x12q8i6zkb.execute-api.us-east-1.amazonaws.com/dev/rank?rank=${entries}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((data) => data.json())
      .then((emoji) => {
        if (emoji.input) {
          setEmoji(emoji.input);
        }
      })
      .catch((err) => console.log);
  };

  return (
    <div>
      <div className="white f3">
        {`${name}, your current entry count is...`}
      </div>
      <div className="white f1">{entries}</div>
      <div className="white f2">{`Your Badge: ${emoji}`}</div>
    </div>
  );
};
export default Rank;
