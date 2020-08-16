export type Item = {
  _id: string;
  type:
    | "youtube-playlist-item"
    | "youtube-channel-item"
    | "medium-post"
    | "vimeo-video"
    | "facebook-post"
    | "google-doc"
    | "document"
    | "blog-post";
  publishedAt: string;
  title: string;
  img: string;
  description: string;
  collections: string[];
};
