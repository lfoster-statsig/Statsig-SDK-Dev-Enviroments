package com.statsig.androidsample

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.statsig.androidsdk.DebugViewCallback
import com.statsig.androidsdk.Statsig
import kotlinx.coroutines.launch

internal class DebugViewActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onResume() {
        super.onResume()
        val context = this
        val callback = object : DebugViewCallback {
            override fun invoke(p1: Boolean) {
                if (p1) {
                    lifecycleScope.launch {
                       Statsig.refreshCache()
                    }
                    finish()
                }
            }
        }
        Statsig.openDebugView(context, callback)
    }

    override fun onDestroy() {
        super.onDestroy()
    }
}