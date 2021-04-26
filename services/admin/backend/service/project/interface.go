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

package project

import (
	"context"

	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/project"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
)

//Reader interface
type Reader interface {
	Load(ctx context.Context, id valueobject.Identifier) (*project.Aggregate, error)
	// Search(query string) ([]*project.Aggregate, error)
	// List() ([]*project.Aggregate, error)
}

//Writer interface
type Writer interface {
	Save(ctx context.Context, e *project.Aggregate) (valueobject.Identifier, error)
	// Update(e *project.Aggregate) error
	// Delete(e *entity.ID) error
}

//Repository interface which should be implemented by repositories.
type Repository interface {
	Reader
	Writer
}

//UseCase interface which should be implemented by services.
type UseCase interface {
	GetProject(id valueobject.Identifier) (*project.Aggregate, error)
	CreateProject(name string) (valueobject.Identifier, error)
}
