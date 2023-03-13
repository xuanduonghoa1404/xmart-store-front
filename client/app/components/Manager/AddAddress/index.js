/**
 *
 * AddAddress
 *
 */

import React, { useRef, useState, useEffect } from "react";

import { Row, Col } from "reactstrap";

import Checkbox from "../../Common/Checkbox";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { Map, Marker, TileLayer, Tooltip as TooltipMap } from "react-leaflet";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import leafletKnn from "leaflet-knn";

const AddAddress = (props) => {
  const {
    addressFormData,
    formErrors,
    addressChange,
    addAddress,
    user,
    locators,
  } = props;
  const mapRef = useRef();
  const apiKey = process.env.REACT_APP_GEOCODER_API_KEY;
  // "AAPKb10821df102a46a4b930958d7a6a06593sdla7i0cMWoosp7XXlYflDTAxsZMUq-oKvVOaom9B8CokPvJFd-sE88vOQ2B_rC";

  const [addressMap, setAddressMap] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    const map = mapRef?.current?.leafletElement;

    const searchControl = new ELG.geosearch({
      useMapBounds: false,
      position: "topleft",
      placeholder: "Tìm địa chỉ",
      providers: [
        ELG.arcgisOnlineProvider({
          apikey: apiKey,
          nearby: {
            lat: -33.8688,
            lng: 151.2093,
          },
        }),
      ],
    }).addTo(map);

    const results = new L.LayerGroup().addTo(map);
    // results.addLayer(
    //   L.marker({ lat: addressFormData.lat, lng: addressFormData.lng })
    // );
    console.log("search ne");
    searchControl.on("results", function (data) {
      results.clearLayers();
      console.log("search control", data);
      for (let i = data.results.length - 1; i >= 0; i--) {
        console.log("data.results[i]", data.results[i]);
        results.addLayer(L.marker(data.results[i].latlng));
        let result = data.results[i];
        setCity(result.properties.City);
        setCountry(result.properties.CntryName);
        setAddressMap(
          `${result.properties.Address} ${result.properties.Neighborhood}`
        );

        setState(result.properties.District);
        setZipcode(result.properties.Postal);
        setLat(Math.round(result.latlng.lat * 100000) / 100000);
        setLng(Math.round(result.latlng.lng * 100000) / 100000);
        addressChange(
          "lat",
          Math.round(result.latlng.lat * 100000) / 100000 || 0
        );
        addressChange(
          "lng",
          Math.round(result.latlng.lng * 100000) / 100000 || 0
        );
        addressChange("city", result.properties.City || "");
        addressChange("country", result.properties.CntryName || "");
        addressChange(
          "address",
          `${result.address.Address} ${result.properties.Neighborhood}` || ""
        );
        addressChange("state", result.properties.District || "");
        addressChange("zipCode", result.properties.Postal || "");
      }
    });
    map.on("click", function (e) {
      ELG.reverseGeocode({
        apikey: apiKey,
      })
        .latlng(e.latlng)

        .run(function (error, result) {
          if (error) {
            return;
          }

          results.clearLayers();

          let marker = L.marker(result.latlng).addTo(results);
          // let nearest = nearestLocatorByDistance(result.latlng)[0];
          // nearest.layer
          //   .bindPopup("I'm nearest to where you clicked!")
          //   .openPopup();
          const lngLatString = `${
            Math.round(result.latlng.lng * 100000) / 100000
          }, ${Math.round(result.latlng.lat * 100000) / 100000}`;

          marker.bindPopup(
            `<b>${lngLatString}</b><p>${result.address.Match_addr}</p>`
          );
          setCity(result.address.City);
          setCountry(result.address.CntryName);
          setAddressMap(
            `${result.address.Address} ${result.address.Neighborhood}`
          );

          setState(result.address.District);
          setZipcode(result.address.Postal);
          setLat(Math.round(result.latlng.lat * 100000) / 100000);
          setLng(Math.round(result.latlng.lng * 100000) / 100000);
          addressChange(
            "lat",
            Math.round(result.latlng.lat * 100000) / 100000 || 0
          );
          addressChange(
            "lng",
            Math.round(result.latlng.lng * 100000) / 100000 || 0
          );
          addressChange("city", result.address.City || "");
          addressChange("country", result.address.CntryName || "");
          addressChange(
            "address",
            `${result.address.Address} ${result.address.Neighborhood}` || ""
          );
          addressChange("state", result.address.District || "");
          addressChange("zipCode", result.address.Postal || "");
          marker.openPopup();
        });
    });
    function onLocationFound(e) {
      var radius = e.accuracy;

      L.marker(e.latlng)
        .addTo(map)
        .bindPopup("You are within " + radius + " meters from this point")
        .openPopup();

      L.circle(e.latlng, radius).addTo(map);
    }
    map.on("locationfound", onLocationFound);
  }, []);

  const listLocatorsFeature = {
    type: "FeatureCollection",
    features: [],
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    addAddress();
  };

  return (
    <div className="add-address">
      <form onSubmit={handleSubmit} noValidate>
        <Row map style={{ height: 300, with: 600 }}>
          <Map
            style={{ height: "100%", width: "100%" }}
            zoom={13}
            center={[
              addressFormData.lat || locators[0]?.lat || 0,
              addressFormData.lng || locators[0]?.lng || 0,
            ]}
            zoomControl={false}
            // onClick={handleSelectPosition}
            ref={mapRef}
          >
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locators?.map((locator, index) => {
              return (
                <Marker
                  position={[locator.lat, locator.lng]}
                  icon={L.icon({
                    iconUrl:
                      "https://res.cloudinary.com/hoaduonghx/image/upload/v1669541451/image/wsf2f8vtuxfdcuzpmxpg.png",
                    iconSize: [41, 41],
                    iconAnchor: [41, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                  })}
                >
                  <TooltipMap offset={[12.5, -22.5]}>
                    <b>{locator.address}</b>
                  </TooltipMap>
                </Marker>
              );
            })}
          </Map>
        </Row>
        <Row>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              error={formErrors["name"]}
              label={"Người nhận"}
              name={"name"}
              placeholder={"Người nhận"}
              value={addressFormData.name}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              error={formErrors["phone"]}
              label={"Số điện thoại"}
              name={"phone"}
              placeholder={"Số điện thoại"}
              value={addressFormData.phone}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              error={formErrors["address"]}
              label={"Địa chỉ"}
              name={"address"}
              placeholder={"Số nhà, Phố Phường"}
              value={addressFormData.address || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              error={formErrors["state"]}
              label={"Quận/Huyện"}
              name={"state"}
              placeholder={"Quận Hai Bà Trưng"}
              value={addressFormData.state || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              error={formErrors["city"]}
              label={"Thành phố"}
              name={"city"}
              placeholder={"Hà Nội"}
              value={addressFormData.city || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>

          <Col xs="12" lg="6">
            <Input
              type={"text"}
              error={formErrors["country"]}
              label={"Quốc gia"}
              name={"country"}
              placeholder={"Việt Nam"}
              value={addressFormData.country || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              error={formErrors["zipCode"]}
              label={"Mã bưu điện"}
              name={"zipCode"}
              placeholder={"VD: 10000"}
              value={addressFormData.zipCode || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              label={"Lat"}
              error={formErrors["lat"]}
              name={"lat"}
              value={addressFormData.lat || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              error={formErrors["lng"]}
              label={"Lng"}
              name={"lng"}
              value={addressFormData.lng || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="12">
            {/* <Checkbox
              id={"default"}
              label={"Chọn làm địa chỉ mặc định"}
              name={"isDefault"}
              checked={addressFormData.isDefault}
              value={addressFormData.isDefault}
              toggleCheckboxChange={(name, value) => {
                addressChange(name, value);
              }}
            /> */}
          </Col>
        </Row>
        <hr />
        <div className="add-address-actions">
          <Button type="submit" text="Thêm địa chỉ" />
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
