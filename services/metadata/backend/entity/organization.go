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

package entity

import (
	"github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/valueobject"
	"time"
)

//Organization is the domain entity.
type Organization struct {
	ID              ID
	Type            string
	Name            string
	Email           valueobject.Email
	Url             string
	PostalAddresses address
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

//postalAddress represents the postal address of the organization domain entity.
type address struct {
	StreetAddress   string
	PostalCode      string
	AddressLocality string
}

//NewOrganization creates a new organization entity.
func NewOrganization(name string) (*Organization, error) {
	org := &Organization{
		ID:        NewID(),
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

//AddAddress adds a postal address to the organization.
func (org *Organization) AddAddress(streetAddress string, postalCode string, addressLocality string) error {

	address := address{
		StreetAddress:   streetAddress,
		PostalCode:      postalCode,
		AddressLocality: addressLocality,
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

//RemoveAddress removes the postal address from the organization.
func (org *Organization) RemoveAddress() error {
	if org.PostalAddresses == (address{}) {
		return ErrPostalAddressNotSet
	} else {
		org.PostalAddresses = address{}
	}
	return nil
}

//AddEmailAddress adds the email address to the organization.
func (org *Organization) AddEmail(emailAddress valueobject.Email) error {
	org.Email = emailAddress
	org.UpdatedAt = time.Now()
	return nil
}

//RemoveEmail removes the email address from the organization.

//Validate validates the organization entity.
func (org *Organization) Validate() error {
	if org.Name == "" {
		return ErrInvalidEntity
	}

	return nil
}
