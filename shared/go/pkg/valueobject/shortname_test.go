/*
 *  Copyright 2021 Data and Service Center for the Humanities - DaSCH.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package valueobject_test

import (
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestNewShortName(t *testing.T) {
	a, _ := valueobject.NewShortName("abc")
	assert.Equal(t, a.String(), "abc")
}

func TestNewInvalidShortName(t *testing.T) {
	_, err := valueobject.NewShortName("")
	assert.NotNil(t, err)

	_, err2 := valueobject.NewShortName(" ")
	assert.NotNil(t, err2)
}

func TestShortName_Equals(t *testing.T) {
	a, _ := valueobject.NewShortName("abc")
	b, _ := valueobject.NewShortName("abc")
	assert.True(t, a.Equals(b))
}

func TestShortName_NotEquals(t *testing.T) {
	a, _ := valueobject.NewShortName("abc")
	b, _ := valueobject.NewShortName("def")
	assert.False(t, a.Equals(b))
}
