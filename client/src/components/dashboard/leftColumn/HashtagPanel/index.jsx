import React from "react";

import Panel from "../../../layout/panel";

import {Container, HashtagIcon} from "./styles";

const tags = ["startups", "artificialintelligence", "innovation", "motivation", "careers"];

const HashtagPanel = () => {
  return (
    <Container>
      <Panel>
        <span className="title">Followed Hashtags</span>

        {tags.map((item) => (
          <span className="tag" key={item}>
            <HashtagIcon />
            {item}
          </span>
        ))}
      </Panel>
    </Container>
  );
};

export default HashtagPanel;
