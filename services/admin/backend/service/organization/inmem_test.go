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

package organization_test

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/organization"
)

//inmem in memory repo
type inMemRepo struct {
	m map[entity.ID]*organization.Organization
}

//newInmem create a new in memory repository
func NewInMemRepo() *inMemRepo {
	var m = map[entity.ID]*organization.Organization{}
	return &inMemRepo{
		m: m,
	}
}

//Create an organization
func (r *inMemRepo) Create(e *organization.Organization) (entity.ID, error) {
	r.m[e.ID] = e
	return e.ID, nil
}

//Get an organization
func (r *inMemRepo) Get(id entity.ID) (*organization.Organization, error) {
	if r.m[id] == nil {
		return nil, organization.ErrNotFound
	}
	return r.m[id], nil
}
