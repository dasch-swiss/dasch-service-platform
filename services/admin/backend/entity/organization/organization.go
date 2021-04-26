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

package organization

import (
	"github.com/dasch-swiss/dasch-service-platform/services/admin/backend/entity"
	"time"
)

//postalAddress domain entity
type postalAddress struct {
	StreetAddress   string
	PostalCode      string
	AddressLocality string
}

//Organization domain entity
type Organization struct {
	ID              entity.ID
	Type            string
	Name            string
	Email           string
	Url             string
	PostalAddresses postalAddress
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

//NewOrganization create a new organization entity
func NewOrganization(name string) (*Organization, error) {
	org := &Organization{
		ID:        entity.NewID(),
		Type:      "http://ns.dasch.swiss/repository#Organization",
		Name:      name,
		CreatedAt: time.Now(),
	}

	err := org.Validate()
	if err != nil {
		return nil, ErrInvalidEntity
	}

	return org, nil
}

//AddPostalAddress add address to organization
func (org *Organization) AddPostalAddress(streetaddress string, postalcode string, addresslocality string) error {

	address := postalAddress{
		StreetAddress:   streetaddress,
		PostalCode:      postalcode,
		AddressLocality: addresslocality,
	}

	if address.StreetAddress == "" {
		return ErrInvalidEntity
	}

	if address.PostalCode == "" {
		return ErrInvalidEntity
	}

	if address.AddressLocality == "" {
		return ErrInvalidEntity
	}

	org.PostalAddresses = address
	org.UpdatedAt = time.Now()
	return nil
}

//RemoveAddress remove address from organization
func (org *Organization) RemoveAddress() error {
	if org.PostalAddresses == (postalAddress{}) {
		return ErrPostalAddressNotSet
	} else {
		org.PostalAddresses = postalAddress{}
	}
	return nil
}

//Validate validate organization entity
func (org *Organization) Validate() error {
	if org.Name == "" {
		return ErrInvalidEntity
	}

	return nil
}
