// web/src/components/photo/Step2.jsx
export default function Step2({ themes, onSelectTheme }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-6xl font-bold mb-4">테마를 선택하세요</h2>
      <p className="text-3xl text-slate-600 mb-16">
        선택한 테마로 기념사진을 촬영해요
      </p>

      <div className="grid grid-cols-3 gap-8 max-w-7xl">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme)}
            className={`group relative overflow-hidden rounded-[32px] border-4 border-slate-200 
                       hover:border-blue-400 hover:shadow-2xl hover:scale-105 
                       transition-all duration-300 bg-white`}
          >
            <div
              className={`${theme.bgColor} p-16 min-h-[400px] flex flex-col items-center justify-center`}
            >
              {/* 이모지 */}
              <div className="text-9xl mb-6 group-hover:scale-110 transition-transform">
                {theme.emoji}
              </div>

              {/* 테마 이름 */}
              <h3 className={`text-5xl font-bold ${theme.textColor} mb-4`}>
                {theme.name}
              </h3>

              {/* 설명 */}
              <p className="text-2xl text-slate-600 text-center">
                {theme.name} 테마로
                <br />
                특별한 추억을 남겨보세요
              </p>
            </div>

            {/* 호버 효과 */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
