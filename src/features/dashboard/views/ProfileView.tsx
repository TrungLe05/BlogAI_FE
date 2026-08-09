import { useSearchParams } from "react-router-dom";
import ProfileContent from "../components/profile/ProfileContent";

export function ProfileView() {
  const [, setSearchParams] = useSearchParams();

  const handleEditBlog = (blogId: string) => {
    setSearchParams({ view: "write", editId: blogId }, { replace: true });
  };

  return <ProfileContent onEditBlog={handleEditBlog} />;
}

export default ProfileView;