import { Button } from "@mui/material";

export const DocumentRenderer = ({
  value,
}: {
  value: string | null | undefined;
}) => {
  if (!value) return null;
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(value);
  const isPDF = /\.pdf$/i.test(value);
  if (isImage) {
    return (
      <img
        src={value}
        alt="Document"
        style={{ maxWidth: "100px", maxHeight: "80px" }}
      />
    );
  }
  if (isPDF) {
    return (
      <Button href={value} target="_blank" rel="noopener noreferrer">
        View file
      </Button>
    );
  }

  return null;
};
