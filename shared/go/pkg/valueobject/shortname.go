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

package valueobject

import "fmt"

type ShortName struct {
	value string
}

// NewShortName creates a new valid short name object.
func NewShortName(value string) (ShortName, error) {
	if len(value) > 15 || value == "" {
		return ShortName{}, fmt.Errorf("invalid short name, must be within 15 characters and non-empty")
	}

	return ShortName{value: value}, nil
}

// String implements the fmt.Stringer interface.
func (v ShortName) String() string {
	return v.value
}

// MarshalText used to serialize the object
func (v ShortName) MarshalText() ([]byte, error) {
	return []byte(v.value), nil
}

// UnmarshalText used to deserialize the object and returns an error if it's invalid.
func (v *ShortName) UnmarshalText(b []byte) error {
	var err error
	*v, err = NewShortName(string(b))
	return err
}

// Equals checks that two value objects are the same.
func (v ShortName) Equals(value Value) bool {
	otherValueObject, ok := value.(ShortName)
	return ok && v.value == otherValueObject.value
}
