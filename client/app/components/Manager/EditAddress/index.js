/**
 *
 * Edit Address
 *
 */

import React, { useCallback, useEffect, useRef, useState } from "react";

import { Row, Col } from "reactstrap";

import Checkbox from "../../Common/Checkbox";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { Map, Marker, TileLayer, Tooltip as TooltipMap } from "react-leaflet";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import leafletKnn from "leaflet-knn";

const EditAddress = (props) => {
  const {
    address,
    addressChange,
    defaultChange,
    formErrors,
    updateAddress,
    locators,
    deleteAddress,
    user,
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
    results.addLayer(L.marker({ lat: address.lat, lng: address.lng }));
    searchControl.on("results", function (data) {
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        console.log("data.results[i].latlng", data.results[i].latlng);
        results.addLayer(L.marker(data.results[i].latlng));
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
          let nearest = nearestLocatorByDistance(result.latlng)[0];
          nearest.layer
            .bindPopup("I'm nearest to where you clicked!")
            .openPopup();
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
  }, []);

  const listLocatorsFeature = {
    type: "FeatureCollection",
    features: [],
  };
  const convertLngLatToObjectJSON = (lng, lat) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };
  };
  const nearestLocatorByDistance = (lnglat) => {
    console.log("handleSelectLocatorByDistance");
    locators.map((locator) => {
      listLocatorsFeature.features.push(
        convertLngLatToObjectJSON(locator.lng, locator.lat)
      );
    });
    let gj = L.geoJson(listLocatorsFeature);
    let nearest = leafletKnn(gj).nearest(L.latLng(lnglat.lat, lnglat.lng), 1);
    // let selected = listLocator.find(
    //   (locator) => locator.lat === nearest.lat && locator.lng === nearest.lon
    // );
    // setSelectedLocator(value);
    console.log("nearest", nearest);
    return nearest;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    updateAddress();
  };
  const handleSelectPosition = useCallback((e) => {
    console.log("hhehehe click ne", e.latlng);
    // const map = mapRef?.current?.leafletElement;
    // const layerGroup = new L.LayerGroup().addTo(map);
    // ELG.reverseGeocode({
    //   apikey: apiKey,
    // })
    //   .latlng(e.latlng)

    //   .run(function (error, result) {
    //     if (error) {
    //       return;
    //     }
    //     console.log("result", result);

    //     layerGroup.clearLayers();

    //     let marker = L.marker(result.latlng).addTo(layerGroup);

    //     const lngLatString = `${
    //       Math.round(result.latlng.lng * 100000) / 100000
    //     }, ${Math.round(result.latlng.lat * 100000) / 100000}`;

    //     marker.bindPopup(
    //       `<b>${lngLatString}</b><p>${result.address.Match_addr}</p>`
    //     );
    //     marker.openPopup();
    //   });
  }, []);

  return (
    <div className="edit-address">
      <form onSubmit={handleSubmit} noValidate>
        <Row map style={{ height: 300, with: 600 }}>
          <Map
            style={{ height: "100%", width: "100%" }}
            zoom={13}
            center={[
              address.lat || locators[0].lat,
              address.lng || locators[0].lng,
            ]}
            zoomControl={false}
            onClick={handleSelectPosition}
            ref={mapRef}
          >
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <Marker
              position={[
                address.latitude || 21.028511,
                address.longitude || 105.804817,
              ]}
            ></Marker> */}
            {locators?.map((locator, index) => {
              return (
                <Marker
                  position={[locator.lat, locator.lng]}
                  icon={L.icon({
                    iconUrl:
                      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
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
              value={address.name || user.name}
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
              value={address.phone || user.phone}
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
              value={addressMap ? addressMap : address.address}
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
              value={state ? state : address.state}
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
              value={city ? city : address.city}
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
              value={country ? country : address.country}
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
              value={zipcode ? zipcode : address.zipCode}
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
              value={lat ? lat : address.lat}
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
              value={lng ? lng : address.lng}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="12">
            <Checkbox
              id={"default"}
              label={"Chọn làm địa chỉ mặc định"}
              name={"isDefault"}
              checked={address.isDefault}
              value={address.isDefault}
              toggleCheckboxChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className="d-flex flex-column flex-md-row">
          <Button
            type="submit"
            text="Lưu"
            variant="danger"
            className="mb-3 mb-md-0 mr-0 mr-md-3"
          />
          <Button
            text="Xóa địa chỉ"
            onClick={() => deleteAddress(address._id)}
          />
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
