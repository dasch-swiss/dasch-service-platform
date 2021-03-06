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
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestNewIdentifier_String(t *testing.T) {
	identifier, err := valueobject.NewIdentifier()
	assert.Nil(t, err)
	assert.NotEmpty(t, identifier.String())
}

func TestIdentifierFromBytes(t *testing.T) {
	b := []byte("dc62dcd0-fb83-4488-8e5e-6d361ac79b6b")

	identifier, err := valueobject.IdentifierFromBytes(b)
	assert.Nil(t, err)
	assert.Equal(t, identifier.String(), "dc62dcd0-fb83-4488-8e5e-6d361ac79b6b")
}

func TestIdentifierFromBytes_InvalidUUID(t *testing.T) {
	b := []byte("d")

	_, err := valueobject.IdentifierFromBytes(b)
	assert.NotNil(t, err)
}
