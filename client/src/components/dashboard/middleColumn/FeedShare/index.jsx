import React from "react";
import Panel from "../../../layout/panel";
import {CameraIcon, Container, DocumentIcon, VideoCameraIcon, WriteIcon} from "./styles";
import PostForm from "../../../post/PostForm";
import UploadPhoto from "../../../post/UploadPhoto";
import UploadVideo from "../../../post/UploadVideo";
import UploadDocument from "../../../post/UploadDocument";
import PostButtonModal from "../../../layout/buttonModal/PostButtonModal";

const FeedShare = (props) => {

  return (
    <Panel>
      <Container>
        <PostButtonModal
          icon={
            <div className="write">
              <WriteIcon />
              <span>Start a post</span>
            </div>
          }
          content={<PostForm user={props.user} avatar={props.avatar} name={props.name} />}
        />
        <div className="attachment">
          <PostButtonModal
            icon={
              <div className="upload">
                <CameraIcon />
                <span>Photo</span>
              </div>
            }
            content={<UploadPhoto user={props.user} avatar={props.avatar} name={props.name} />}
          />
          <PostButtonModal
            icon={
              <div className="upload">
                <VideoCameraIcon />
                <span> Video </span>
              </div>
            }
            content={<UploadVideo user={props.user} avatar={props.avatar} name={props.name} />}
          />
          <PostButtonModal
            icon={
              <div className="upload">
                <DocumentIcon />
                <span>Document</span>
              </div>
            }
            content={<UploadDocument user={props.user} avatar={props.avatar} name={props.name} />}
          />
        </div>
      </Container>
    </Panel>
  );
};

export default FeedShare;
