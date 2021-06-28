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

package main

import (
	"github.com/EventStore/EventStore-Client-Go/client"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/api/handler"
	projectRepository "github.com/dasch-swiss/dasch-service-platform/services/admin/backend/infrastructure/repository/project"
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/service/project"
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/server"
	"log"
)

func main() {

	s := server.NewAPISPAServer("8080")
	s.SetSPA("public/admin")

	config, err := client.ParseConnectionString("esdb://localhost:2113?tls=false")
	if err != nil {
		log.Fatal("Unexpected configuration error: ", err.Error())
	}

	client, err := client.NewClient(config)
	if err != nil {
		log.Fatal("Unexpected failure while creating new client: ", err.Error())
	}
	err = client.Connect()
	if err != nil {
		log.Fatal("Unexpected failure while connecting to client: ", err.Error())
	}

	projectRepo := projectRepository.NewProjectRepository(client)

	projectService := project.NewService(projectRepo)

	handler.MakeProjectHandlers(&s.Router, projectService)

	log.Fatal(s.ListenAndServe())
}
