package com.statsig.androidsample

import android.app.Application
import android.util.Log
import com.statsig.androidsdk.Statsig
import com.statsig.androidsdk.StatsigOptions
import com.statsig.androidsdk.StatsigUser
import com.statsig.androidsdk.Tier
import kotlinx.coroutines.runBlocking
import kotlin.time.Duration.Companion.milliseconds


class AppEntry: Application() {
    override fun onCreate() {
        super.onCreate()
        // Wait on Statsig to spin up before doing anything else.
        val start = System.currentTimeMillis()
        runBlocking {
            // val options = StatsigOptions(api = "http://10.0.2.2:3006/v1", eventLoggingAPI = "http://10.0.2.2:3006/v1")
            // val options = StatsigOptions(api = "http://127.0.2.3:3006")

            val sdkKey = "client-oJY6hTJeduhEN2bf6fh6unHvxIk9UsjS99BlO4owh0r" // Statsig Docs
            // val sdkKey = "client-zUdXdSTygXJdzoE0sWTkP8GKTVsUMF2IRM7ShVO2JAG" // GPT

            val api = StatsigOptions().api  // default init API
//            val api = "http://10.0.2.2:3006/v1" // Local Scrapi

            val options = StatsigOptions(initializeOffline = true, api = api)
            options.setTier(Tier.DEVELOPMENT)

            val user = StatsigUser()
            // user.email = "test@fake.com"
            //val user = StatsigUser("brandNewUser")

            val initDetails = Statsig.initialize(this@AppEntry as Application, sdkKey, user, options)
            Log.i("MainActivity", "Init Succeeded: ${initDetails?.success}")
            Log.i("MainActivity", "Init Duration: ${initDetails?.duration?.milliseconds} millis")
        }
        val duration = System.currentTimeMillis() - start
        Log.e("MainActivity", "App observed init duration of $duration ms")
    }
}
