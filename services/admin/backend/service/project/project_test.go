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

	expectedUpdatedShortCode := "nsc"
	expectedUpdatedShortName := "new short name"
	expectedUpdatedLongName := "new project long name"
	expectedUpdatedDescription := "new project description"

	// update short code
	usc, err := service.UpdateProjectShortCode(ctx, foundProject.ID(), "nsc")
	assert.Nil(t, err)
	assert.Equal(t, expectedUpdatedShortCode, usc.ShortCode().String())
	assert.Equal(t, expectedShortName, usc.ShortName().String())
	assert.Equal(t, expectedLongName, usc.LongName().String())
	assert.Equal(t, expectedDescription, usc.Description().String())
	assert.NotZero(t, usc.ChangedAt())
	// TODO: assert ChangedBy is not an empty UUID

	// update short name
	usn, err := service.UpdateProjectShortName(ctx, foundProject.ID(), "new short name")
	assert.Nil(t, err)
	assert.Equal(t, expectedUpdatedShortCode, usn.ShortCode().String())
	assert.Equal(t, expectedUpdatedShortName, usn.ShortName().String())
	assert.Equal(t, expectedLongName, usn.LongName().String())
	assert.Equal(t, expectedDescription, usn.Description().String())

	// update long name
	uln, err := service.UpdateProjectLongName(ctx, foundProject.ID(), "new project long name")
	assert.Nil(t, err)
	assert.Equal(t, expectedUpdatedShortCode, uln.ShortCode().String())
	assert.Equal(t, expectedUpdatedShortName, uln.ShortName().String())
	assert.Equal(t, expectedUpdatedLongName, uln.LongName().String())
	assert.Equal(t, expectedDescription, uln.Description().String())

	// update description
	ud, err := service.UpdateProjectDescription(ctx, foundProject.ID(), "new project description")
	assert.Nil(t, err)
	assert.Equal(t, expectedUpdatedShortCode, ud.ShortCode().String())
	assert.Equal(t, expectedUpdatedShortName, ud.ShortName().String())
	assert.Equal(t, expectedUpdatedLongName, ud.LongName().String())
	assert.Equal(t, expectedUpdatedDescription, ud.Description().String())

	// get a list of project ids
	projectsList, err := service.ListProjects(ctx)
	assert.Nil(t, err)
	assert.Len(t, projectsList, 1)
	assert.Equal(t, projectsList[0], projectId)

	// delete a project
	deletedProject, err := service.DeleteProject(ctx, projectId)
	assert.Nil(t, err)
	assert.NotZero(t, deletedProject.DeletedAt())
	// TODO: assert DeletedBy is not an empty UUID
}
