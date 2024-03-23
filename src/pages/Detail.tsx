import { useParams } from "react-router-dom";
import BackBtn from "../components/BackBtn";

function Detail() {
  const { id } = useParams();
  return (
    <div>
      {id}
      <BackBtn />
    </div>
  );
}

export default Detail;
