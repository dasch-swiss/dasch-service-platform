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

package valueobject_test

import (
	"fmt"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"testing"
)

// Create a different type of value object used in Equals() check
type NotEmailAddress struct {
	value string
}

func (n NotEmailAddress) String() string {
	return n.value
}

func (n NotEmailAddress) Equals(value valueobject.Value) bool {
	return false
}

func ExampleEmailAddress_String() {
	numeral, _ := valueobject.NewEmailAddress("joe@blogs.com")
	fmt.Println(numeral.String())
	// Output: joe@blogs.com
}

func TestShouldntAcceptInvalidEmailAddress(t *testing.T) {
	_, err := valueobject.NewEmailAddress("invalid")
	if err == nil {
		t.Fatal("We expected an error")
	}
}

func ExampleEmailAddress_Equals() {
	a, _ := valueobject.NewEmailAddress("joe@blogs.com")
	b, _ := valueobject.NewEmailAddress("joe@blogs.com")

	fmt.Println(a.Equals(b))
	// Output: true
}

func TestShouldCompareTwoEmailAddresssAsNotEqual(t *testing.T) {
	a, _ := valueobject.NewEmailAddress("joe@blogs.com")
	b, _ := valueobject.NewEmailAddress("mandy@blogs.com")
	if a.Equals(b) == true {
		t.Fatal("Shouldn't be same value")
	}
}

func TestShouldNotBeEqualIfNotEmailAddress(t *testing.T) {
	var notEmailAddress NotEmailAddress
	numeral, _ := valueobject.NewEmailAddress("joe@blogs.com")

	if numeral.Equals(notEmailAddress) == true {
		t.Fatal("Different value object types can not be equal")
	}
}
