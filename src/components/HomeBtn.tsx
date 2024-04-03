import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function HomeBtn() {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      onClick={() => {
        navigate("/");
      }}
    >
      홈으로
    </Button>
  );
}

export default HomeBtn;
