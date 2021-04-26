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

package organization_test

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	organizationEntity "github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/organization"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/service/organization"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func newFixtureOrganization() *organizationEntity.Organization {
	return &organizationEntity.Organization{
		ID:        entity.NewID(),
		Name:      "TEST Organization",
		CreatedAt: time.Now(),
	}
}

func Test_Create(t *testing.T) {
	repo := NewInMemRepo()
	service := organization.NewService(repo)
	org := newFixtureOrganization()
	_, err := service.CreateOrganization(org.Name)
	assert.Nil(t, err)
	assert.False(t, org.CreatedAt.IsZero())
	assert.True(t, org.UpdatedAt.IsZero())
}
