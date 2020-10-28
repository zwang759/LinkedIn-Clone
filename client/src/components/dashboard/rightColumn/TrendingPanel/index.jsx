import React, {useEffect, useState} from "react";
import Panel from "../../../layout/panel";
import {Container} from "./styles";
import moment from "moment";
import LoadingTrendingPanel from "../../shimmer/LoadingTrendingPanel";
import {Button} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Link} from "react-router-dom";
import api from "../../../../redux/utils/api";

const useStyles = makeStyles({
  root: {
    textTransform: "none",
    padding: 0
  }
});

const TrendingPanel = () => {

  const classes = useStyles();

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      const res = await api.get("/api/news");
      setArticles(res.data);
    };
    getNews();
  }, []);

  return (
    <Container>
      <Panel>
        <span className="title">TechCrunch news</span>
        <ul>
          {articles.length === 0 ? <LoadingTrendingPanel /> : articles.map(article => (
            <Button key={article.url} component={Link} to={{pathname: article.url}} target="_blank"
                    className={classes.root}>
              <li>
                <span className="bullet" />
                <span className="news">
                                    <span className="head">{article.title}</span>
                                    <span
                                      className="subtext">{moment(article.publishedAt).fromNow()} &nbsp; {article.source.name} </span>
                                </span>
              </li>
            </Button>
          ))}
        </ul>
      </Panel>
    </Container>
  );
};

export default TrendingPanel;
