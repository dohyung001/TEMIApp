import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import RightArrowIcon from "../../assets/icons/right_arrow.svg?react";

export default function Step5({
  finalPhoto,
  email,
  sendMethod,
  onEmailChange,
  onEmailSend,
  onReset,
  onGoHome,
}) {
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base64 → Blob 변환
  const base64ToBlob = (base64) => {
    const base64Data = base64.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: "image/jpeg" });
  };

  // file.io 업로드 후 QR 생성
  const handleGenerateQr = async () => {
    try {
      setLoading(true);
      setError(null);

      const blob = base64ToBlob(finalPhoto);
      const formData = new FormData();
      formData.append("file", blob, `temi-photo-${Date.now()}.jpg`);

      // file.io 업로드
      const res = await fetch("https://file.io/?expires=1d", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setQrUrl(data.link); // 다운로드 가능한 링크
      } else {
        throw new Error("파일 업로드 실패");
      }
    } catch (err) {
      console.error(err);
      setError("업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 이미지 직접 다운로드
  const handleDirectDownload = () => {
    const link = document.createElement("a");
    link.href = finalPhoto;
    link.download = `temi-photo-${Date.now()}.jpg`;
    link.click();
  };

  // QR 화면
  if (qrUrl) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-8">
        <h2 className="text-6xl font-bold mb-8">QR 코드를 스캔하세요</h2>
        <p className="text-3xl text-slate-600 mb-12">
          ⚠️ 링크는 1일 후 자동 만료됩니다
        </p>

        <div className="bg-white rounded-[32px] p-16 shadow-2xl mb-12">
          <QRCodeSVG value={qrUrl} size={400} level="M" />
          <p className="text-2xl text-gray-600 mt-8 text-center">
            스마트폰 카메라로 스캔하여 사진 다운로드
          </p>
        </div>

        <div className="flex gap-6">
          <button
            onClick={() => setQrUrl(null)}
            className="px-16 py-6 rounded-[28px] border-2 border-slate-300 
                     text-slate-600 font-semibold text-3xl hover:bg-slate-100 transition"
          >
            ← 뒤로
          </button>

          <button
            onClick={onReset}
            className="px-16 py-6 rounded-[28px] bg-gradient-to-b from-[#3071FF] to-[#1D4ED8] 
                     text-white font-semibold text-3xl shadow-lg hover:opacity-90 transition"
          >
            다시 촬영하기
          </button>
        </div>
      </div>
    );
  }

  // 메인 화면
  return (
    <div className="h-screen flex flex-col items-center justify-center px-8">
      <h2 className="text-6xl font-bold mb-4">
        사진을 받으실 방법을 선택하세요
      </h2>
      <p className="text-3xl text-slate-600 mb-16">
        원하시는 방법을 선택하세요
      </p>

      <div className="grid grid-cols-3 gap-12 max-w-7xl">
        {/* 직접 다운로드 */}
        <button
          onClick={handleDirectDownload}
          className="bg-white rounded-[32px] p-12 shadow-xl hover:shadow-2xl 
                   hover:scale-105 transition-all border-4 border-slate-200 hover:border-blue-400"
        >
          <div className="text-8xl mb-4">💾</div>
          <h3 className="text-4xl font-bold text-gray-800 mb-3">다운로드</h3>
          <p className="text-xl text-gray-600">
            클릭하여
            <br />
            바로 저장
          </p>
        </button>

        {/* QR 코드 */}
        <button
          onClick={handleGenerateQr}
          disabled={loading}
          className={`bg-white rounded-[32px] p-12 shadow-xl border-4 transition-all 
            ${
              loading
                ? "opacity-70"
                : "hover:shadow-2xl hover:scale-105 hover:border-blue-400"
            }`}
        >
          <div className="text-8xl mb-4">📱</div>
          <h3 className="text-4xl font-bold text-gray-800 mb-3">QR 코드</h3>
          <p className="text-xl text-gray-600">
            스마트폰으로
            <br />
            스캔하기
          </p>
          {loading && (
            <p className="text-lg text-blue-600 mt-4 animate-pulse">
              업로드 중...
            </p>
          )}
          {error && <p className="text-lg text-red-500 mt-4">{error}</p>}
        </button>

        {/* 이메일 */}
        <div className="bg-white rounded-[32px] p-12 shadow-xl border-4 border-slate-200">
          <div className="text-8xl mb-4">✉️</div>
          <h3 className="text-4xl font-bold text-gray-800 mb-4">이메일</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="이메일 입력"
            className="w-full px-4 py-3 text-xl rounded-xl border-2 border-slate-300 
                     mb-4 text-center focus:outline-none focus:border-blue-500 transition"
          />
          <button
            onClick={onEmailSend}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 
                     rounded-[20px] bg-gradient-to-b from-[#3071FF] to-[#1D4ED8] 
                     text-white font-semibold text-2xl shadow-lg hover:opacity-90 transition"
          >
            전송
            <RightArrowIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
