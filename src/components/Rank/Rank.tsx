import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// ============================================================== TypeScript ===============================================

type TRank = React.FC<{
  entries: string | undefined;
  name: string | undefined;
}>;

// ============================================================== Component ===============================================

const Rank: TRank = ({ entries, name }) => {
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    // 10 represents the number of emojis in AWS lambada.
    if (entries !== undefined && Number(entries) < 10) {
      rankEmoji(entries);
    }
  }, [entries, name]);

  const rankEmoji = (entries: string) => {
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
      .catch((err) => console.error);
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

Rank.propTypes = {
  entries: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

Rank.defaultProps = {
  name: "Ops.. we didn't get your name. But",
  entries: "0",
};

export default Rank;
