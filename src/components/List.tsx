import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { TList } from "../types/List";
import { LocalStorage } from "../lib/localStorage";

function List() {
  const [list, setList] = useState([]);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const localStroage = new LocalStorage();

  useEffect(() => {
    axios.get("http://localhost:4000/article").then(({ data }) => {
      setList(JSON.parse(data.data));
    });
  }, []);

  const onLoadFile = (e: React.ChangeEvent<HTMLInputElement>, _id: string) => {
    const file = e.target.files![0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("drawingImage", file!);

    console.log(11, _id);

    axios
      .post(`http://localhost:4000/article/${_id}`, formData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleUpdate = () => {
    const isUpdate = confirm("이미지를 정말로 수정하시겠어요?");
    if (!isUpdate) {
      return;
    }
    imageRef.current!.click();
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    _id: string
  ) => {
    e.preventDefault();
    const isDelete = confirm("이미지를 정말로 삭제하시겠어요?");
    if (!isDelete) {
      return;
    }
    axios
      .delete(`http://localhost:4000/article/${_id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="grow">
      <h3 className="text-2xl">그림 리스트</h3>
      {list &&
        list.map((elem: TList) => (
          <div key={elem._id}>
            {elem.article.user === localStroage.get() && (
              <>
                <input
                  type="file"
                  className="hidden"
                  ref={imageRef}
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => {
                    onLoadFile(e, elem._id);
                  }}
                />
                <button
                  onClick={handleUpdate}
                  className="bg-red-400 mr-2 p-1 text-white"
                >
                  수정
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(e, elem._id);
                  }}
                  className="bg-slate-500 p-1 text-white"
                >
                  삭제
                </button>
              </>
            )}
            <img
              src={`data:image/${elem.article.contentType};base64,${elem.article.data}`}
              alt="그림 이미지"
            />
          </div>
        ))}
    </div>
  );
}

export default List;
