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
	ErrInvalidEmail = errors.New("not a valid email address")
)

// Email represents a valid email address.
type Email struct {
	value string
}

// NewEmail creates a new email address.
func NewEmail(email string) (Email, error) {
	var e Email
	match, _ := regexp.MatchString(`([\w.]+)@([\w.]+)`, email)
	if !match {
		return e, ErrInvalidEmail
	}
	e.value = email

	return e, nil
}

// String returns string representation of the email address.
func (n Email) String() string {
	return n.value
}

// Equals checks that two email addresses are the same.
func (n Email) Equals(value Value) bool {
	otherEmail, ok := value.(Email)
	return ok && n.value == otherEmail.value
}

//ZeroEmail represents the zero value for an email value object.
func ZeroEmail() Email {
	return Email{}
}
