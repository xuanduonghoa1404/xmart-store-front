import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, TileLayer, Tooltip as TooltipMap } from "react-leaflet";
import L from "leaflet";
import leafletKnn from "leaflet-knn";
import * as ELG from "esri-leaflet-geocoder";
import { Row, Col } from "reactstrap";
import Input from "../../components/Common/Input";
import SelectOption from "../../components/Common/SelectOption";
import Button from "../../components/Common/Button";

const ShippingAddress = (props) => {
  const {
    user,
    updateAddress,
    locators,
    formErrors,
    shippingAddressChange,
    locatorChange,
    shippingAddress,
    selectAddress,
    placeOrder,
  } = props;
  const { name, phone, email, _id, address } = user;
  const defaultAddress = address?.find((a) => a.isDefault === true);

  const mapCheckoutRef = useRef();
  const apiKey = process.env.REACT_APP_GEOCODER_API_KEY;
  // "AAPKb10821df102a46a4b930958d7a6a06593sdla7i0cMWoosp7XXlYflDTAxsZMUq-oKvVOaom9B8CokPvJFd-sE88vOQ2B_rC";
  const [addressMap, setAddressMap] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const addressSelect = [];
  address?.map((addr) => {
    let a = { value: addr._id, label: addr.address };
    addressSelect.push(a);
  });

  useEffect(() => {
    const map = mapCheckoutRef?.current?.leafletElement;

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
    results.addLayer(
      L.marker({ lat: address?.lat || 33.8688, lng: address?.lng || 151.2093 })
    );
    searchControl.on("results", function (data) {
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
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
          shippingAddressChange(
            "lat",
            Math.round(result.latlng.lat * 100000) / 100000 || 0
          );
          shippingAddressChange(
            "lng",
            Math.round(result.latlng.lng * 100000) / 100000 || 0
          );
          shippingAddressChange("city", result.address.City || "");
          shippingAddressChange("country", result.address.CntryName || "");
          shippingAddressChange(
            "address",
            `${result.address.Address} ${result.address.Neighborhood}` || ""
          );
          shippingAddressChange("state", result.address.District || "");
          shippingAddressChange("zipCode", result.address.Postal || "");
          let locatorSorted = handleSelectLocatorByDistance(
            Math.round(result.latlng.lat * 100000) / 100000,
            Math.round(result.latlng.lng * 100000) / 100000
          );
          // locatorSorted = locatorSorted?.map((locator) => {
          //   return {
          //     lat: locator.lat,
          //     lng: locator.lon,
          //   };
          // });
          // console.log("locatorSorted", locatorSorted);
          locatorChange(locatorSorted);
          marker.openPopup();
        });
    });
  }, []);

  const convertLngLatToObjectJSON = (lng, lat) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };
  };
  const handleSelectLocatorByDistance = (lat, lng) => {
    const listLocatorsFeature = {
      type: "FeatureCollection",
      features: [],
    };
    locators.map((locator) => {
      listLocatorsFeature.features.push(
        convertLngLatToObjectJSON(locator?.lng || 0, locator?.lat || 0)
      );
    });
    console.log("locators", locators);

    let gj = L.geoJson(listLocatorsFeature);
    let nearest = leafletKnn(gj).nearest(L.latLng(lat, lng), locators.length);
    let locatorSorted = [];
    nearest.map((item) => {
      let selected = locators.find(
        (locator) =>
          locator?.lat?.toString() == item?.lat?.toString() &&
          locator?.lng?.toString() == item?.lon?.toString()
      );
      locatorSorted.push(selected._id);
    });
    console.log("locatorSorted", locatorSorted);

    return locatorSorted;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateAddress();
  };

  const mapComponent = (
    <Row map style={{ height: 300, with: 600 }}>
      <Map
        style={{ height: "100%", width: "100%" }}
        zoom={13}
        center={[
          address?.lat || locators[0]?.lat || 33.8688,
          address?.lng || locators[0]?.lng || 151.2093,
        ]}
        zoomControl={false}
        // onClick={handleSelectPosition}
        ref={mapCheckoutRef}
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
                iconSize: [40, 40],
                iconAnchor: [40, 40],
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
  );
  const formAddress = address?.length ? (
    <div className="edit-address">
      <form onSubmit={handleSubmit} noValidate>
        {mapComponent}
        <SelectOption
          value={addressSelect.value}
          options={addressSelect}
          handleSelectChange={(value) => {
            selectAddress("id", value);
            let addressSelected = address.filter(
              (item) => item._id == value.value
            );
            addressSelected = addressSelected[0];
            setLat(Math.round(addressSelected.lat * 100000) / 100000 || 0);
            setLng(Math.round(addressSelected.lat * 100000) / 100000 || 0);
            shippingAddressChange(
              "lat",
              Math.round(addressSelected.lat * 100000) / 100000 || 0
            );
            shippingAddressChange(
              "lng",
              Math.round(addressSelected.lng * 100000) / 100000 || 0
            );
            shippingAddressChange("city", addressSelected.city || "");
            shippingAddressChange("country", addressSelected.country || "");
            shippingAddressChange(
              "address",
              `${addressSelected.address}` || ""
            );
            shippingAddressChange("state", addressSelected.state || "");
            shippingAddressChange("zipCode", addressSelected.zipCode || "");
            shippingAddressChange("name", addressSelected.name || "");
            shippingAddressChange("phone", addressSelected.phone || "");
          }}
          label={"Chọn địa chỉ của bạn"}
        ></SelectOption>
        <Row>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Người nhận"}
              name={"name"}
              placeholder={"Người nhận"}
              value={shippingAddress.name}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Số điện thoại"}
              name={"phone"}
              placeholder={"Số điện thoại"}
              value={shippingAddress.phone}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Địa chỉ"}
              name={"address"}
              placeholder={"Số nhà, Phố Phường"}
              value={addressMap ? addressMap : shippingAddress.address || ""}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["state"]}
              label={"Quận/Huyện"}
              name={"state"}
              placeholder={"Quận Hai Bà Trưng"}
              value={state ? state : shippingAddress.state}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["city"]}
              label={"Thành phố"}
              name={"city"}
              placeholder={"Hà Nội"}
              value={city ? city : shippingAddress.city}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>

          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["country"]}
              label={"Quốc gia"}
              name={"country"}
              placeholder={"Việt Nam"}
              value={country ? country : shippingAddress.country}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["zipCode"]}
              label={"Mã bưu điện"}
              name={"zipCode"}
              placeholder={"VD: 10000"}
              value={zipcode ? zipcode : shippingAddress.zipCode}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              label={"Lat"}
              // error={formErrors["lat"]}
              name={"lat"}
              value={lat ? lat : shippingAddress.lat}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              // error={formErrors["lng"]}
              label={"Lng"}
              name={"lng"}
              value={lng ? lng : shippingAddress.lng}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className="d-flex flex-column flex-md-row">
          <Button
            onClick={() => placeOrder()}
            text="Lưu"
            variant="danger"
            className="mb-3 mb-md-0 mr-0 mr-md-3"
          />
        </div>
      </form>
    </div>
  ) : (
    <div className="edit-address">
      <form onSubmit={handleSubmit} noValidate>
        {mapComponent}
        <SelectOption
          value={defaultAddress?._id || ""}
          options={addressSelect}
          handleSelectChange={(value) => {
            selectAddress("id", value);
          }}
          label={"Chọn địa chỉ của bạn"}
        ></SelectOption>
        <Row>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Người nhận"}
              name={"name"}
              placeholder={"Người nhận"}
              value={name}
              onInputChange={(name, value) => {
                shippingshippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Số điện thoại"}
              name={"phone"}
              placeholder={"Số điện thoại"}
              value={phone}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Địa chỉ"}
              name={"address"}
              placeholder={"Số nhà, Phố Phường"}
              value={address || ""}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["state"]}
              label={"Quận/Huyện"}
              name={"state"}
              placeholder={"Quận Hai Bà Trưng"}
              value={state || ""}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["city"]}
              label={"Thành phố"}
              name={"city"}
              placeholder={"Hà Nội"}
              value={city}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>

          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["country"]}
              label={"Quốc gia"}
              name={"country"}
              placeholder={"Việt Nam"}
              value={country}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["zipCode"]}
              label={"Mã bưu điện"}
              name={"zipCode"}
              placeholder={"VD: 10000"}
              value={zipcode}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              label={"Lat"}
              // error={formErrors["lat"]}
              name={"lat"}
              value={lat}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              // error={formErrors["lng"]}
              label={"Lng"}
              name={"lng"}
              value={lng}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className="d-flex flex-column flex-md-row">
          <Button
            onClick={() => placeOrder()}
            text="Lưu"
            variant="danger"
            className="mb-3 mb-md-0 mr-0 mr-md-3"
          />
        </div>
      </form>
    </div>
  );

  return (
    <div>
      {/* <SelectOption
        value={defaultAddress?._id || ''}
        options={addressSelect}
        handleSelectChange={(value) => {
          selectAddress("id", value);
        }}
      ></SelectOption> */}
      {formAddress}
    </div>
  );
};;

export default ShippingAddress;
