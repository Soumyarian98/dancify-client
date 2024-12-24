import { forwardRef } from "react";

interface S3ImageRef {
  startUpload: () => Promise<void>;
}

interface Props {
  file: File;
  eventId: string;
}

const S3Image = forwardRef<S3ImageRef, Props>(() => {
  return <div></div>;
});

export default S3Image;
