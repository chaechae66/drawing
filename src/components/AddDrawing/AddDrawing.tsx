import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { LocalStorage } from "../../lib/localStorage";

function AddDrawing() {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [prevImg, setPrevImg] = useState<string | null>(null);

  const localStorage = new LocalStorage();

  useEffect(() => {
    if (localStorage.get()) {
      return;
    }

    localStorage.set(uuidv4());
  }, []);

  const onLoadFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files![0];
    if (!file) {
      return;
    }
    setImgFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPrevImg(reader.result as string);
    };
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!imgFile) {
      return;
    }
    const formData = new FormData();
    formData.append("drawingImage", imgFile!);
    formData.append("user", JSON.stringify(localStorage.get()));

    axios.post("http://localhost:4000/article", formData).then((res) => {
      console.log(res);
    });
  };
  return (
    <div className="w-60">
      <h3 className="text-2xl">그림</h3>
      <form onSubmit={onSubmit}>
        <input type="file" accept=".jpg,.jpeg,.png" onChange={onLoadFile} />
        <div>
          <h4 className="text-xl">미리보기</h4>
          {prevImg ? <img src={prevImg} /> : <p>미리보기 이미지 없음</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-700 rounded px-4 py-2 text-white"
        >
          제출
        </button>
      </form>
    </div>
  );
}

export default AddDrawing;
