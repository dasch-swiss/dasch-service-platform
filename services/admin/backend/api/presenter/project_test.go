/*
 *  Copyright 2021 Data and Service Center for the Humanities - DaSCH.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package presenter_test

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/api/presenter"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestProject_NullifyJsonProps(t *testing.T) {
	id, _ := valueobject.NewIdentifier()

	p := presenter.Project{
		ID:          id,
		ShortCode:   "ffff",
		ShortName:   "short name",
		LongName:    "long name",
		Description: "description",
		CreatedAt:   "2021-06-03 10:00:00 +0000 UTC",
		CreatedBy:   "90c8c7ba-14c5-49b4-98ea-da479b5bf95e",
		ChangedAt:   "0001-01-01 00:00:00 +0000 UTC",
		ChangedBy:   "00000000-0000-0000-0000-000000000000",
		DeletedAt:   "0001-01-01 00:00:00 +0000 UTC",
		DeletedBy:   "00000000-0000-0000-0000-000000000000",
	}

	p = p.NullifyJsonProps()

	assert.Equal(t, p.ID, id)
	assert.Equal(t, p.ShortCode, "ffff")
	assert.Equal(t, p.ShortName, "short name")
	assert.Equal(t, p.LongName, "long name")
	assert.Equal(t, p.Description, "description")
	assert.Equal(t, p.CreatedAt, "2021-06-03 10:00:00 +0000 UTC")
	assert.Equal(t, p.CreatedBy, "90c8c7ba-14c5-49b4-98ea-da479b5bf95e")
	assert.Equal(t, p.ChangedAt, "null")
	assert.Equal(t, p.ChangedBy, "null")
	assert.Equal(t, p.DeletedAt, "null")
	assert.Equal(t, p.DeletedBy, "null")
}
