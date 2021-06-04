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

package project

import (
	"context"
	"fmt"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/project"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
)

// Service interface which contains the repository.
type Service struct {
	repo Repository
}

// NewService creates a new project use case.
func NewService(r Repository) *Service {
	return &Service{
		repo: r,
	}
}

// CreateProject creates new project with the provided values.
func (s *Service) CreateProject(ctx context.Context, shortCode valueobject.ShortCode, shortName valueobject.ShortName, longName valueobject.LongName, description valueobject.Description) (valueobject.Identifier, error) {

	// generate new uuid
	id, _ := valueobject.NewIdentifier()

	// initialize an array of existing short codes
	var existingShortCodes []valueobject.ShortCode

	// get a list of all the projects
	existingProjects, _ := s.ListProjects(ctx, true)

	// loop through each project and add each short code to the array of existing short codes
	for _, proj := range existingProjects {
		existingShortCodes = append(existingShortCodes, proj.ShortCode())
	}

	// ensure the short code isn't used by any existing projects
	if len(existingShortCodes) > 0 {
		for _, esc := range existingShortCodes {
			if shortCode.String() == esc.String() {
				return valueobject.Identifier{}, fmt.Errorf("provided short code already exists")
			}
		}
	}

	// create project aggregate
	agg := project.NewAggregate(id, shortCode, shortName, longName, description)

	// save event to event store
	if _, err := s.repo.Save(ctx, agg); err != nil {
		return valueobject.Identifier{}, err
	}

	return id, nil
}

// UpdateProject updates the current project info with the provided values.
func (s *Service) UpdateProject(ctx context.Context, id valueobject.Identifier, shortCode valueobject.ShortCode, shortName valueobject.ShortName, longName valueobject.LongName, description valueobject.Description) (*project.Aggregate, error) {

	// get the project to update
	p, err := s.repo.Load(ctx, id)
	if err != nil {
		return &project.Aggregate{}, err
	}

	// throw error if project has been deleted
	if !p.DeletedAt().Time().IsZero() {
		return &project.Aggregate{}, project.ErrProjectHasBeenDeleted
	}

	// throw error is none of the fields actually differ from their current values
	if isIdentical(*p, shortCode, shortName, longName, description) {
		return &project.Aggregate{}, project.ErrNoPropertiesChanged
	}

	// update the project
	if err := p.UpdateProject(id, shortCode, shortName, longName, description); err != nil {
		return &project.Aggregate{}, err
	}

	// save the project
	if _, err := s.repo.Save(ctx, p); err != nil {
		return &project.Aggregate{}, err
	}

	return p, nil
}

// DeleteProject deletes a project corresponding to the provided uuid.
func (s *Service) DeleteProject(ctx context.Context, uuid valueobject.Identifier) (*project.Aggregate, error) {

	// get the project to delete
	p, err := s.repo.Load(ctx, uuid)
	if err != nil {
		return &project.Aggregate{}, err
	}

	// delete the project
	p.DeleteProject(uuid)

	// save the event
	if _, err := s.repo.Save(ctx, p); err != nil {
		return &project.Aggregate{}, err
	}

	return p, nil
}

// GetProject gets a project with the corresponding uuid.
func (s *Service) GetProject(ctx context.Context, uuid valueobject.Identifier) (*project.Aggregate, error) {

	p, err := s.repo.Load(ctx, uuid)
	if err != nil {
		return &project.Aggregate{}, err
	}

	return p, nil
}

// ListProjects lists all the active projects found in the event store.
// returnDeletedProjects can be used to also return projects that have been marked as deleted.
func (s *Service) ListProjects(ctx context.Context, returnDeletedProjects bool) ([]project.Aggregate, error) {

	var projectsList []project.Aggregate

	ids, err := s.repo.GetProjectIds(ctx, returnDeletedProjects)
	if err != nil {
		return []project.Aggregate{}, err
	}

	for _, id := range ids {
		p, err := s.GetProject(ctx, id)
		if err != nil {
			return []project.Aggregate{}, err
		}

		projectsList = append(projectsList, *p)
	}

	return projectsList, nil
}

// isIdentical returns true if all the values of the fields of the provided aggregate are the same as the provided values.
func isIdentical(p project.Aggregate, shortCode valueobject.ShortCode, shortName valueobject.ShortName, longName valueobject.LongName, description valueobject.Description) bool {
	if p.ShortCode().Equals(shortCode) &&
		p.ShortName().Equals(shortName) &&
		p.LongName().Equals(longName) &&
		p.Description().Equals(description) {
		return true
	}

	return false
}
