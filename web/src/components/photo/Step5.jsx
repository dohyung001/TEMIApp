import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

export default function Step5({ finalPhoto, onReset, onGoHome }) {
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 자동으로 QR 생성
  useEffect(() => {
    if (finalPhoto && !qrUrl) {
      uploadToImgBB();
    }
  }, [finalPhoto]);

  // ImgBB에 이미지 업로드
  const uploadToImgBB = async () => {
    if (!finalPhoto) return;

    try {
      setLoading(true);
      setError(null);

      // Base64에서 data:image/jpeg;base64, 부분 제거
      const base64Data = finalPhoto.split(",")[1];

      // FormData 생성
      const formData = new FormData();
      formData.append("key", "e947920cd2d87b83c74bfdb195b2a18f");
      formData.append("image", base64Data);
      formData.append("expiration", 604800); // 7일 후 삭제

      // axios로 업로드
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success && response.data.data.url) {
        setQrUrl(response.data.data.url);
        console.log("✅ 업로드 성공:", response.data.data.url);
      } else {
        throw new Error("업로드 실패");
      }
    } catch (err) {
      console.error("❌ 업로드 에러:", err);
      setError("이미지 업로드에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center  ">
        <div className="w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-4xl font-bold text-gray-800">QR 코드 생성 중...</h2>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center   p-8">
        <div className="text-8xl mb-8">❌</div>
        <h2 className="text-4xl font-bold text-red-600 mb-4">{error}</h2>
        <div className="flex gap-6 mt-8">
          <button
            onClick={uploadToImgBB}
            className="px-12 py-5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl shadow-xl transition-all"
          >
            다시 시도
          </button>
          <button
            onClick={onReset}
            className="px-12 py-5 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-bold text-2xl shadow-xl transition-all"
          >
            처음으로
          </button>
          <button
            onClick={onGoHome}
            className="px-12 py-5 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-2xl shadow-xl transition-all"
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }

  // QR 코드 표시
  return (
    <div className="flex flex-col items-center justify-center ">
      {/* 타이틀 */}
      <h1 className="text-6xl font-bold text-blue-600 mb-4">QR 생성 완료!</h1>
      <p className="text-3xl text-gray-600 mb-12">
        카메라로 QR코드를 촬영해주세요
      </p>

      {/* QR 코드 */}
      <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
        {qrUrl ? (
          <QRCodeSVG value={qrUrl} size={400} level="H" includeMargin={true} />
        ) : (
          <div className="w-[400px] h-[400px] bg-gray-200 animate-pulse rounded-xl"></div>
        )}
      </div>

      {/* 안내 문구 */}
      <p className="text-2xl text-gray-500 mb-12">
        * 큐알은 이 창이 종료될과 동시에 사라집니다.
      </p>
    </div>
  );
}
