package com.kw.temireactapp

import android.app.Activity
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

    // ========== 음성 ==========

    @JavascriptInterface
    fun speak(text: String) {
        robot.speak(TtsRequest.create(text, false))
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

    // ========== 정보 조회 (안전하게) ==========

    @JavascriptInterface
    fun getBatteryLevel(): String {
        return try {
            val data = JSONObject().apply {
                // batteryData가 없으면 더미 데이터
                put("level", 100)
                put("isCharging", false)
            }
            data.toString()
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
            val data = JSONObject().apply {
                put("serialNumber", "TEMI-001")
                put("version", "1.136.0")
            }
            data.toString()
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