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

package middleware

import (
	metric "github.com/dasch-swiss/dasch-service-platform/shared/go/pkg/metric"
	"github.com/urfave/negroni"
	"net/http"
	"strconv"
)

//Metrics to prometheus
func Metrics(mService metric.Service) negroni.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		appMetric := metric.NewHTTP(r.URL.Path, r.Method)
		appMetric.Started()
		next(w, r)
		res := w.(negroni.ResponseWriter)
		appMetric.Finished()
		appMetric.StatusCode = strconv.Itoa(res.Status())
		mService.SaveHTTP(appMetric)
	}
}
