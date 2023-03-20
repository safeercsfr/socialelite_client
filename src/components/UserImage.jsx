import { Box } from "@mui/system";
import { useState } from "react";
import ProfilePhotoEdit from "scenes/widgets/ProfilePhotoEdit";

const UserImage = ({ image, size = "60px", isProfile }) => {
  const [isEdit, setIsEdit] = useState(false);

  const handleBoxClick = () => {
    setIsEdit(true);
  };

  const handleEditDone = () => {
    setIsEdit(false);
  };

  if (isProfile) {
    return isEdit ? (
      <ProfilePhotoEdit setIsEdit={handleEditDone} />
    ) : (
      <Box
        width={size}
        height={size}
        sx={{ cursor: "pointer" }}
        onClick={() => handleBoxClick()}
      >
        <img
          style={{ objectFit: "cover", borderRadius: "50%" }}
          width={size}
          height={size}
          alt="user"
          src={image}
        />
      </Box>
    );
  }

  return (
    <Box
      width={size}
      height={size}
      sx={{ cursor: "pointer" }}
    >
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={image}
      />
    </Box>
  );
};

export default UserImage;
