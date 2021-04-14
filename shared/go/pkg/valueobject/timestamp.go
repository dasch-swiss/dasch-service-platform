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

import (
	"time"
)

type Timestamp struct {
	value time.Time
}

//NewTimestamp creates a new timestamp value object
func NewTimestamp() Timestamp {
	v := time.Now()
	return Timestamp{value: v}
}

//AsUUID returns the UUID of the identifier.
func (v Timestamp) Time() time.Time {
	return v.value
}

// String implements the fmt.Stringer interface.
func (v Timestamp) String() string {
	return v.value.String()
}

// MarshalText used to serialize the object
func (v Timestamp) MarshalText() ([]byte, error) {
	return v.value.MarshalText()
}

// UnmarshalText used to deserialize the object and returns an error if it's invalid.
func (v *Timestamp) UnmarshalText(b []byte) error {
	var unmarshalledValue time.Time
	err := unmarshalledValue.UnmarshalText(b)
	if err != nil {
		return err
	}
	*v = Timestamp{value: unmarshalledValue}
	return nil
}

// MarshalJSON used to serialize the object
func (v Timestamp) MarshalJSON() ([]byte, error) {
	return v.value.MarshalJSON()
}

// UnmarshalJSON used to deserialize the object and returns an error if it's invalid.
func (v *Timestamp) UnmarshalJSON(b []byte) error {
	var unmarshalledValue time.Time
	err := unmarshalledValue.UnmarshalJSON(b)
	if err != nil {
		return err
	}
	*v = Timestamp{value: unmarshalledValue}
	return nil
}

//Equals tests for equality with another value object
func (v Timestamp) Equals(value Value) bool {
	otherIdentifier, ok := value.(Timestamp)
	return ok && v.value == otherIdentifier.value
}
