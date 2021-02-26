/*
 * Copyright © 2021 the contributors.
 *
 *  This file is part of the DaSCH Service Platform.
 *
 *  The DaSCH Service Platform is free software: you can
 *  redistribute it and/or modify it under the terms of the
 *  GNU Affero General Public License as published by the
 *  Free Software Foundation, either version 3 of the License,
 *  or (at your option) any later version.
 *
 *  The DaSCH Service Platform is distributed in the hope that
 *  it will be useful, but WITHOUT ANY WARRANTY; without even
 *  the implied warranty of MERCHANTABILITY or FITNESS FOR
 *  A PARTICULAR PURPOSE.  See the GNU Affero General Public
 *  License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public
 *  License along with the DaSCH Service Platform.  If not, see
 *  <http://www.gnu.org/licenses/>.
 *
 */

package valueobject

import (
	"errors"
	"regexp"
)

// EmailAddress errors
var (
	ErrInvalidEmailAddress = errors.New("Not a valid email address")
)

// EmailAddress represents a valid email address
type EmailAddress struct {
	value string
}

// NewEmailAddress creates a new email address
func NewEmailAddress(email string) (EmailAddress, error) {
	var n EmailAddress
	match, _ := regexp.MatchString(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`, email)
	if !match {
		return n, ErrInvalidEmailAddress
	}
	n.value = email

	return n, nil
}

// String returns string representation of the email address
func (n EmailAddress) String() string {
	return n.value
}

// Equals checks that two email addresses are the same
func (n EmailAddress) Equals(value Value) bool {
	otherEmailAddress, ok := value.(EmailAddress)
	return ok && n.value == otherEmailAddress.value
}
