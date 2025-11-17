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
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import javax.net.ssl.HttpsURLConnection
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager
import javax.net.ssl.HostnameVerifier
import java.security.cert.X509Certificate

class TemiInterface(
    private val activity: Activity,
    private val robot: Robot
) {
    private val prefs: SharedPreferences =
        activity.getSharedPreferences("TemiCustomSettings", Context.MODE_PRIVATE)

    // ========== 음성 ==========

    @JavascriptInterface
    fun speak(text: String) {
        val ttsRequest = TtsRequest.create(text, false)
        robot.speak(ttsRequest)
    }

    // ========== Asset 오디오 경로 (NEW) ==========

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

            "data:image/jpeg;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
        } catch (e: Exception) {
            Log.e("TemiInterface", "이미지 로드 실패: $filename", e)
            ""
        }
    }

    // ========== 부스 이미지 로딩 (NEW) ==========

    @JavascriptInterface
    fun loadBoothImage(filename: String): String {
        return try {
            val inputStream = activity.assets.open("booths/$filename")
            val bytes = inputStream.readBytes()
            inputStream.close()

            "data:image/jpeg;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
        } catch (e: Exception) {
            Log.e("TemiInterface", "부스 이미지 로드 실패: $filename", e)
            ""
        }
    }

    // ========== 사진촬영 테마 이미지 로딩 (NEW) ==========

    @JavascriptInterface
    fun loadThemeImage(filename: String): String {
        return try {
            val inputStream = activity.assets.open("img/$filename")
            val bytes = inputStream.readBytes()
            inputStream.close()

            "data:image/png;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
        } catch (e: Exception) {
            Log.e("TemiInterface", "테마 이미지 로드 실패: $filename", e)
            ""
        }
    }

    // ========== ImgBB 업로드 프록시 (SSL 인증서 우회) ==========

    @JavascriptInterface
    fun uploadImageToImgBB(base64Image: String): String {
        return try {
            Log.d("TemiInterface", "ImgBB 업로드 시작...")

            val apiKey = "e947920cd2d87b83c74bfdb195b2a18f"

            // ✅ SSL 인증서 검증 완전히 우회
            val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
                override fun checkClientTrusted(chain: Array<X509Certificate>?, authType: String?) {}
                override fun checkServerTrusted(chain: Array<X509Certificate>?, authType: String?) {}
                override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
            })

            val sslContext = SSLContext.getInstance("TLS")
            sslContext.init(null, trustAllCerts, java.security.SecureRandom())

            val url = URL("https://api.imgbb.com/1/upload")
            val connection = url.openConnection() as HttpsURLConnection

            // ✅ SSL 설정 적용
            connection.sslSocketFactory = sslContext.socketFactory
            connection.hostnameVerifier = HostnameVerifier { _, _ -> true }

            connection.requestMethod = "POST"
            connection.doOutput = true
            connection.connectTimeout = 30000
            connection.readTimeout = 30000
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")

            // Base64 데이터 추출
            val cleanBase64 = if (base64Image.contains("base64,")) {
                base64Image.substringAfter("base64,")
            } else {
                base64Image
            }

            Log.d("TemiInterface", "이미지 데이터 길이: ${cleanBase64.length}")

            val postData = "key=$apiKey&image=${URLEncoder.encode(cleanBase64, "UTF-8")}"

            val writer = OutputStreamWriter(connection.outputStream)
            writer.write(postData)
            writer.flush()
            writer.close()

            val responseCode = connection.responseCode
            Log.d("TemiInterface", "응답 코드: $responseCode")

            if (responseCode == HttpURLConnection.HTTP_OK) {
                val reader = BufferedReader(InputStreamReader(connection.inputStream))
                val response = reader.readText()
                reader.close()
                Log.d("TemiInterface", "✅ 업로드 성공")
                response
            } else {
                val errorReader = BufferedReader(InputStreamReader(connection.errorStream))
                val errorResponse = errorReader.readText()
                errorReader.close()
                Log.e("TemiInterface", "❌ 업로드 실패: $errorResponse")
                JSONObject().apply {
                    put("success", false)
                    put("error", "HTTP $responseCode: $errorResponse")
                }.toString()
            }
        } catch (e: Exception) {
            Log.e("TemiInterface", "❌ 업로드 예외", e)
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
        activity.runOnUiThread {
            Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
        }
    }
}