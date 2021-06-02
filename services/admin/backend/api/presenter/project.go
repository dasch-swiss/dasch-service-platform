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

package presenter

import (
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
)

// Project data used as the result for any project operation.
type Project struct {
	ID          valueobject.Identifier `json:"id"`
	ShortCode   string                 `json:"shortCode"`
	ShortName   string                 `json:"shortName"`
	LongName    string                 `json:"longName"`
	Description string                 `json:"description"`
	CreatedAt   string                 `json:"createdAt"`
	CreatedBy   string                 `json:"createdBy"`
	ChangedAt   string                 `json:"changedAt"`
	ChangedBy   string                 `json:"changedBy"`
	DeletedAt   string                 `json:"deletedAt"`
	DeletedBy   string                 `json:"deletedBy"`
}

func (p *Project) NullifyJsonProps() Project {
	if p.ChangedAt == "0001-01-01 00:00:00 +0000 UTC" {
		p.ChangedAt = "null"
	}

	if p.ChangedBy == "00000000-0000-0000-0000-000000000000" {
		p.ChangedBy = "null"
	}

	if p.DeletedAt == "0001-01-01 00:00:00 +0000 UTC" {
		p.DeletedAt = "null"
	}

	if p.DeletedBy == "00000000-0000-0000-0000-000000000000" {
		p.DeletedBy = "null"
	}

	return *p
}
