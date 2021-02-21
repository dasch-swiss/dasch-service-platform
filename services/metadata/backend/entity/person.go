/*
 * Copyright © 2015-2018 the contributors (see Contributors.md).
 *
 *  This file is part of Knora.
 *
 *  Knora is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Knora is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public
 *  License along with Knora.  If not, see <http://www.gnu.org/licenses/>.
 */

package entity

import (
	"github.com/dasch-swiss/dasch-service-platform/services/metadata/backend/entity/entity"
	//"github.com/dasch-swiss/dasch-service-platform/services/metadata/backend/address"
	"time"
)

//Person domain entity
type Person struct {
	ID         entity.ID
	Type       string
	Email      []string
	FamilyName string
	GivenName  string
	JobTitle   []string
	CreatedAt  time.Time
	UpdatedAt  time.Time
	Address    []entity.ID
	MemberOf   []entity.ID // organization
}
