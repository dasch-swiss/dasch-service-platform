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

package entity_test

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestNewUser(t *testing.T) {
	org, err := entity.NewUser("dduck", "dduck@example.com", "secret", "Donald", "Duck")
	assert.Nil(t, err)
	assert.NotNil(t, org.ID)
	assert.Equal(t, "http://ns.dasch.swiss/admin#User", org.Type)
	assert.Equal(t, "dduck", org.Username)
	assert.Equal(t, "dduck@example.com", org.Email)
	assert.Equal(t, "secret", org.Password)
	assert.Equal(t, "Donald", org.GivenName)
	assert.Equal(t, "Duck", org.FamilyName)

	assert.False(t, org.CreatedAt.IsZero())
	assert.True(t, org.UpdatedAt.IsZero())
}
