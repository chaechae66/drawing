import { useNavigate } from "react-router-dom";

function BackBtn() {
  const navigate = useNavigate();
  return (
    <button
      className="block px-3 py-1 bg-blue-300 rounded"
      onClick={() => {
        navigate("/");
      }}
    >
      뒤로가기
    </button>
  );
}

export default BackBtn;
