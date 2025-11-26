// web/src/utils/imageComposer.js
import { TemiBridge } from "../services/temiBridge";

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
        case "tuffy":
          applyTuffyTheme(
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
        case "gromit":
          applyGromitTheme(
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
        case "rico":
          applyRicoTheme(
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
      }
    };

    photo.onerror = () => reject(new Error("사진 로딩 실패"));
    photo.src = photoSrc;
  });
}

// COSS 테마 (파란색 배경 + COSS 로고 이미지)
async function applyOceanTheme(
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

  try {
    let cossLogoSrc;

    // ✅ Temi 환경
    if (window.Temi && window.Temi.loadThemeImage) {
      cossLogoSrc = window.Temi.loadThemeImage("coss.png");
    }
    // ✅ 웹 환경
    else {
      cossLogoSrc = "/img/coss.png";
    }

    if (!cossLogoSrc) {
      throw new Error("이미지 로드 실패");
    }

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
      console.error("COSS 로고 렌더링 실패, 텍스트로 대체");
      // 텍스트 폴백
      ctx.font = "bold 80px Arial";
      ctx.fillStyle = "#0369A1";
      ctx.textAlign = "center";
      ctx.fillText("COSS", width / 2, height - paddingBottom / 2 + 30);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };

    cossLogo.src = cossLogoSrc;
  } catch (error) {
    console.error("COSS 로고 로드 실패:", error);
    // 텍스트 폴백
    ctx.font = "bold 80px Arial";
    ctx.fillStyle = "#0369A1";
    ctx.textAlign = "center";
    ctx.fillText("COSS", width / 2, height - paddingBottom / 2 + 30);
    resolve(canvas.toDataURL("image/jpeg", 0.95));
  }
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

// Tuffy 테마 (검은색 배경 + Tuffy 이미지 - 우측에 사진 침범)
async function applyTuffyTheme(
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

  // 배경색 (검은색)
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // 원본 사진 그리기
  ctx.drawImage(photo, paddingX, paddingTop, photoWidth, photoHeight);

  try {
    let tuffySrc;

    // ✅ Temi 환경
    if (window.Temi && window.Temi.loadThemeImage) {
      tuffySrc = window.Temi.loadThemeImage("tuffy.png");
    }
    // ✅ 웹 환경
    else {
      tuffySrc = "/img/tuffy.png";
    }

    if (!tuffySrc) {
      throw new Error("Tuffy 이미지 로드 실패");
    }

    const tuffyImage = new Image();
    tuffyImage.onload = () => {
      // Tuffy 크기 설정 (사진 높이의 80% 정도)
      const tuffyHeight = photoHeight * 0.7;
      const tuffyWidth = tuffyImage.width * (tuffyHeight / tuffyImage.height);

      // Tuffy 위치: 오른쪽에 배치하되 사진을 약 15% 침범
      const tuffyX = width - tuffyWidth * 0.9; // 우측에서 15% 침범
      const tuffyY = height - tuffyHeight + 40; // 하단에서 30px 위// 사진 영역 수직 중앙

      // Tuffy 이미지 그리기
      ctx.drawImage(tuffyImage, tuffyX, tuffyY, tuffyWidth, tuffyHeight);

      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };

    tuffyImage.onerror = () => {
      console.error("Tuffy 이미지 렌더링 실패");
      // 폴백: Tuffy 없이 검은 배경만
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };

    tuffyImage.src = tuffySrc;
  } catch (error) {
    console.error("Tuffy 이미지 로드 실패:", error);
    // 폴백: Tuffy 없이 검은 배경만
    resolve(canvas.toDataURL("image/jpeg", 0.95));
  }
}
async function applyGromitTheme(
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

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(photo, paddingX, paddingTop, photoWidth, photoHeight);

  try {
    let gromitSrc = window.Temi?.loadThemeImage
      ? window.Temi.loadThemeImage("gromit.png")
      : "/img/gromit.png";

    const gromitImage = new Image();
    gromitImage.onload = () => {
      const gromitHeight = photoHeight * 0.7;
      const gromitWidth =
        gromitImage.width * (gromitHeight / gromitImage.height);
      const gromitX = width - gromitWidth * 1;
      const gromitY = height - gromitHeight; // ⭐ 하단 정렬

      ctx.drawImage(gromitImage, gromitX, gromitY, gromitWidth, gromitHeight);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };

    gromitImage.onerror = () => resolve(canvas.toDataURL("image/jpeg", 0.95));
    gromitImage.src = gromitSrc;
  } catch (error) {
    resolve(canvas.toDataURL("image/jpeg", 0.95));
  }
}
async function applyRicoTheme(
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

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(photo, paddingX, paddingTop, photoWidth, photoHeight);

  try {
    let ricoSrc = window.Temi?.loadThemeImage
      ? window.Temi.loadThemeImage("rico.png")
      : "/img/rico.png";

    const ricoImage = new Image();
    ricoImage.onload = () => {
      const ricoHeight = photoHeight * 0.9;
      const ricoWidth = ricoImage.width * (ricoHeight / ricoImage.height);
      const ricoX = paddingX - ricoWidth * 0.25; // ⭐ 왼쪽 침범 (15%)
      const ricoY = height - ricoHeight + 60;

      ctx.drawImage(ricoImage, ricoX, ricoY, ricoWidth, ricoHeight);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };

    ricoImage.onerror = () => resolve(canvas.toDataURL("image/jpeg", 0.95));
    ricoImage.src = ricoSrc;
  } catch (error) {
    resolve(canvas.toDataURL("image/jpeg", 0.95));
  }
}
