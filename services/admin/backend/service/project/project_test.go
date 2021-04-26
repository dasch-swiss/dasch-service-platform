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

package project_test

import (
	"context"
	"testing"
	"time"

	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/service/project"
	"github.com/stretchr/testify/assert"
)

func TestProject_CreateProject(t *testing.T) {

	expectedAggregateType := "http://ns.dasch.swiss/admin#Project"
	expectedShortCode := "psc"
	expectedShortName := "short name"
	expectedLongName := "project long name"
	expectedDescription := "project description"

	repo := NewInMemRepo()
	service := project.NewService(repo)
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	projectId, err := service.CreateProject(ctx, expectedShortCode, expectedShortName, expectedLongName, expectedDescription)
	assert.Nil(t, err)

	foundProject, err := service.GetProject(ctx, projectId)
	assert.Nil(t, err)
	assert.Equal(t, expectedAggregateType, foundProject.AggregateType().String())
	assert.Equal(t, expectedShortCode, foundProject.ShortCode().String())
	assert.Equal(t, expectedShortName, foundProject.ShortName().String())
	assert.Equal(t, expectedLongName, foundProject.LongName().String())
	assert.Equal(t, expectedDescription, foundProject.Description().String())
}
