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
	url2 "net/url"
)

// EmailAddress errors
var (
	ErrInvalidURL = errors.New("not a valid URL")
)

// URL represents a valid URL address.
type URL struct {
	value string
}

// NewURL creates a new URL.
func NewURL(value string) (URL, error) {
	url := ZeroURL()

	u, err := url2.Parse(value)
	if err != nil {
		return url, ErrInvalidURL
	}

	if u.Host == "" {
		return url, ErrInvalidEmail
	}

	url.value = value

	return url, nil
}

// String returns string representation of the URL.
func (u URL) String() string {
	return u.value
}

// Equals checks that two URL addresses are the same.
func (u URL) Equals(value Value) bool {
	otherURL, ok := value.(Email)
	return ok && u.value == otherURL.value
}

//ZeroURL represents the zero value for an URL value object.
func ZeroURL() URL {
	return URL{}
}
