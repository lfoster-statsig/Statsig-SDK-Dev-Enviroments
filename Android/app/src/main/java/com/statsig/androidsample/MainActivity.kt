package com.statsig.androidsample

import android.app.Activity
import android.app.Application
import android.content.ComponentName
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.net.http.HttpResponseCache
import android.os.Bundle
import android.util.Log
import android.widget.Button
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.tooling.preview.Preview
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.lifecycleScope
import com.statsig.androidsdk.Statsig
import com.statsig.androidsample.ui.theme.StasigSDKTestAppTheme
import com.statsig.androidsdk.DebugViewCallback
import com.statsig.androidsdk.IStatsigCallback
import com.statsig.androidsdk.StatsigOptions
import com.statsig.androidsdk.StatsigUser
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import kotlin.time.Duration.Companion.seconds


class MainActivity : AppCompatActivity() {
    private val flagId = "always_on_gate"
    private val experimentId = "sdk_info"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val readFlagValue = Statsig.checkGate(flagId)
        val allOverrides = Statsig.getInitializeResponseJson().getInitializeResponseJSON()

        setContent {
            StasigSDKTestAppTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Surface(shape = RoundedCornerShape(.5f,.5f,.5f,.5f)) {
                        val scrollState = rememberScrollState()
                        Column(modifier = Modifier.verticalScroll(scrollState)) {
                            Greeting(
                                flagName = flagId,
                                flagValue = readFlagValue,
                                modifier = Modifier.padding(innerPadding)
                            )

                            Button({ openDebugView() }) {
                                Text("Open Debug View")
                            }
//                            Button({
//                                Statsig.removeAllOverrides()
//                                lifecycleScope.launch {
//                                    Statsig.refreshCache()
//                                }
//                            }) {
//                                Text("Remove All Overrides")
//                            }
                        }
                    }
                }
            }
        }
    }

    override fun onStop() {
        super.onStop()
        // killCache()
    }

    override fun onDestroy() {
        super.onDestroy()
        if (Statsig.isInitialized()) {
            Statsig.shutdown()
        }
    }

    private fun getActivityContext(contextToUnwrap: Context) : Activity? {
        var context = contextToUnwrap
        while (context is ContextWrapper) {
            if (context is Activity) return context
            context = context.baseContext
        }
        return null
    }

    private fun openDebugView() {
        startActivity(Intent(this, DebugViewActivity::class.java))
    }
}


@Composable
fun Greeting(flagName: String, flagValue: Boolean, modifier: Modifier = Modifier) {
    Text(
        text = "Current value for $flagName is: ${flagValue.toString().uppercase()}",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    StasigSDKTestAppTheme {
        Greeting("preview-flag-true", true)
    }
}