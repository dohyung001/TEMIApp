package com.kw.temireactapp

import android.os.Bundle
import android.util.Log
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.robotemi.sdk.Robot
import com.robotemi.sdk.listeners.OnGoToLocationStatusChangedListener
import org.json.JSONObject

class MainActivity : AppCompatActivity(), OnGoToLocationStatusChangedListener {

    private lateinit var webView: WebView
    private var robot: Robot? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Log.d("MainActivity", "Starting app...")
        initializeTemi()
        setupWebView()
    }

    private fun initializeTemi() {
        try {
            robot = Robot.getInstance()
            Log.d("MainActivity", "✅ Temi SDK initialized")
        } catch (e: Exception) {
            Log.e("MainActivity", "⚠️ Temi SDK not available")
            robot = null
        }
    }

    private fun setupWebView() {
        webView = findViewById(R.id.webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowFileAccessFromFileURLs = true          // ← 추가!
            allowUniversalAccessFromFileURLs = true     // ← 추가!
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        webView.webViewClient = WebViewClient()

        robot?.let {
            webView.addJavascriptInterface(TemiInterface(this, it), "Temi")
            Log.d("MainActivity", "✅ Temi Interface attached")
        }

        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onStart() {
        super.onStart()
        robot?.addOnGoToLocationStatusChangedListener(this)
    }

    override fun onStop() {
        super.onStop()
        robot?.removeOnGoToLocationStatusChangedListener(this)
    }

    // OnGoToLocationStatusChangedListener 구현
    override fun onGoToLocationStatusChanged(
        location: String,
        status: String,
        descriptionId: Int,
        description: String
    ) {
        runOnUiThread {
            val data = JSONObject().apply {
                put("location", location)
                put("status", status)
                put("description", description)
            }

            webView.evaluateJavascript(
                "window.onTemiLocationStatus && window.onTemiLocationStatus($data)",
                null
            )
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        webView.destroy()
    }
}