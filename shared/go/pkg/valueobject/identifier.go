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

import "github.com/gofrs/uuid"

type Identifier struct {
	value uuid.UUID
}

//NewIdentifier creates a new identifier value object
func NewIdentifier() (Identifier, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return Identifier{}, err
	}
	return Identifier{value: id}, nil
}

//AsUUID returns the UUID of the identifier.
func (v Identifier) UUID() uuid.UUID {
	return v.value
}

// String implements the fmt.Stringer interface.
func (v Identifier) String() string {
	return v.value.String()
}

// MarshalText used to serialize the object
func (v Identifier) MarshalText() ([]byte, error) {
	return v.value.MarshalText()
}

// UnmarshalText used to deserialize the object and returns an error if it's invalid.
func (v *Identifier) UnmarshalText(b []byte) error {
	var u uuid.UUID
	err := u.UnmarshalText(b)
	if err != nil {
		return err
	}
	*v = Identifier{value: u}
	return nil
}

//Equals tests for equality with another value object
func (v Identifier) Equals(value Value) bool {
	otherIdentifier, ok := value.(Identifier)
	return ok && v.value == otherIdentifier.value
}
