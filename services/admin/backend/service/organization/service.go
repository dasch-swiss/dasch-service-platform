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
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/organization"
)

//Service interface
type Service struct {
	repo Repository
}

//NewService create a new organization use case
func NewService(r Repository) *Service {
	return &Service{
		repo: r,
	}
}

//CreateOrganization creates an organization
func (s *Service) CreateOrganization(name string) (entity.ID, error) {
	e, err := organization.NewOrganization(name)
	if err != nil {
		return e.ID, err
	}
	return s.repo.Create(e)
}

//GetOrganization gets an Organization
func (s *Service) GetOrganization(id entity.ID) (*organization.Organization, error) {
	return s.repo.Get(id)
}
