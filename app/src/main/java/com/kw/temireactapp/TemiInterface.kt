package com.kw.temireactapp

import android.app.Activity
import android.content.Context
import android.content.SharedPreferences
import android.webkit.JavascriptInterface
import android.widget.Toast
import com.robotemi.sdk.Robot
import com.robotemi.sdk.TtsRequest
import org.json.JSONArray
import org.json.JSONObject

class TemiInterface(
    private val activity: Activity,
    private val robot: Robot
) {
    private val prefs: SharedPreferences =
        activity.getSharedPreferences("TemiCustomSettings", Context.MODE_PRIVATE)

    // ========== 음성 (커스터마이징 적용) ==========

    @JavascriptInterface
    fun speak(text: String) {
        // SDK v1.136.0에서는 기본 TTS만 지원
        // 속도/음성 조절은 TtsRequest에서 제한적
        val ttsRequest = TtsRequest.create(text, false)
        robot.speak(ttsRequest)
    }

    // ========== 커스터마이징 (설정만 저장, 제스처로 대응) ==========

    @JavascriptInterface
    fun setCustomization(settingsJson: String) {
        try {
            val json = JSONObject(settingsJson)

            // SharedPreferences에 저장
            prefs.edit().apply {
                putString("speed", json.getString("speed"))
                putString("voice", json.getString("voice"))
                putString("character", json.getString("character"))
                apply()
            }

            // TTS 커스터마이징은 SDK 제약으로 제한되므로
            // 캐릭터별 제스처로 개성을 표현
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

    // ========== 캐릭터별 제스처 ==========

    private fun applyCharacterGesture(character: String) {
        activity.runOnUiThread {
            when (character) {
                "theme1" -> {
                    // 프로페셔널 - 정중하게 인사
                    robot.tiltAngle(10)
                    Thread {
                        Thread.sleep(500)
                        robot.tiltAngle(0)
                    }.start()
                }
                "theme2" -> {
                    // 친근한 - 가볍게 고개 끄덕
                    robot.tiltAngle(15)
                    Thread {
                        Thread.sleep(300)
                        robot.tiltAngle(0)
                    }.start()
                }
                "theme3" -> {
                    // 귀여운 - 좌우로 흔들기
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