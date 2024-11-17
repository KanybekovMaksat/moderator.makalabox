import PropTypes from "prop-types";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { CodeBlock } from "@defensestation/blocknote-code";
import {
  CommentToolbarController,
  commentStyleSpec,
} from "@defensestation/blocknote-comments";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { AlertBlock } from "./features/alertBlock";
import { codeStyleSpec } from "./features/code-toolbar/code-toolbar.stylespec";
import { createReactBlockSpec } from "@blocknote/react";

// Функция для извлечения ID видео из YouTube URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = String(url).match(regExp);
  return match && match[2].length === 11 ? match[2] : url;
};

// Улучшенный YouTube блок
const youtubeBlockSpec = createReactBlockSpec(
  {
    type: "youtube",
    propSchema: { src: "string" },
    content: "inline",
  },
  {
    render: (props) => {
      const videoId = getYouTubeVideoId(props.block.props.src);

      return (
        <div>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    },
  }
);

const videoBlockSpec = createReactBlockSpec(
  {
    type: "video",
    propSchema: { src: "string", caption: "string" },
    content: "inline",
  },
  {
    render: (props) => (
      <div>
        <video controls>
          <source src={props.block.props.src} type="video/mp4" />
          <source src={props.block.props.src} type="video/webm" />
          <source src={props.block.props.src} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
        {props.block.props.caption && (
          <p
            style={{
              marginTop: "0.5rem",
              color: "#666",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {props.block.props.caption}
          </p>
        )}
      </div>
    ),
  }
);

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: AlertBlock,
    procode: CodeBlock,
    video: videoBlockSpec,
    youtube: youtubeBlockSpec,
  },
  styleSpecs: {
    ...defaultStyleSpecs,
    comment: commentStyleSpec,
    code: codeStyleSpec,
  },
});

function ArticleViewer({ body }) {
  const editor = useCreateBlockNote({
    schema,
    initialContent: Array.isArray(body) ? body : [],
    domAttributes: {
      editor: {
        class: "article-viewer",
        "data-changing-font-demo": "true",
      },
    },
  });

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      slashMenu={false}
      formattingToolbar={false}
      editable={false}
    />
  );
}

ArticleViewer.propTypes = {
  body: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
};

export default ArticleViewer;
