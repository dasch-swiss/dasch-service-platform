package server

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
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

func TestAPI404(t *testing.T) {
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
}

var apiTestcases = []APIRes{
	{"/api/v1/status", "/api/v1/status", "OK", "OK", true},
	{"/api/v1/status", "/api/v1/status", "OK", "Ok", false},
	{"/", "/", "OK", "Ok", false},
}

// TODO: do something reasonable here
func TestAPI(t *testing.T) {
	for _, test := range apiTestcases {
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
	}
}

func TestSPA(t *testing.T) {
	s := NewAPISPAServer("8080")

	r := &s.Router

	// s.SetSPA("../../../../public")
	s.SetSPA("../../../../shared/go/pkg/server/testfiles")

	r.HandleFunc("/api", http.NotFound)
	r.HandleFunc("/api/v1", func(rw http.ResponseWriter, r *http.Request) { io.WriteString(rw, "OK") })

	go func() {
		fmt.Println("Serving...")
		s.ListenAndServe()
	}()
	time.Sleep(100 * time.Millisecond)

	t.Run("Testing 404 on API Route", func(t *testing.T) {
		rs := make(chan int, 1)
		go func() {
			res, _ := http.Get("http://localhost:8080/api")
			rs <- res.StatusCode
		}()

		code := <-rs
		assert.Equal(t, 404, code)
	})

	t.Run("Testing 200 on API Route", func(t *testing.T) {
		rs := make(chan int, 1)
		go func() {
			res, _ := http.Get("http://localhost:8080/api/v1")
			rs <- res.StatusCode
		}()

		code := <-rs
		assert.Equal(t, 200, code)
	})
	fmt.Println(os.Getwd())
	t.Run("Testing SPA Route", func(t *testing.T) {
		rs := make(chan int, 1)
		go func() {
			res, _ := http.Get("http://localhost:8080/public/global.css")
			rs <- res.StatusCode
		}()

		code := <-rs
		assert.Equal(t, 200, code)
	})

}
