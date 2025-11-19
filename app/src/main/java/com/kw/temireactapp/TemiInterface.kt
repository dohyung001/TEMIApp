package com.kw.temireactapp

import android.app.Activity
import android.content.Context
import android.content.SharedPreferences
import android.util.Base64
import android.util.Log
import android.webkit.JavascriptInterface
import android.widget.Toast
import com.robotemi.sdk.Robot
import com.robotemi.sdk.TtsRequest
import com.robotemi.sdk.SttLanguage  // ✅ 올바른 import
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import javax.net.ssl.HostnameVerifier
import javax.net.ssl.HttpsURLConnection
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager
import java.security.cert.X509Certificate

class TemiInterface(
    private val activity: Activity,
    private val robot: Robot
) {

    private val prefs: SharedPreferences =
        activity.getSharedPreferences("TemiCustomSettings", Context.MODE_PRIVATE)

    private var isListening = false

    companion object {
        private const val TAG = "TemiInterface"
    }

    // ✅ AsrListener 구현
    private val asrListener = object : Robot.AsrListener {
        override fun onAsrResult(asrResult: String, sttLanguage: SttLanguage) {
            Log.d(TAG, "✅✅ [Temi ASR] 인식 결과: \"$asrResult\" (언어: $sttLanguage)")

            isListening = false

            // JSON 이스케이프 처리
            val escapedText = asrResult
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t")

            // JavaScript로 전달
            callJavaScript("window.onSpeechResult", "\"$escapedText\"")

            // Toast로도 표시
            showToast("인식됨: $asrResult")
        }
    }

    init {
        // ✅ Temi ASR 리스너 등록
        robot.addAsrListener(asrListener)

        // ✅ 한국어 ASR 설정 (선택사항)
        try {
            robot.setAsrLanguages(listOf(SttLanguage.KO_KR))
            Log.d(TAG, "✅ Temi ASR 초기화 완료 (한국어)")
        } catch (e: Exception) {
            Log.w(TAG, "⚠️ setAsrLanguages 실패 (무시): ${e.message}")
            Log.d(TAG, "✅ Temi ASR 초기화 완료 (기본 언어)")
        }
    }

    // ========== 음성 인식 시작 (Temi SDK 사용) ==========

    @JavascriptInterface
    fun startSpeechRecognition() {
        Log.d(TAG, "🎤 ========== Temi ASR 시작 ==========")

        activity.runOnUiThread {
            try {
                if (isListening) {
                    Log.w(TAG, "⚠️ 이미 듣는 중, 무시")
                    return@runOnUiThread
                }

                isListening = true

                // ✅ Temi의 wakeup() 메서드 호출 (한국어)
                robot.wakeup(listOf(SttLanguage.KO_KR))

                Log.d(TAG, "✅ Temi wakeup() 호출 성공")

                // JavaScript에 준비 완료 알림
                callJavaScript("window.onSpeechReady", "")
                showToast("듣고 있어요! 🎤")

            } catch (e: Exception) {
                Log.e(TAG, "❌ Temi ASR 시작 실패", e)
                isListening = false
                callJavaScript("window.onSpeechError", "\"start_failed\"")
                showToast("음성 인식 시작 실패: ${e.message}")
            }
        }
    }

    @JavascriptInterface
    fun stopSpeechRecognition() {
        Log.d(TAG, "🛑 Temi ASR 중지")

        activity.runOnUiThread {
            try {
                isListening = false
                robot.finishConversation()
                Log.d(TAG, "✅ Temi conversation 종료됨")
            } catch (e: Exception) {
                Log.e(TAG, "❌ ASR 중지 실패", e)
            }
        }
    }

    private fun callJavaScript(functionName: String, param: String) {
        activity.runOnUiThread {
            val script = if (param.isEmpty()) {
                "$functionName && $functionName()"
            } else {
                "$functionName && $functionName($param)"
            }

            Log.d(TAG, "📞 JavaScript 호출: $script")

            val mainActivity = activity as? MainActivity
            mainActivity?.webView?.evaluateJavascript(script) { result ->
                Log.d(TAG, "📞 JavaScript 실행 결과: $result")
            }
        }
    }

    fun destroy() {
        Log.d(TAG, "🗑️ destroy() 호출")
        robot.removeAsrListener(asrListener)
        isListening = false
    }

    // ========== 음성 ==========

    @JavascriptInterface
    fun speak(text: String) {
        Log.d(TAG, "🔊 speak() 호출: $text")
        val ttsRequest = TtsRequest.create(text, false)
        robot.speak(ttsRequest)
    }

    // ========== Asset 오디오 경로 ==========

    @JavascriptInterface
    fun getAudioPath(filename: String): String {
        return "file:///android_asset/songs/$filename"
    }

    // ========== Asset 이미지 로딩 (춤추기용) ==========

    @JavascriptInterface
    fun loadImageAsBase64(filename: String): String {
        return try {
            val inputStream = activity.assets.open("songs/$filename")
            val bytes = inputStream.readBytes()
            inputStream.close()

            "data:image/png;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
        } catch (e: Exception) {
            Log.e(TAG, "이미지 로드 실패: $filename", e)
            ""
        }
    }

    // ========== 부스 이미지 로딩 ==========

    @JavascriptInterface
    fun loadBoothImage(filename: String): String {
        return try {
            val inputStream = activity.assets.open("$filename")
            val bytes = inputStream.readBytes()
            inputStream.close()

            "data:image/jpeg;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
        } catch (e: Exception) {
            Log.e(TAG, "부스 이미지 로드 실패: $filename", e)
            ""
        }
    }

    // ========== 사진촬영 테마 이미지 로딩 ==========

    @JavascriptInterface
    fun loadThemeImage(filename: String): String {
        return try {
            val inputStream = activity.assets.open("img/$filename")
            val bytes = inputStream.readBytes()
            inputStream.close()

            "data:image/png;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
        } catch (e: Exception) {
            Log.e(TAG, "테마 이미지 로드 실패: $filename", e)
            ""
        }
    }

    // ========== ImgBB 업로드 프록시 ==========

    @JavascriptInterface
    fun uploadImageToImgBB(base64Image: String): String {
        return try {
            Log.d(TAG, "ImgBB 업로드 시작...")

            val apiKey = "e947920cd2d87b83c74bfdb195b2a18f"

            val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
                override fun checkClientTrusted(chain: Array<X509Certificate>?, authType: String?) {}
                override fun checkServerTrusted(chain: Array<X509Certificate>?, authType: String?) {}
                override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
            })

            val sslContext = SSLContext.getInstance("TLS")
            sslContext.init(null, trustAllCerts, java.security.SecureRandom())

            val url = URL("https://api.imgbb.com/1/upload")
            val connection = url.openConnection() as HttpsURLConnection

            connection.sslSocketFactory = sslContext.socketFactory
            connection.hostnameVerifier = HostnameVerifier { _, _ -> true }

            connection.requestMethod = "POST"
            connection.doOutput = true
            connection.connectTimeout = 30000
            connection.readTimeout = 30000
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")

            val cleanBase64 = if (base64Image.contains("base64,")) {
                base64Image.substringAfter("base64,")
            } else {
                base64Image
            }

            Log.d(TAG, "이미지 데이터 길이: ${cleanBase64.length}")

            val postData = "key=$apiKey&image=${URLEncoder.encode(cleanBase64, "UTF-8")}"

            val writer = OutputStreamWriter(connection.outputStream)
            writer.write(postData)
            writer.flush()
            writer.close()

            val responseCode = connection.responseCode
            Log.d(TAG, "응답 코드: $responseCode")

            if (responseCode == HttpURLConnection.HTTP_OK) {
                val reader = BufferedReader(InputStreamReader(connection.inputStream))
                val response = reader.readText()
                reader.close()
                Log.d(TAG, "✅ 업로드 성공")
                response
            } else {
                val errorReader = BufferedReader(InputStreamReader(connection.errorStream))
                val errorResponse = errorReader.readText()
                errorReader.close()
                Log.e(TAG, "❌ 업로드 실패: $errorResponse")
                JSONObject().apply {
                    put("success", false)
                    put("error", "HTTP $responseCode: $errorResponse")
                }.toString()
            }
        } catch (e: Exception) {
            Log.e(TAG, "❌ 업로드 예외", e)
            JSONObject().apply {
                put("success", false)
                put("error", "${e.javaClass.simpleName}: ${e.message}")
            }.toString()
        }
    }

    // ========== 커스터마이징 ==========

    @JavascriptInterface
    fun setCustomization(settingsJson: String) {
        try {
            val json = JSONObject(settingsJson)

            prefs.edit().apply {
                putString("speed", json.getString("speed"))
                putString("voice", json.getString("voice"))
                putString("character", json.getString("character"))
                apply()
            }

            applyCharacterGesture(json.getString("character"))

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @JavascriptInterface
    fun getCustomization(): String {
        val settings = JSONObject()
        settings.put("speed", prefs.getString("speed", "normal"))
        settings.put("voice", prefs.getString("voice", "soft"))
        settings.put("character", prefs.getString("character", "theme1"))
        return settings.toString()
    }

    private fun applyCharacterGesture(character: String) {
        activity.runOnUiThread {
            when (character) {
                "theme1" -> {
                    robot.tiltAngle(10)
                    Thread {
                        Thread.sleep(500)
                        robot.tiltAngle(0)
                    }.start()
                }
                "theme2" -> {
                    robot.tiltAngle(15)
                    Thread {
                        Thread.sleep(300)
                        robot.tiltAngle(0)
                    }.start()
                }
                "theme3" -> {
                    robot.tiltBy(20, 1.0f)
                    Thread {
                        Thread.sleep(400)
                        robot.tiltBy(-40, 1.0f)
                        Thread.sleep(400)
                        robot.tiltBy(20, 1.0f)
                    }.start()
                }
            }
        }
    }

    // ========== 이동 ==========

    @JavascriptInterface
    fun goTo(location: String) {
        robot.goTo(location)
    }

    @JavascriptInterface
    fun getLocations(): String {
        val locations = robot.locations
        return JSONArray(locations).toString()
    }

    @JavascriptInterface
    fun saveLocation(name: String): Boolean {
        return robot.saveLocation(name)
    }

    @JavascriptInterface
    fun deleteLocation(name: String): Boolean {
        return robot.deleteLocation(name)
    }

    // ========== Follow Mode ==========

    @JavascriptInterface
    fun followMe() {
        robot.beWithMe()
    }

    @JavascriptInterface
    fun constraintBeWith() {
        robot.constraintBeWith()
    }

    // ========== Movement ==========

    @JavascriptInterface
    fun stopMovement() {
        robot.stopMovement()
    }

    @JavascriptInterface
    fun turnBy(degrees: Int, speed: Float) {
        robot.turnBy(degrees, speed)
    }

    @JavascriptInterface
    fun skidJoy(x: Float, y: Float) {
        robot.skidJoy(x, y, true)
    }

    // ========== 머리 제어 ==========

    @JavascriptInterface
    fun tiltHead(angle: Int) {
        robot.tiltAngle(angle)
    }

    @JavascriptInterface
    fun tiltBy(degrees: Int, speed: Float) {
        robot.tiltBy(degrees, speed)
    }

    // ========== 정보 조회 ==========

    @JavascriptInterface
    fun getBatteryLevel(): String {
        return try {
            JSONObject().apply {
                put("level", 100)
                put("isCharging", false)
            }.toString()
        } catch (e: Exception) {
            JSONObject().apply {
                put("level", 0)
                put("isCharging", false)
            }.toString()
        }
    }

    @JavascriptInterface
    fun getRobotInfo(): String {
        return try {
            JSONObject().apply {
                put("serialNumber", "TEMI-001")
                put("version", "1.136.0")
            }.toString()
        } catch (e: Exception) {
            JSONObject().apply {
                put("serialNumber", "unknown")
                put("version", "unknown")
            }.toString()
        }
    }

    // ========== 유틸 ==========

    @JavascriptInterface
    fun showToast(message: String) {
        Log.d(TAG, "🍞 Toast: $message")
        activity.runOnUiThread {
            Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
        }
    }
}