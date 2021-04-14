/*
 * Copyright 2021 DaSCH - Data and Service Center for the Humanities.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package valueobject_test

import (
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestNewTimestamp(t *testing.T) {
	timestamp := valueobject.NewTimestamp()
	assert.NotEmpty(t, timestamp.String())
}

func TestTimestamp_MarshalJSON(t *testing.T) {
	// var unixTimestamp int64 = 1618337508
	// expected := []byte(`{"bar": 1618337508}`)
	expected := valueobject.NewTimestamp()
	marshaled, err := expected.MarshalJSON()
	assert.Nil(t, err)

	var unmarshalled valueobject.Timestamp
	err = unmarshalled.UnmarshalText(marshaled)
	assert.Nil(t, err)

	assert.Equal(t, expected, unmarshalled)
}

func TestTimestamp_UnmarshalJSON(t *testing.T) {


}
