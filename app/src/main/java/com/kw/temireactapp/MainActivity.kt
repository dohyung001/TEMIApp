package com.kw.temireactapp

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.webkit.*
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.robotemi.sdk.Robot
import com.robotemi.sdk.listeners.OnGoToLocationStatusChangedListener
import org.json.JSONObject

class MainActivity : AppCompatActivity(), OnGoToLocationStatusChangedListener {

    lateinit var webView: WebView  // ✅ private 제거
    private var robot: Robot? = null
    private var temiInterface: TemiInterface? = null  // ✅ 추가

    companion object {
        private const val PERMISSIONS_REQUEST_CODE = 100
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Log.d("MainActivity", "Starting app...")

        checkPermissions()
        initializeTemi()
        setupWebView()

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    private fun checkPermissions() {
        val permissionsToRequest = mutableListOf<String>()

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
            != PackageManager.PERMISSION_GRANTED
        ) {
            permissionsToRequest.add(Manifest.permission.CAMERA)
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED
        ) {
            permissionsToRequest.add(Manifest.permission.RECORD_AUDIO)
        }

        if (permissionsToRequest.isNotEmpty()) {
            ActivityCompat.requestPermissions(
                this,
                permissionsToRequest.toTypedArray(),
                PERMISSIONS_REQUEST_CODE
            )
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        when (requestCode) {
            PERMISSIONS_REQUEST_CODE -> {
                if (grantResults.isNotEmpty() &&
                    grantResults.all { it == PackageManager.PERMISSION_GRANTED }
                ) {
                    Log.d("MainActivity", "✅ 모든 권한 허용됨")
                    webView.reload()
                } else {
                    Log.e("MainActivity", "❌ 권한 거부됨")
                    Toast.makeText(
                        this,
                        "카메라와 마이크 권한이 필요합니다",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }
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
            databaseEnabled = true
            allowFileAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_NO_CACHE
            setGeolocationEnabled(true)
            javaScriptCanOpenWindowsAutomatically = true
        }

        WebView.setWebContentsDebuggingEnabled(true)
        webView.webViewClient = WebViewClient()

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.let {
                    Log.d("MainActivity", "✅ 권한 요청 받음: ${it.resources.joinToString()}")
                    runOnUiThread {
                        it.grant(it.resources)
                        Log.d("MainActivity", "✅ 권한 승인함")
                    }
                }
            }

            override fun onPermissionRequestCanceled(request: PermissionRequest?) {
                Log.e("MainActivity", "❌ 권한 요청 취소됨")
            }

            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                consoleMessage?.let {
                    Log.d("WebView-Console", "${it.message()} -- From line ${it.lineNumber()} of ${it.sourceId()}")
                }
                return true
            }
        }

        robot?.let {
            val temiInterfaceInstance = TemiInterface(this, it)
            temiInterface = temiInterfaceInstance  // ✅ 저장
            webView.addJavascriptInterface(temiInterfaceInstance, "Temi")
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
        temiInterface?.destroy()  // ✅ SpeechRecognizer 정리
        webView.destroy()
    }
}