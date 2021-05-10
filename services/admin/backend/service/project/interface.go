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

package project

import (
	"context"

	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/project"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
)

//Reader interface
type Reader interface {
	Load(ctx context.Context, id valueobject.Identifier) (*project.Aggregate, error)
	GetProjectIds(ctx context.Context) ([]valueobject.Identifier, error)
	// Search(query string) ([]*project.Aggregate, error)
	// List() ([]*project.Aggregate, error)
}

//Writer interface
type Writer interface {
	Save(ctx context.Context, e *project.Aggregate) (valueobject.Identifier, error)
	// UpdateShortCode(ctx context.Context, id valueobject.Identifier, shortCode valueobject.ShortCode) error
	// Delete(e *entity.ID) error
}

//Repository interface which should be implemented by repositories.
type Repository interface {
	Reader
	Writer
}

//UseCase interface which should be implemented by services.
type UseCase interface {
	GetProject(ctx context.Context, id valueobject.Identifier) (*project.Aggregate, error)
	ListProjects(ctx context.Context) ([]valueobject.Identifier, error)
	CreateProject(ctx context.Context, shortCode string, shortname string, longName string, description string) (valueobject.Identifier, error)
	DeleteProject(ctx context.Context, id valueobject.Identifier) (*project.Aggregate, error)
	UpdateProjectShortCode(ctx context.Context, id valueobject.Identifier, shortCode string) (*project.Aggregate, error)
	UpdateProjectShortName(ctx context.Context, id valueobject.Identifier, shortName string) (*project.Aggregate, error)
	UpdateProjectLongName(ctx context.Context, id valueobject.Identifier, longName string) (*project.Aggregate, error)
	UpdateProjectDescription(ctx context.Context, id valueobject.Identifier, description string) (*project.Aggregate, error)
}
