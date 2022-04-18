package interfaces

import (
	"strconv"
	"strings"
)

func IntArrayToString(intArray []int, separator string) string {
	result := make([]string, len(intArray))
	for i, v := range intArray {
		result[i] = strconv.Itoa(v)
	}

	return strings.Join(result, separator)
}
