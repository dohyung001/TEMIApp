// web/src/components/photo/Step6Complete.jsx
export default function Step6Complete({
  sendMethod,
  email,
  qrCode,
  onHome,
  onReset,
}) {
  return (
    <div className="text-center mt-20">
      <h2 className="text-6xl font-bold text-white mb-12">
        🎉 완료되었습니다!
      </h2>

      {sendMethod === "qr" && qrCode && (
        <div className="bg-white rounded-3xl p-12 max-w-2xl mx-auto mb-8">
          <div className="text-3xl font-bold text-gray-800 mb-6">
            QR 코드를 스캔하세요
          </div>
          <div className="bg-gray-200 w-80 h-80 mx-auto flex items-center justify-center text-6xl rounded-2xl">
            📱
          </div>
          <p className="text-xl text-gray-600 mt-6">
            실제로는 여기에 QR 코드가 표시됩니다
          </p>
        </div>
      )}

      {sendMethod === "email" && (
        <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-3xl p-12 max-w-2xl mx-auto mb-8">
          <div className="text-4xl text-white mb-4">✉️</div>
          <p className="text-2xl text-white">
            <span className="font-bold">{email}</span>로
            <br />
            사진이 전송되었습니다!
          </p>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={onHome}
          className="px-12 py-5 bg-white/20 text-white font-bold text-2xl rounded-2xl hover:bg-white/30 transition-all"
        >
          홈으로
        </button>
        <button
          onClick={onReset}
          className="px-12 py-5 bg-white text-pink-600 font-bold text-2xl rounded-2xl hover:bg-pink-50 transition-all shadow-xl"
        >
          다시 촬영하기
        </button>
      </div>
    </div>
  );
}
