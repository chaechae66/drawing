import { TList } from "../types/List";
import { Link } from "react-router-dom";

function ListItem({ elem }: { elem: TList }) {
  return (
    <div key={elem._id}>
      <Link to={`detail/${elem._id}`}>
        <img
          src={`data:image/${elem.contentType};base64,${elem.data}`}
          alt="그림 이미지"
        />
      </Link>
    </div>
  );
}

export default ListItem;
