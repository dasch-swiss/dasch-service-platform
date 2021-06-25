package server

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

type APIRes struct {
	apiRoute     string
	requestRoute string
	apiResponse  string
	expected     string
	shouldPass   bool
}

var apiTestcases = []APIRes{
	{"/api/v1/status", "/api/v1/status", "OK", "OK", true},
	{"/api/v1/status", "/api/v1/status", "OK", "Ok", false},
	{"/", "/", "OK", "Ok", false},
}

func TestAPI(t *testing.T) {
	for i, test := range apiTestcases {
		t.Run(fmt.Sprintf("Test API No %v", i), func(t *testing.T) {
			s := NewAPISPAServer("8080")

			r := &s.Router
			r.HandleFunc(test.apiRoute, func(w http.ResponseWriter, r *http.Request) {
				res := []byte(test.apiResponse)
				w.Write(res)
			}).Methods("GET")
			r.HandleFunc("/", http.NotFound).Methods("GET")

			h := s.prepare(false).Handler
			ts := httptest.NewServer(h)
			defer ts.Close()

			res, err := http.Get(ts.URL + test.requestRoute)
			if err != nil {
				t.Fatal(err)
			}

			body, err := ioutil.ReadAll(res.Body)
			res.Body.Close()
			if err != nil {
				t.Fatal(err)
			}

			if test.shouldPass {
				assert.Equal(t, test.expected, string(body))
			} else {
				assert.NotEqual(t, test.expected, string(body))
			}
		})
	}
	t.Run("Test API return 404", func(t *testing.T) {
		s := NewAPISPAServer("8080")

		r := &s.Router
		r.HandleFunc("/", http.NotFound)

		h := s.prepare(false).Handler
		ts := httptest.NewServer(h)
		defer ts.Close()

		res, err := http.Get(ts.URL + "/")
		if err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, res.StatusCode, 404)
	})
	t.Run("Test API return 200", func(t *testing.T) {
		s := NewAPISPAServer("8080")

		r := &s.Router
		r.HandleFunc("/status", func(rw http.ResponseWriter, r *http.Request) { io.WriteString(rw, "OK") })

		h := s.prepare(false).Handler
		ts := httptest.NewServer(h)
		defer ts.Close()

		res, err := http.Get(ts.URL + "/status")
		if err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, res.StatusCode, 200)
	})
}

type SPARes struct {
	desc        string
	request     string
	expFile     string
	contentType string
}

var spaTestcases = []SPARes{
	{"Test root", "/", "index.html", "text/html; charset=utf-8"},
	{"Test root-index", "/index.html", "index.html", "text/html; charset=utf-8"},
	{"Test root-css", "/global.css", "global.css", "text/css; charset=utf-8"},
	{"Test subfolder-css", "/build/bundle.css", "build/bundle.css", "text/css; charset=utf-8"},
	{"Test subfolder-js", "/build/bundle.js", "build/bundle.js", "application/javascript"},
	{"Test spa-route-index-1", "/project/index.html", "index.html", "text/html; charset=utf-8"},
	{"Test spa-route-index-2", "/project/admin/index.html", "index.html", "text/html; charset=utf-8"},
	{"Test spa-route-index-3", "/project/admin/id/1234/index.html", "index.html", "text/html; charset=utf-8"},
	{"Test spa-route-css", "/project/admin/id/1234/global.css", "global.css", "text/css; charset=utf-8"},
	{"Test spa-route-subfolder-css", "/project/admin/id/1234/build/bundle.css", "build/bundle.css", "text/css; charset=utf-8"},
	{"Test query", "/projects?_page=1&_limit=9", "index.html", "text/html; charset=utf-8"},
	{"Test non-existing-file", "/something/nonsense.txt", "index.html", "text/html; charset=utf-8"},
}

func TestSPA(t *testing.T) {

	s := NewAPISPAServer("8080")
	s.SetSPA("testfiles")

	h := s.prepare(false).Handler
	ts := httptest.NewServer(h)
	defer ts.Close()

	for _, test := range spaTestcases {
		t.Run(test.desc, func(t *testing.T) {
			res, err := http.Get(ts.URL + test.request)
			if err != nil {
				t.Fatal(err)
			}
			t.Run("Test status code", func(t *testing.T) {
				assert.Equal(t, 200, res.StatusCode)
			})
			t.Run("Test content-type", func(t *testing.T) {
				assert.Equal(t, test.contentType, res.Header.Get("Content-Type"))
			})
			t.Run("Test content", func(t *testing.T) {
				body, _ := ioutil.ReadAll(res.Body)
				exp, err := ioutil.ReadFile("testfiles/" + test.expFile)
				if err != nil {
					t.Fatalf("Could not read reference file %v from disc", test.expFile)
				}
				assert.Equal(t, exp, body)
			})
		})
	}
}

func TestServer(t *testing.T) {
	s := NewAPISPAServer("8079")
	r := &s.Router
	r.HandleFunc("/status", func(rw http.ResponseWriter, r *http.Request) { io.WriteString(rw, "OK") })
	serverRes := make(chan error)
	go func() {
		err := s.ListenAndServe()
		fmt.Println("here")
		serverRes <- err
	}()
	time.Sleep(100 * time.Millisecond)

	t.Run("Test server running", func(t *testing.T) {
		res, err := http.Get("http://localhost:8079/status")
		if err != nil {
			t.Fatal(err)
		}
		assert.Equal(t, "200 OK", res.Status)
		assert.NotEqual(t, 0, res.StatusCode)
	})

	t.Run("Test server shutdown", func(t *testing.T) {
		s.Shutdown()
		time.Sleep(100 * time.Millisecond)
		res := <-serverRes
		assert.NotNil(t, res)
	})
}
