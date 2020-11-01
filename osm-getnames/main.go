package main

import (
	"os"
	"fmt"
	"bufio"
	"io"
	"encoding/json"
	"strings"
	"strconv"
	"compress/bzip2"
	"net/http"
)

type Name struct {
	Name string
	Names map[string]string
	AdminLevel int
	Place string
	Lat float64
	Long float64
}

func main() {
	if len(os.Args) < 2 {
		panic("need to invoke with link or path to planet.osm or planet.osm.bz2 file")
	}
	var bz2 bool
	if strings.HasSuffix(os.Args[1], "bz2") {
		bz2 = true
	}
	var file io.Reader
	resp, err := http.Get(os.Args[1])
	if err != nil {
		file, err = os.Open(os.Args[1])
	} else {
		file = resp.Body
	}
	if err != nil {
		panic("error reading file: " + err.Error())
	}
	if bz2 {
		file = bzip2.NewReader(file)
	}
	fb := bufio.NewReader(file)
	var node, place bool
	var line string
	var name Name
	var counter, old int64
	for err == nil {
		line, err = fb.ReadString('\n')
		counter += int64(len(line))
		if counter > old + 1000000000 {
			old = counter
			print(".")
		}
		if len(line) < 7 {
			continue
		}
		switch {
		case strings.Contains(line,"<node"):
			node = true
			lati := strings.Index(line, "lat=\"")
			if lati == -1 {
				node = false
				continue
			}
			lats := line[lati+5:strings.Index(line[lati+5:], "\"")+lati+5]
			loni := strings.Index(line, "lon=\"")
			if loni == -1 {
				node = false
				continue
			}
			lons := line[loni+5:strings.Index(line[loni+5:], "\"")+loni+5]
			lat, _ := strconv.ParseFloat(lats, 64)
			lon, _ := strconv.ParseFloat(lons, 64)
			name = Name{Lat: lat, Long: lon, Names: map[string]string{}}
		case strings.Contains(line, "k=\"name\""):
			if !node {
				continue
			}
			namei := strings.Index(line, "v=\"")
			if namei == -1 {
				node = false
				continue
			}
			name.Name = line[namei+3:strings.Index(line[namei+3:],"\"")+namei+3]
		case strings.Contains(line, "k=\"name"):
			if !node {
				continue
			}
			langi := strings.Index(line, "k=\"name:")
			if langi == -1 {
				node = false
				continue
			}
			namei := strings.Index(line, "v=\"")
			if namei == -1 {
				node = false
				continue
			}
			lang := line[langi+8:strings.Index(line[langi+8:],"\"")+langi+8]
			name.Names[lang] = line[namei+3:strings.Index(line[namei+3:],"\"")+namei+3]
		case strings.Contains(line, "k=\"alt_name"):
			if !node {
				continue
			}
			langi := strings.Index(line, "k=\"")
			if langi == -1 {
				node = false
				continue
			}
			namei := strings.Index(line, "v=\"")
			if namei == -1 {
				node = false
				continue
			}
			lang := line[langi+3:strings.Index(line[langi+3:],"\"")+langi+3]
			name.Names[lang] = line[namei+3:strings.Index(line[namei+3:],"\"")+namei+3]
		case strings.Contains(line, "k=\"place\""):
			if !node {
				continue
			}
			placei := strings.Index(line, "v=\"")
			if placei == -1 {
				node = false
				continue
			}
			name.Place = line[placei+3:strings.Index(line[placei+3:],"\"")+placei+3]
			switch name.Place {
			case "country", "state", "region", "province", "district", "county", "municipality":
				fallthrough
			case "city", "borough", "suburb", "quarter", "neighborhood", "city_block", "plot":
				fallthrough
			case "town", "isolated_dwelling", "farm", "allotments":
				fallthrough
			case "village", "hamlet", "locality": // there are a LOT of these,
				fallthrough  // and while they can be useful for navigation,
						// they make the file way too big...
			case "continent", "archipelago", "island", "islet", "square", "sea", "ocean":
				place = true
			}
		case strings.Contains(line, "k=\"admin_level\""):
			if !node {
				continue
			}
			admi := strings.Index(line, "v=\"")
			if admi == -1 {
				node = false
				continue
			}
			admlvl := line[admi+3:strings.Index(line[admi+3:],"\"")+admi+3]
			name.AdminLevel, _ = strconv.Atoi(admlvl)
		case strings.Contains(line, "</node>"):
			if !node {
				continue
			}
			if !place {
				node = false
				place = false
				continue
			}
			if name.Name == "" {
				node = false
				continue
			}
			output, _ := json.Marshal(name)
			fmt.Println(string(output))
			node = false
			place = false
		}
	}
}
