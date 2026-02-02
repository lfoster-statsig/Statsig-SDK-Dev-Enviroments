package main

import (
	"fmt"
	"reflect"
	"strconv"
	"strings"

	"os"

	statsig "github.com/statsig-io/go-sdk"

	godotenv "github.com/joho/godotenv"
)

func isArray(val interface{}) bool {
	// Use reflection to check if the value is a slice
	// return fmt.Sprintf("%T", val)[0:2] == "[]"
	okTarget := fmt.Sprintf("%T", val)[0:2] == "[]"
	if !okTarget {
		return false
	} else {
		return true
	}
}

func arrayContainsAny(target []interface{}, value []interface{}) bool {
	valueSet := make(map[string]struct{})
	for _, item := range value {
		valStr := convertToString(item)
		valueSet[valStr] = struct{}{}
	}

	for _, t := range target {
		strTarget := convertToString(t)
		_, strExists := valueSet[strTarget]
		if strExists {
			return true
		}
	}
	return false
}

func convertToString(a interface{}) string {
	if a == nil {
		return ""
	}
	if asString, ok := a.(string); ok {
		return asString
	}
	aVal := reflect.ValueOf(a)
	switch aVal.Kind() {
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return strconv.FormatInt(aVal.Int(), 10)
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		return strconv.FormatUint(aVal.Uint(), 10)
	case reflect.Float32, reflect.Float64:
		return strconv.FormatFloat(aVal.Float(), 'f', -1, 64)
	case reflect.Bool:
		return strconv.FormatBool(aVal.Bool())
	case reflect.String:
		return fmt.Sprintf("%v", a)
	case reflect.Slice, reflect.Array:
		var result []string
		for i := 0; i < aVal.Len(); i++ {
			result = append(result, fmt.Sprintf("%v", aVal.Index(i).Interface()))
		}
		return strings.Join(result, ",")
	}

	return fmt.Sprintf("%v", a)
}

func main() {
	// Load .env from parent directory
	godotenv.Load("../.env")
	fmt.Println(os.Getenv("SERVER_KEY"))
	statsig.InitializeWithOptions(os.Getenv("SERVER_KEY"), &statsig.Options{Environment: statsig.Environment{Tier: "development"}})

	// Get the logged-in user's ID from environment variable
	userID := os.Getenv("USER")
	fmt.Println("User ID: " + userID)

	customProps := map[string]interface{}{}

	countryCodesFails := []interface{}{"tests", "hehe"} // FAILS
	countryCodes := []interface{}{"tests"} // PASSES

	testing123 := []string{"tests", "heheheha"} // FAILS CAUSE NOT INTERFACE TYPE

	fmt.Printf("countryCodesFails is array: %v\n", isArray(countryCodesFails))
	fmt.Printf("countryCodes is array: %v\n", isArray(countryCodes))

	// arrayContainsAny(countryCodesFails, (countryCodes))

	// fmt.Printf("Type of customProps[\"testing\"]: %T\n", customProps["testing"])
	customProps["testing"] = testing123
	// customProps["testing"] = countryCodes

	user := statsig.User{UserID: userID, Custom: customProps}
	feature := statsig.CheckGate(user, "new_feature_gate")

	array_feature := statsig.CheckGate(user, "go-core-array-test")

	status := "disabled"
	if feature {
		status = "enabled"
	}
	fmt.Println("Feature is " + status)

	fmt.Println("Array Feature is " + fmt.Sprintf("%v", array_feature))
	
	statsig.LogEvent(statsig.Event{
		User: user,
		EventName: "app_started",
                Value: status,
		Metadata: nil,
	})

	// Shutdown to ensure all events are flushed before exiting
	statsig.Shutdown()
}