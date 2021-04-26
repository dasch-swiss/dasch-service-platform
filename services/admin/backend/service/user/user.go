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

package user

import (
	"context"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity/user"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
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

//Signup new user
func (s *Service) SignupUser(ctx context.Context, username string, email string, password string, givenName string, familyName string) (valueobject.Identifier, error) {

	id, _ := valueobject.NewIdentifier()
	un, err := valueobject.NewUsername(username)
	if err != nil {
		return valueobject.Identifier{}, err
	}

	em, err := valueobject.NewEmail(email)
	if err != nil {
		return valueobject.Identifier{}, err
	}

	pw, err := valueobject.NewPassword(password)
	if err != nil {
		return valueobject.Identifier{}, err
	}

	gn, err := valueobject.NewGivenName(givenName)
	if err != nil {
		return valueobject.Identifier{}, err
	}

	fn, err := valueobject.NewFamilyName(familyName)
	if err != nil {
		return valueobject.Identifier{}, err
	}

	e := user.NewAggregate(id, un, em, pw, gn, fn)

	if _, err := s.repo.Save(ctx, e); err != nil {
		return valueobject.Identifier{}, err
	}

	return id, nil
}

//GetUser get a user
func (s *Service) GetUser(ctx context.Context, id valueobject.Identifier) (*user.Aggregate, error) {

	u, err := s.repo.Load(ctx, id)
	if err != nil {
		return &user.Aggregate{}, err
	}

	return u, nil
}
