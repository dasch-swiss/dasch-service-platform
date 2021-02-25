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

package organization

import (
	"github.com/dasch-swiss/dasch-service-platform/services/resource/backend/entity"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func newFixtureOrganization() *entity.Organization {
	return &entity.Organization{
		ID:        entity.NewID(),
		Name:      "TEST Organization",
		CreatedAt: time.Now(),
	}
}

func Test_Create(t *testing.T) {
	repo := newInmem()
	service := NewService(repo)
	org := newFixtureOrganization()
	_, err := service.CreateOrganization(org.Name)
	assert.Nil(t, err)
	assert.False(t, org.CreatedAt.IsZero())
	assert.True(t, org.UpdatedAt.IsZero())
}
