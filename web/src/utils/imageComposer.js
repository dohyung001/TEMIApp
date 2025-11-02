// web/src/utils/imageComposer.js

/**
 * 원본 사진에 테마 효과 적용 (프레임 이미지 없이)
 * @param {string} photoSrc - 원본 사진 (base64)
 * @param {object} theme - 테마 객체
 * @returns {Promise<string>} - 합성된 이미지 (base64)
 */
export async function composeImageWithTheme(photoSrc, theme) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // 캔버스 크기 설정 (7:6 비율)
    canvas.width = 1400; // 7
    canvas.height = 1200; // 6

    const photo = new Image();

    photo.onload = () => {
      // 패딩 설정
      const paddingX = 68;
      const paddingTop = 68;
      const paddingBottom = 220;

      const photoWidth = canvas.width - paddingX * 2;
      const photoHeight = canvas.height - paddingTop - paddingBottom;

      // 테마별 처리
      switch (theme.id) {
        case "coss":
          applyOceanTheme(
            ctx,
            canvas,
            photo,
            paddingX,
            paddingTop,
            photoWidth,
            photoHeight,
            resolve,
            reject
          );
          break;
        case "clover":
          applyCloverTheme(
            ctx,
            canvas,
            photo,
            paddingX,
            paddingTop,
            photoWidth,
            photoHeight,
            resolve,
            reject
          );
          break;
        case "robot":
          applyRobotTheme(
            ctx,
            canvas,
            photo,
            paddingX,
            paddingTop,
            photoWidth,
            photoHeight,
            resolve,
            reject
          );
          break;
        default:
          reject(new Error("알 수 없는 테마"));
          break;
      }
    };

    photo.onerror = () => reject(new Error("사진 로딩 실패"));
    photo.src = photoSrc;
  });
}

// COSS 테마 (파란색 배경 + COSS 로고 이미지)
function applyOceanTheme(
  ctx,
  canvas,
  photo,
  paddingX,
  paddingTop,
  photoWidth,
  photoHeight,
  resolve,
  reject
) {
  const width = canvas.width;
  const height = canvas.height;
  const paddingBottom = 220;

  // 배경색 (하늘색)
  ctx.fillStyle = "#E0F2FE";
  ctx.fillRect(0, 0, width, height);

  // 원본 사진 그리기
  ctx.drawImage(photo, paddingX, paddingTop, photoWidth, photoHeight);

  // COSS 로고 이미지 로드
  const cossLogo = new Image();
  cossLogo.onload = () => {
    const logoHeight = 120;
    const logoWidth = cossLogo.width * (logoHeight / cossLogo.height);
    const logoX = (width - logoWidth) / 2;
    const logoY = height - paddingBottom / 2 - logoHeight / 2;

    ctx.drawImage(cossLogo, logoX, logoY, logoWidth, logoHeight);
    resolve(canvas.toDataURL("image/jpeg", 0.95));
  };
  cossLogo.onerror = () => {
    console.error("COSS 로고 로딩 실패, 텍스트로 대체");
    ctx.font = "bold 80px Arial";
    ctx.fillStyle = "#0369A1";
    ctx.textAlign = "center";
    ctx.fillText("COSS", width / 2, height - paddingBottom / 2 + 30);
    resolve(canvas.toDataURL("image/jpeg", 0.95));
  };
  cossLogo.src = "/img/coss.png";
}

// 클로버 테마 (연두색 배경 + 클로버 - 우측 하단)
function applyCloverTheme(
  ctx,
  canvas,
  photo,
  paddingX,
  paddingTop,
  photoWidth,
  photoHeight,
  resolve,
  reject
) {
  const width = canvas.width;
  const height = canvas.height;
  const paddingBottom = 220;

  // 배경색 (연두색)
  ctx.fillStyle = "#ECFCCB";
  ctx.fillRect(0, 0, width, height);

  // 원본 사진 그리기
  ctx.drawImage(photo, paddingX, paddingTop, photoWidth, photoHeight);

  // 클로버 이모지 (우측 하단)
  ctx.font = "150px Arial";
  ctx.textAlign = "right";
  const cloverY = height - paddingBottom / 2 + 60;
  ctx.fillText("🍀", width - 80, cloverY);

  resolve(canvas.toDataURL("image/jpeg", 0.95));
}

// 로봇 테마 (하늘색 배경 + 로봇 - 가운데)
function applyRobotTheme(
  ctx,
  canvas,
  photo,
  paddingX,
  paddingTop,
  photoWidth,
  photoHeight,
  resolve,
  reject
) {
  const width = canvas.width;
  const height = canvas.height;
  const paddingBottom = 220;

  // 배경색 (하늘색)
  ctx.fillStyle = "#DBEAFE";
  ctx.fillRect(0, 0, width, height);

  // 원본 사진 그리기
  ctx.drawImage(photo, paddingX, paddingTop, photoWidth, photoHeight);

  // 로봇 이모지 (아래 패딩 가운데)
  ctx.font = "150px Arial";
  ctx.textAlign = "center";
  const robotY = height - paddingBottom / 2 + 60;
  ctx.fillText("🤖", width / 2, robotY);

  resolve(canvas.toDataURL("image/jpeg", 0.95));
}
