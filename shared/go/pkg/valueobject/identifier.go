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

type Identifier struct {
	value string
}

//NewIdentifier creates a identifier value object
func NewIdentifier(value string) (Identifier, error) {
	var n Identifier
	n.value = value
	return n, nil
}

//String returns the value as string
func (n Identifier) String() string {
	return n.value
}

//Equals tests for equality with another value object
func (n Identifier) Equals(value Value) bool {
	otherIdentifier, ok := value.(Identifier)
	return ok && n.value == otherIdentifier.value
}
