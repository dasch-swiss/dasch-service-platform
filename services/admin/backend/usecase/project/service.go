/*
 * Copyright 2021 Data and Service Center for the Humanities - DaSCH

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

import "github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"

//Service interface
type Service struct {
	repo Repository
}

//NewService create a new project use case
func NewService(r Repository) *Service {
	return &Service{
		repo: r,
	}
}

//CreateProject create a project
func (s *Service) CreateProject(shortCode string, createdBy entity.ID, shortName string, longName string, description string) (entity.ID, error) {
	e, err := entity.NewProject(shortCode, createdBy, shortName, longName, description)
	if err != nil {
		return e.ID, err
	}
	return s.repo.Create(e)
}

//GetProject get a project
func (s *Service) GetProject(id entity.ID) (*entity.Project, error) {
	return s.repo.Get(id)
}
