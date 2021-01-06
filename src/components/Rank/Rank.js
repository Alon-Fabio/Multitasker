import React from "react";

class Rank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emoji: "",
    };
  }

  componentDidMount() {
    this.rankEmoji(this.props.entries);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.entries === prevProps.entries &&
      this.props.name === prevProps.name
    ) {
      return null;
    }
    this.rankEmoji(this.props.entries);
  }

  rankEmoji = (entries) => {
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
          this.setState({ emoji: emoji.input });
        }
      })
      .catch((err) => console.log);
  };
  // ({ name, entries })
  render() {
    return (
      <div>
        <div className="white f3">
          {`${this.props.name}, your current entry count is...`}
        </div>
        <div className="white f1">{this.props.entries}</div>
        <div className="white f2">{`Your Badge: ${this.state.emoji}`}</div>
      </div>
    );
  }
}
export default Rank;
